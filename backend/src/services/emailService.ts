import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (
  userEmail: string,
  resetToken: string,
  userName: string,
) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "DarkLog - Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Heyy <strong>${userName}</strong>,</p>
        <p>Seems you forgot your password, don't worry, The Dev got you. Click the link below to create a new password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset my Password
          </a>
        </p>
        <p style="color: #666; font-size: 12px;">
          This link is valid for 1 hour. If you did not request this password reset, please ignore this email.
        </p>
        <p style="color: #999; font-size: 11px;">
          The Dev.
        </p>
      </div>
    `,
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      } as any);

      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully to:", userEmail);
      return true;
    } else {
      console.log("⚠️ Email not configured. Development mode activated. Reset link:", resetUrl);
      return true;
    }
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return true;
  }
};
