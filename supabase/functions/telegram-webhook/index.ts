import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Telegram Webhook Edge Function
 * Bot ga /start bosilganda avtomatik chat_id ni oladi va profiles ga saqlaydi.
 *
 * Flow:
 * 1. Ustoz Murabbiyona platformasida "Telegram ulash" tugmasini bosadi
 * 2. Unikal kod generatsiya bo'ladi (masalan: MRB-abc123)
 * 3. Ustoz Telegram botga shu kodni yuboradi: /start MRB-abc123
 * 4. Bot kodni tekshiradi, ustoz profiliga telegram_id ni saqlaydi
 * 5. Ustoz telefoniga xabarnomalar kela boshlaydi
 */
Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("OK", { status: 200 });
  }

  try {
    const update = await req.json();

    // Faqat message turini qayta ishlaymiz
    if (!update.message) {
      return new Response("OK", { status: 200 });
    }

    const message = update.message;
    const chatId = message.chat.id;
    const text = (message.text || "").trim();
    const firstName = message.from?.first_name || "";
    const lastName = message.from?.last_name || "";
    const username = message.from?.username || "";

    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!botToken) {
      return new Response("OK", { status: 200 });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // /start komandasi
    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const linkCode = parts[1]; // /start MRB-abc123

      if (linkCode && linkCode.startsWith("MRB-")) {
        // Kodni tekshirish va profilni ulash
        const { data: linkData } = await supabaseAdmin
          .from("telegram_links")
          .select("user_id, used")
          .eq("code", linkCode)
          .single();

        if (!linkData) {
          await sendMessage(botToken, chatId,
            "❌ Kod topilmadi. Iltimos, Murabbiyona platformasidan yangi kod oling."
          );
          return new Response("OK", { status: 200 });
        }

        if (linkData.used) {
          await sendMessage(botToken, chatId,
            "⚠️ Bu kod allaqachon ishlatilgan. Yangi kod oling."
          );
          return new Response("OK", { status: 200 });
        }

        // Profilga telegram_id ni saqlash
        await supabaseAdmin
          .from("profiles")
          .update({ telegram_id: chatId })
          .eq("id", linkData.user_id);

        // Kodni ishlatilgan deb belgilash
        await supabaseAdmin
          .from("telegram_links")
          .update({ used: true, telegram_chat_id: chatId })
          .eq("code", linkCode);

        await sendMessage(botToken, chatId,
          `✅ *Muvaffaqiyatli ulandi!*\n\nAssalomu alaykum, Ustoz! Telegram hisobingiz Murabbiyona platformasiga ulandi.\n\nEndi siz quyidagi xabarnomalarni olasiz:\n📊 Dars yakuni — baholar taqsimoti\n📋 O'quvchi natijalari\n🔔 Muhim eslatmalar\n\n_Murabbiyona LMS_`
        );
        return new Response("OK", { status: 200 });
      }

      // Kodsiz /start — oddiy salomlashish
      // Avval tekshiramiz: bu chat_id allaqachon profilga ulangan bo'lishi mumkin
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .eq("telegram_id", chatId)
        .maybeSingle();

      if (existingProfile) {
        await sendMessage(botToken, chatId,
          `👋 Assalomu alaykum, *${existingProfile.full_name}*!\n\nSiz allaqachon Murabbiyona platformasiga ulangansiz.\n\nBuyruqlar:\n/status — Hisobingiz holati\n/help — Yordam\n\n_Murabbiyona LMS_`
        );
      } else {
        await sendMessage(botToken, chatId,
          `👋 Assalomu alaykum!\n\nMen *Murabbiyona Bot* — o'qituvchilar uchun yordamchi botman.\n\nPlatformaga ulash uchun:\n1️⃣ Murabbiyona platformasiga kiring\n2️⃣ Profil → Telegram ulash\n3️⃣ Ko'rsatilgan kodni menga yuboring\n\nYoki admin sizga havola yuboradi.\n\n_Murabbiyona LMS_`
        );
      }
      return new Response("OK", { status: 200 });
    }

    // /status komandasi
    if (text === "/status") {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("full_name, role, school_id")
        .eq("telegram_id", chatId)
        .maybeSingle();

      if (profile) {
        await sendMessage(botToken, chatId,
          `📋 *Hisobingiz:*\n\n👤 Ism: ${profile.full_name}\n🎓 Rol: ${profile.role === "teacher" ? "O'qituvchi" : profile.role}\n✅ Status: Ulangan\n\n_Murabbiyona LMS_`
        );
      } else {
        await sendMessage(botToken, chatId,
          "❌ Siz hali platformaga ulanmagansiz. /start buyrug'ini yuboring."
        );
      }
      return new Response("OK", { status: 200 });
    }

    // /help komandasi
    if (text === "/help") {
      await sendMessage(botToken, chatId,
        `ℹ️ *Murabbiyona Bot buyruqlari:*\n\n/start — Botni ishga tushirish\n/status — Hisob holati\n/help — Yordam\n\n📊 Dars tugaganda avtomatik xabarnoma olasiz\n\n_Murabbiyona LMS_`
      );
      return new Response("OK", { status: 200 });
    }

    // MRB- kodi to'g'ridan-to'g'ri yuborilsa
    if (text.startsWith("MRB-")) {
      const { data: linkData } = await supabaseAdmin
        .from("telegram_links")
        .select("user_id, used")
        .eq("code", text)
        .single();

      if (!linkData) {
        await sendMessage(botToken, chatId,
          "❌ Kod topilmadi. Tekshirib qaytadan yuboring."
        );
        return new Response("OK", { status: 200 });
      }

      if (linkData.used) {
        await sendMessage(botToken, chatId,
          "⚠️ Bu kod allaqachon ishlatilgan."
        );
        return new Response("OK", { status: 200 });
      }

      await supabaseAdmin
        .from("profiles")
        .update({ telegram_id: chatId })
        .eq("id", linkData.user_id);

      await supabaseAdmin
        .from("telegram_links")
        .update({ used: true, telegram_chat_id: chatId })
        .eq("code", text);

      await sendMessage(botToken, chatId,
        `✅ *Muvaffaqiyatli ulandi!*\n\nEndi dars yakuni xabarnomalarini olasiz.\n\n_Murabbiyona LMS_`
      );
      return new Response("OK", { status: 200 });
    }

    // Noma'lum xabar
    await sendMessage(botToken, chatId,
      "🤔 Tushunmadim. /help buyrug'ini yuboring."
    );

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return new Response("OK", { status: 200 });
  }
});

async function sendMessage(botToken: string, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });
}
