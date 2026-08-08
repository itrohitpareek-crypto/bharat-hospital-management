const wrap = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f5f8ff; padding: 24px;">
    <div style="background: linear-gradient(135deg, #2563eb, #0ea5e9); padding: 24px; border-radius: 14px 14px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 20px;">Bharat Hospital</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 12.5px;">Sardarshahar, Churu, Rajasthan</p>
    </div>
    <div style="background: #ffffff; padding: 28px; border-radius: 0 0 14px 14px; border: 1px solid #e6ebf5; border-top: none;">
      <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">${title}</h2>
      ${bodyHtml}
    </div>
    <p style="text-align: center; color: #94a3b8; font-size: 11.5px; margin-top: 16px;">
      This is an automated message from Bharat Hospital. Please do not reply to this email.
    </p>
  </div>
`;

const welcomeEmail = (name) =>
  wrap(
    `Welcome, ${name}! 👋`,
    `<p style="color:#475569; font-size:14.5px; line-height:1.7;">
      Thank you for creating an account with Bharat Hospital. You can now log in anytime to
      book appointments, view your medical records, and manage your bills online.
    </p>`
  );

const appointmentBookedEmail = ({ patientName, doctorName, date, time, reason }) =>
  wrap(
    "Appointment Request Received",
    `<p style="color:#475569; font-size:14.5px; line-height:1.7;">
      Hi ${patientName}, your appointment request has been received and is pending confirmation.
    </p>
    <table style="width:100%; border-collapse:collapse; margin-top:12px; font-size:14px;">
      <tr><td style="padding:6px 0; color:#64748b;">Doctor</td><td style="padding:6px 0; font-weight:600; text-align:right;">${doctorName}</td></tr>
      <tr><td style="padding:6px 0; color:#64748b;">Date</td><td style="padding:6px 0; font-weight:600; text-align:right;">${date}</td></tr>
      <tr><td style="padding:6px 0; color:#64748b;">Time</td><td style="padding:6px 0; font-weight:600; text-align:right;">${time}</td></tr>
      ${reason ? `<tr><td style="padding:6px 0; color:#64748b;">Reason</td><td style="padding:6px 0; font-weight:600; text-align:right;">${reason}</td></tr>` : ""}
    </table>
    <p style="color:#475569; font-size:13.5px; margin-top:16px;">
      We'll notify you by email as soon as the doctor confirms your appointment.
    </p>`
  );

const appointmentStatusEmail = ({ patientName, doctorName, date, time, status }) => {
  const statusLabel = { approved: "Confirmed ✅", rejected: "Declined ❌", completed: "Completed ✔️", cancelled: "Cancelled" }[status] || status;
  return wrap(
    `Appointment ${statusLabel}`,
    `<p style="color:#475569; font-size:14.5px; line-height:1.7;">
      Hi ${patientName}, your appointment with <strong>${doctorName}</strong> on <strong>${date}</strong> at <strong>${time}</strong>
      has been <strong>${statusLabel.replace(/[✅❌✔️]/g, "").trim()}</strong>.
    </p>`
  );
};

const resetPasswordEmail = (name, resetUrl) =>
  wrap(
    "Reset Your Password",
    `<p style="color:#475569; font-size:14.5px; line-height:1.7;">
      Hi ${name}, we received a request to reset your password. Click the button below to choose a new one.
      This link will expire in 30 minutes.
    </p>
    <div style="text-align:center; margin: 24px 0;">
      <a href="${resetUrl}" style="background: linear-gradient(135deg, #2563eb, #0ea5e9); color: #fff; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p style="color:#94a3b8; font-size:12.5px; line-height:1.6;">
      If you didn't request this, you can safely ignore this email — your password will remain unchanged.
      If the button doesn't work, copy and paste this link into your browser:<br/>
      <span style="word-break:break-all;">${resetUrl}</span>
    </p>`
  );

module.exports = { welcomeEmail, appointmentBookedEmail, appointmentStatusEmail, resetPasswordEmail };