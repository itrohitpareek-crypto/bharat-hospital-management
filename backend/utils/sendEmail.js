const nodemailer = require("nodemailer");

// Reuses a single transporter across calls. If email credentials are not
// configured, emails are silently skipped (logged) so the app never crashes
// because of a missing/incomplete email setup.
let transporter = null;

const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
};

/**
 * Send an email. Never throws — logs and resolves so a failed/misconfigured
 * email never breaks the API request that triggered it (register, booking, etc).
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const t = getTransporter();
    if (!t || !to) {
      console.log(`[email skipped] EMAIL_USER/EMAIL_APP_PASSWORD not configured, or no recipient. Subject: "${subject}"`);
      return;
    }
    await t.sendMail({
      from: `"Bharat Hospital" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: "${subject}"`);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
};

module.exports = sendEmail;
