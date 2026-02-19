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
      const res = await fetchWithCreds(`${API_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserMail: email.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Une erreur s'est produite");
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
      setErrorMsg("Une erreur s'est produite. Veuillez réessayer.");
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
            Mot de passe oublié ?
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                <p className="text-xs text-red-400">Email invalide</p>
              )}
            </div>

            {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

            <div className="flex justify-between gap-3 mt-4">
              <Link to="/login" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full text-white hover:bg-white/10"
                >
                  Retour
                </Button>
              </Link>

              <Button
                onClick={handleForgotPassword}
                disabled={!canSubmit}
                className="flex-1"
              >
                {loading ? "Chargement..." : "Envoyer le lien"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-green-400 text-lg mb-4">✅ {successMsg}</p>
            <p className="text-gray-400 text-sm mb-6">
              Vous allez être redirigé vers la page de connexion...
            </p>
            <Link to="/login">
              <Button className="w-full">Retour à la connexion</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
