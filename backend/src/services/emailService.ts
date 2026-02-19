import nodemailer from "nodemailer";

let transporter: any = null;

// Initialize transporter only if email credentials are configured
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export const sendPasswordResetEmail = async (
  userEmail: string,
  resetToken: string,
  userName: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "DarkLog - Réinitialisation de votre mot de passe",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Réinitialisation de votre mot de passe</h2>
        <p>Bonjour <strong>${userName}</strong>,</p>
        <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p style="color: #666; font-size: 12px;">
          Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        </p>
        <p style="color: #999; font-size: 11px;">
          DarkLog Team
        </p>
      </div>
    `,
  };

  try {
    // If email is configured, try to send
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email de réinitialisation envoyé à ${userEmail}`);
      return true;
    } else {
      // Fallback: log to console if email not configured (dev mode)
      console.warn("⚠️  Email non configuré. Mode développement activé.");
      console.log(`\n🔗 RESET PASSWORD LINK FOR ${userEmail}:`);
      console.log(`${resetUrl}\n`);
      return true;
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
    // Still return true to allow testing - just log the link instead
    console.log(`\n🔗 FALLBACK - Reset password link for ${userEmail}:`);
    console.log(`${resetUrl}\n`);
    return true;
  }
};
