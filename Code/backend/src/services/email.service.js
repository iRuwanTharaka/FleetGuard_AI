const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.sendPasswordReset = async (toEmail, resetUrl) => {
  await transporter.sendMail({
    from: `FleetGuard AI <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your FleetGuard AI password',
    html: `
      <div style='font-family:Arial;max-width:500px;margin:auto'>
        <h2 style='color:#1F4E79'>FleetGuard AI</h2>
        <p>Click below to reset your password. Expires in 1 hour.</p>
        <a href='${resetUrl}'
           style='background:#2E75B6;color:white;padding:12px 24px;
                  text-decoration:none;border-radius:6px;display:inline-block'>
          Reset Password
        </a>
        <p style='color:#999;font-size:12px;margin-top:20px'>
           If you didn't request this, ignore this email.</p>
      </div>`
  });
};

exports.sendInspectionReport = async (toEmail, inspectionId) => {
  await transporter.sendMail({
    from: `FleetGuard AI <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Inspection Report #${inspectionId} — KITH Travels`,
    html: `<p>Your vehicle inspection report #${inspectionId} is ready. Log in to view.</p>`
  });
};
