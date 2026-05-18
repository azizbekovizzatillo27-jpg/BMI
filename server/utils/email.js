const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Send email utility
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email plain text content
 * @param {string} html - Email HTML content (optional)
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Gmail-specific transporter configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Should be a 16-character Google App Password
      },
    });

    const mailOptions = {
      from: `"NamDTU ATT Kafedra" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Email yuborishda xatolik yuz berdi: ' + error.message);
  }
};

module.exports = sendEmail;
