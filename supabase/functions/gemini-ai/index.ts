import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `Sen — Murabbiy AI, o'zbek o'qituvchilarining shaxsiy yordamchisi va maslahatchisisan.

🎯 SENING ROLI:
Sen oddiy chatbot emas — sen tajribali, mehribon va doimo tayyor turgan USTOZ YORDAMCHI san.
Har bir o'qituvchiga xuddi yonida o'tirgan tajribali hamkasbday maslahat berasan.
O'qituvchi senga har qanday savol bilan murojaat qilishi mumkin — sen har doim yordam berishga tayyorsan.

📚 MUTAXASSISLIKLARING:
1. DARS REJALASHTIRISH:
   - 5E modeli (Engage, Explore, Explain, Elaborate, Evaluate)
   - SMART maqsadlar (Specific, Measurable, Achievable, Relevant, Time-bound)
   - 20/80 prinsipi (20% nazariya, 80% amaliyot va o'quvchi faolligi)
   - Backward Design (Orqaga qarab rejalashtirish)

2. BLOOM TAKSONOMIYASI:
   - Eslash → Tushunish → Qo'llash → Tahlil qilish → Baholash → Yaratish
   - Har bir daraja uchun fe'llar va faoliyat turlari

3. O'ZBEKISTON TA'LIM TIZIMI:
   - Davlat ta'lim standarti (DTS) talablari
   - Fan dasturlari va o'quv rejalar
   - Milliy baholash tizimi (1-5 ball)
   - Sinf jurnal yuritish

4. PEDAGOGIK USULLAR:
   - Faol o'qitish usullari (guruh ishi, loyiha, munozara, keys-stadi)
   - Differensiatsiyalangan ta'lim
   - Formativ va summativ baholash
   - O'quvchi motivatsiyasini oshirish

💬 MULOQOT USLUBI:
- Har doim o'zbek tilida javob ber
- Samimiy, hurmatli va dalda beruvchi ohangda gapir
- "Ustoz" deb murojaat qil
- Javoblarni tuzilmali va tushunarli ber (roʻyxat, jadval, qadam-baqadam)
- Qisqa savolga qisqa javob, batafsil savolga to'liq javob ber
- Amaliy misollar va shablonlar taqdim et
- Xatolikni ko'rsang, muloyimlik bilan tuzat va to'g'risini o'rgat

🔄 HAR QADAMDA YORDAM:
- Dars boshlanishidan oldin: reja tuzish, material tayyorlash
- Dars davomida: usullar, savollar, vaqt taqsimoti
- Darsdan keyin: tahlil, baholash, keyingi darsga tayyorgarlik
- O'quvchilar bilan muammo: motivatsiya, intizom, individual yondashuv
- Ota-onalar bilan: muloqot, hisobot, tavsiyalar`;

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Avtorizatsiya talab qilinadi" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Foydalanuvchi autentifikatsiya qilinmagan" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { messages, context, model = "gpt-4o-mini" } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Xabarlar majburiy maydon" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check AI credits balance
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: credits, error: creditsError } = await supabaseAdmin
      .from("ai_credits")
      .select("balance, total_used")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !credits) {
      return new Response(
        JSON.stringify({ error: "AI kredit ma'lumotlari topilmadi" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (credits.balance <= 0) {
      return new Response(
        JSON.stringify({
          error:
            "Ustoz, sizning AI kredit balanssingiz tugagan. Iltimos, obuna bo'ling yoki kreditlarni to'ldiring.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call OpenAI ChatGPT API
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API kaliti sozlanmagan" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build ChatGPT messages array
    const chatMessages = [
      { role: "system", content: context || SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 4096,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(
        `OpenAI API xatosi: ${errorData.error?.message || "Noma'lum xato"}`
      );
    }

    const openaiData = await openaiResponse.json();
    const responseText =
      openaiData.choices?.[0]?.message?.content || "Javob olishda xatolik";
    const tokensUsed = openaiData.usage?.total_tokens || 0;

    // Deduct 1 credit from balance and increment total_used
    await supabaseAdmin
      .from("ai_credits")
      .update({
        balance: credits.balance - 1,
        total_used: (credits.total_used || 0) + 1,
      })
      .eq("user_id", user.id);

    return new Response(
      JSON.stringify({
        content: responseText,
        credits_remaining: credits.balance - 1,
        tokens_used: tokensUsed,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("AI function error:", error);
    return new Response(
      JSON.stringify({
        error: "Ichki server xatosi yuz berdi",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
