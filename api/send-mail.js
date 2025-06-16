const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // ✅ CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "https://hakandemir.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Preflight CORS response
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Only POST allowed" });
  }

  const { message, email } = req.body;

  if (!message || !email) {
    return res.status(400).json({ success: false, error: "Message & Email are required" });
  }

  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOp = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: "CV App Message",
    text: `From: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transport.sendMail(mailOp);
    return res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Message couldn't be sent" });
  }
};