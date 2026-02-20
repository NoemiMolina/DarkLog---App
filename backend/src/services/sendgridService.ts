import axios from "axios";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER = process.env.SENDGRID_SENDER || "no-reply@fearlogapp.com";

export async function sendPasswordResetEmailSendGrid(
  userEmail: string,
  resetToken: string,
  userName: string,
) {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  const data = {
    personalizations: [
      {
        to: [{ email: userEmail }],
        subject: "FearLog - Password Reset Request",
      },
    ],
    from: { email: SENDGRID_SENDER, name: "FearLog App" },
    content: [
      {
        type: "text/html",
        value: `
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
      },
    ],
  };

  try {
    const response = await axios.post(
      "https://api.sendgrid.com/v3/mail/send",
      data,
      {
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("✅ SendGrid email sent to:", userEmail);
    return true;
  } catch (error: any) {
    if (error && typeof error === "object") {
      const errMsg = error.response?.data || error.message || JSON.stringify(error);
      console.error("❌ SendGrid error:", errMsg);
    } else {
      console.error("❌ SendGrid error:", error);
    }
    return false;
  }
}
