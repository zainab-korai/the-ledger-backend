const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"The Ledger" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP - The Ledger',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #FF006E 0%, #00F5FF 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚀 The Ledger</h1>
          <p style="color: white; margin: 5px 0 0;">Password Reset Request</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333;">Hi ${name || 'there'}!</h2>
          <p style="color: #666; font-size: 14px;">
            We received a request to reset your password. Use the OTP below to reset it:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px dashed #FF006E;">
            <p style="color: #999; margin: 0; font-size: 12px;">YOUR OTP CODE</p>
            <h1 style="color: #FF006E; margin: 10px 0; font-size: 42px; letter-spacing: 8px;">
              ${otp}
            </h1>
            <p style="color: #999; margin: 0; font-size: 12px;">Valid for 10 minutes</p>
          </div>
          
          <p style="color: #666; font-size: 13px;">
            If you didn't request this, please ignore this email. Your password will remain unchanged.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #999; font-size: 11px; text-align: center;">
            © 2025 The Ledger. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};