import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config/api";
import { fetchWithCreds } from "../../config/fetchClient";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit = emailValid && !loading;

  const handleForgotPassword = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = { UserMail: email.trim() };
      console.log("📧 Sending forgot-password request with payload:", payload);
      console.log("📧 API_URL:", API_URL);

      const res = await fetchWithCreds(`${API_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📧 Response status:", res.status);
      console.log("📧 Response headers:", {
        "content-type": res.headers.get("content-type"),
      });

      const text = await res.text();
      console.log("📧 Response body (raw):", text);

      const data = text ? JSON.parse(text) : {};
      console.log("📧 Response data (parsed):", data);

      if (!res.ok) {
        setErrorMsg(data.message || "An error occurred");
        setLoading(false);
        return;
      }

      setSuccessMsg(data.message);
      setSubmitted(true);
      setEmail("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("❌ Error in forgotPassword:", err);
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-white text-center"
            style={{ fontFamily: "'Metal Mania', serif" }}
          >
            Forgot Password?
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {!submitted ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && canSubmit) {
                    handleForgotPassword();
                  }
                }}
              />
              {!emailValid && email.length > 0 && (
                <p className="text-xs text-red-400">Invalid email</p>
              )}
            </div>

            {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

            <div className="flex justify-between gap-3 mt-4">
              <Link to="/login" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full text-white hover:bg-white/10"
                >
                  Back
                </Button>
              </Link>

              <Button
                onClick={handleForgotPassword}
                disabled={!canSubmit}
                className="flex-1"
              >
                {loading ? "Loading..." : "Send Reset Link"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-green-400 text-lg mb-4">✅ {successMsg}</p>
            <p className="text-yellow-400 text-sm mb-2 font-semibold">
              ⚠️ If you don't see the email, check your spam folder!
            </p>
            <p className="text-gray-400 text-sm mb-6">
              You will be redirected to the login page...
            </p>
            <Link to="/login">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
