// /api/contact.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  try {
    const { name, company, email, phone, message, trap } = req.body || {};
    if (typeof trap === "string" && trap.trim() !== "") {
      res.status(200).json({ ok: true });
      return;
    }
    if (!name || !email || !message) {
      res.status(400).json({ ok: false, error: "Missing required fields" });
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.TO_EMAIL || "contact@medifergroup.com";

    await resend.emails.send({
      from: "Medifer <no-reply@medifergroup.com>",
      to,
      replyTo: email,
      subject: `Nuevo contacto: ${name} — Medifer`,
      text: [
        `Nombre: ${name}`,
        `Empresa: ${company || "-"}`,
        `Email: ${email}`,
        `Teléfono: ${phone || "-"}`,
        "",
        "Mensaje:",
        message,
      ].join("\n"),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || "Server error" });
  }
}