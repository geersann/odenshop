import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(9).max(30),
  qty: z.number().int().min(1).max(1000),
  total: z.number().int().min(0).max(1000000),
});

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const sendOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram is not configured");
      return { ok: false };
    }

    const text =
      `🛒 <b>Нове замовлення</b>\n\n` +
      `👤 Ім'я: ${esc(data.name)}\n` +
      `📞 Телефон: ${esc(data.phone)}\n` +
      `📦 Кількість: ${data.qty} шт\n` +
      `💰 Сума: ${data.total} ₴`;

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      console.error(`Telegram failed [${res.status}]: ${await res.text()}`);
      return { ok: false };
    }

    return { ok: true };
  });
