const nodemailer = require("nodemailer");

const MAX_FIELD_LENGTH = 1000;

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value) {
  return String(value || "").trim().slice(0, MAX_FIELD_LENGTH);
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

module.exports = async function contactHandler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const name = clean(req.body?.name);
  const email = clean(req.body?.email);
  const subject = clean(req.body?.subject);
  const message = clean(req.body?.message);

  if (!name || !email || !subject || !message || !isEmail(email)) {
    return sendJson(res, 400, { ok: false, error: "invalid_input" });
  }

  const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "MAIL_TO"];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    return sendJson(res, 500, { ok: false, error: "missing_email_config" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    replyTo: `${name} <${email}>`,
    subject: `[Resume Site] ${subject}`,
    text: [
      message,
      "",
      "------------------------------",
      `Sender: ${name}`,
      `Reply-To: ${email}`,
      "Source: resume website",
    ].join("\n"),
  });

  return sendJson(res, 200, { ok: true });
};
