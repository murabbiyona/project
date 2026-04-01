import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Telegram Notification Edge Function
 * Dars tugaganda ustoz telefoniga xabar yuboradi:
 * - Nechta o'quvchi baholangan
 * - Baho taqsimoti (5-lar, 4-lar, 3-lar, 2-lar)
 * - O'rtacha ball
 */
Deno.serve(async (req: Request) => {
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
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Avtorizatsiya talab qilinadi" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Autentifikatsiya xatosi" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse body
    const {
      className,
      subjectName,
      lessonTitle,
      totalStudents,
      assessedCount,
      averageScore,
      gradeDistribution, // { 5: count, 4: count, 3: count, 2: count }
      duration, // minutes
    } = await req.json();

    // Get teacher profile for telegram_id
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("telegram_id, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.telegram_id) {
      return new Response(
        JSON.stringify({
          error: "Telegram ID topilmadi. Profilingizda Telegram ID ni kiriting.",
          sent: false,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build message
    const dist = gradeDistribution || {};
    const message = `📊 *DARS YAKUNI*

🏫 *${className}* sinfi | ${subjectName}
📖 ${lessonTitle || "Dars"}
⏱ Davomiyligi: ${duration || "—"} daqiqa

👥 *Baholangan:* ${assessedCount}/${totalStudents} o'quvchi
📈 *O'rtacha ball:* ${averageScore}%

📋 *Baho taqsimoti:*
🟢 A'lo (5): ${dist[5] || 0} ta
🔵 Yaxshi (4): ${dist[4] || 0} ta
🟡 Qoniqarli (3): ${dist[3] || 0} ta
🔴 Qoniqarsiz (2): ${dist[2] || 0} ta

${assessedCount < totalStudents ? `⚠️ ${totalStudents - assessedCount} ta o'quvchi baholanmagan` : "✅ Barcha o'quvchilar baholandi"}

_Murabbiyona LMS • ${new Date().toLocaleDateString("uz-UZ")}_`;

    // Send via Telegram Bot API
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!botToken) {
      return new Response(
        JSON.stringify({ error: "Telegram bot token sozlanmagan", sent: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: profile.telegram_id,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      return new Response(
        JSON.stringify({
          error: `Telegram xatosi: ${telegramData.description}`,
          sent: false,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ sent: true, message_id: telegramData.result.message_id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Telegram notify error:", error);
    return new Response(
      JSON.stringify({ error: "Xatolik yuz berdi", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
