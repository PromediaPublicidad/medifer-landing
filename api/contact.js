// /api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { name, company, email, phone, message } = req.body || {};

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,                   // ej: smtp.gmail.com
      port: Number(process.env.SMTP_PORT || 465),    // 465 (secure) o 587
      secure: String(process.env.SMTP_PORT || "465") === "465",
      auth: {
        user: process.env.SMTP_USER,                 // tu cuenta SMTP
        pass: process.env.SMTP_PASS,                 // tu app password/SMTP pass
      },
    });

    const from = process.env.CONTACT_FROM || process.env.SMTP_USER;
    const to = process.env.CONTACT_TO || "bashar@medifergroup.com";

    await transporter.sendMail({
      from,
      to,
      subject: `Contacto Web - ${name || "Sin nombre"}`,
      replyTo: email || undefined,
      text: [
        `Nombre: ${name || "-"}`,
        `Empresa: ${company || "-"}`,
        `Email: ${email || "-"}`,
        `Teléfono: ${phone || "-"}`,
        ``,
        `Mensaje:`,
        `${message || "-"}`,
      ].join("\n"),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("MAIL_ERROR:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Mail error" });
  }
}