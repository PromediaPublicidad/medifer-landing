// /api/contact.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { name, company, email, phone, message } = (req.body || {});

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Missing fields' });
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      TO_EMAIL,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
      return res.status(500).json({ ok: false, error: 'SMTP env not set' });
    }

    const port = Number(SMTP_PORT);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // 465 = SSL; 587/25 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const safe = (s) =>
      String(s || '').replace(/[&<>"']/g, (c) =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c])
      );

    const html = `
      <h2>Nuevo contacto Medifer</h2>
      <p><b>Nombre:</b> ${safe(name)}</p>
      <p><b>Empresa:</b> ${safe(company)}</p>
      <p><b>Email:</b> ${safe(email)}</p>
      <p><b>Teléfono:</b> ${safe(phone)}</p>
      <p><b>Mensaje:</b><br/>${safe(message).replace(/\n/g,'<br/>')}</p>
    `;

    await transporter.sendMail({
      from: `"Medifer Website" <${SMTP_USER}>`, // muchos SMTP exigen FROM propio
      to: TO_EMAIL,
      replyTo: email,
      subject: `Contacto web: ${name}`,
      text:
        `Nombre: ${name}\nEmpresa: ${company || ''}\nEmail: ${email}\n` +
        `Teléfono: ${phone || ''}\n\n${message}`,
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('CONTACT_SERVER_ERROR', err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
};