import { createTransport } from 'nodemailer';

// Validate required environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('Warning: Email credentials not configured. Email functionality will be disabled.');
}

/**
 * Creates and configures a Nodemailer transporter
 * @returns {import('nodemailer').Transporter} Configured Nodemailer transporter
 */
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using the configured Nodemailer transporter
 * @param {Object} mailOptions - Email options
 * @param {string} mailOptions.to - Recipient email address
 * @param {string} mailOptions.subject - Email subject
 * @param {string} mailOptions.text - Plain text email body
 * @param {string} [mailOptions.html] - HTML email body (optional)
 * @returns {Promise<Object>} Result of the sendMail operation
 */
export async function sendEmail({ to, subject, text, html }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email not sent: Email credentials not configured');
    return { message: 'Email service not configured', success: false };
  }

  try {
    const info = await transporter.sendMail({
      from: `"ClassWeave" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text, // Use HTML if provided, otherwise fallback to text
    });

    console.log('Email sent:', info.messageId);
    return { message: 'Email sent successfully', success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Sends a password reset email to the specified email address
 * @param {string} email - The recipient's email address
 * @param {string} resetToken - The password reset token
 * @returns {Promise<Object>} Result of the sendMail operation
 */
export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const subject = 'Password Reset Request - ClassWeave';
  const text = `You have requested a password reset for your ClassWeave account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you did not request this password reset, please ignore this email.

Best regards,
The ClassWeave Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #059669; text-align: center;">Password Reset Request</h2>
      
      <p>You have requested a password reset for your ClassWeave account.</p>
      
      <p>Click the button below to reset your password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        <strong>Important:</strong> This link will expire in 1 hour.
      </p>
      
      <p style="color: #666; font-size: 14px;">
        If you did not request this password reset, please ignore this email.
      </p>
      
      <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center; color: #666; font-size: 12px;">
        Best regards,<br>
        The ClassWeave Team
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    text,
    html
  });
}

export default transporter;
