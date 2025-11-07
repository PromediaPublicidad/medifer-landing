// /api/contact.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM || "Medifer <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO || process.env.TO || "bashar@medifergroup.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    const { name, company, email, phone, message } = body;

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const html = `
      <table style="width:100%;max-width:640px;border-collapse:collapse;font-family:Inter,Arial,sans-serif;">
        <tr><td style="padding:16px 0;">
          <h2 style="margin:0 0 8px;color:#0574bb;">Nuevo contacto - Medifer</h2>
          <p style="margin:0;color:#0f172a;">Detalles:</p>
        </td></tr>
        <tr><td style="padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
          <p style="margin:0 0 6px;"><strong>Nombre:</strong> ${name}</p>
          <p style="margin:0 0 6px;"><strong>Empresa:</strong> ${company || "—"}</p>
          <p style="margin:0 0 6px;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0 0 6px;"><strong>Teléfono:</strong> ${phone || "—"}</p>
          <p style="margin:12px 0 0;"><strong>Mensaje:</strong></p>
          <p style="white-space:pre-wrap;margin:6px 0 0;">${message || "—"}</p>
        </td></tr>
        <tr><td style="padding:10px 0;color:#64748b;font-size:12px;">
          Enviado desde medifergroup.com
        </td></tr>
      </table>
    `;

    const resp = await resend.emails.send({
      from: FROM,
      to: [TO],
      reply_to: email || undefined,
      subject: `Contacto: ${name}`,
      html,
    });

    if (resp?.error) {
      console.error("RESEND_ERROR", resp.error);
      return res.status(500).json({ ok: false, error: "Resend error" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("CONTACT_API_ERROR", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}