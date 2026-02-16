import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail, RotateCcw } from "lucide-react";
import { API_URL } from "../../config/api";

const CheckEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const email = searchParams.get("email");

  const handleResendEmail = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/resend-verification-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Verification email sent! Check your inbox.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ ${data.message || "Failed to resend email"}`);
      }
    } catch (error) {
      console.error("Error resending email:", error);
      setMessage("❌ An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4">
      <div className="bg-[#2A2A2A] rounded-lg p-8 max-w-md w-full text-center border border-purple-500/20">
        <Mail className="w-16 h-16 mx-auto mb-6 text-purple-400" />

        <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>

        <p className="text-gray-300 mb-2">We sent a verification link to:</p>
        <p className="text-purple-400 font-semibold mb-6">{email}</p>

        <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6 border border-purple-500/20">
          <p className="text-sm text-gray-300">
            Click the link in the email to verify your address and activate your account.
          </p>
          <p className="text-xs text-gray-400 mt-2">The link expires in 24 hours.</p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-gray-700/50 rounded-lg text-sm text-gray-200">
            {message}
          </div>
        )}

        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 mb-4"
        >
          <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Sending..." : "Resend Email"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full text-purple-400 hover:text-purple-300 font-semibold py-2 px-4 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default CheckEmailPage;
