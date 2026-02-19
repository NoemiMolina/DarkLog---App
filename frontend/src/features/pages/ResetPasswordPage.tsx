import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config/api";
import { fetchWithCreds } from "../../config/fetchClient";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setErrorMsg("Token manquant");
        setValidating(false);
        return;
      }

      try {
        const res = await fetchWithCreds(
          `${API_URL}/users/verify-reset-token/${token}`,
          {
            method: "GET",
          }
        );

        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenValid(true);
        } else {
          setErrorMsg(
            "Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien."
          );
        }
      } catch (err) {
        console.error("❌ Error verifying token:", err);
        setErrorMsg(
          "Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien."
        );
      } finally {
        setValidating(false);
      }
    };

    verifyToken();
  }, [token]);

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit = passwordValid && passwordsMatch && !loading;

  const handleResetPassword = async () => {
    if (!canSubmit || !token) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetchWithCreds(
        `${API_URL}/users/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPassword: password.trim(),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(
          data.message ||
            "Une erreur s'est produite lors de la réinitialisation"
        );
        setLoading(false);
        return;
      }

      setSuccessMsg(data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("❌ Error resetting password:", err);
      setErrorMsg("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px]">
          <p className="text-center text-gray-400">
            Vérification du lien...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px]">
          <div className="mb-6">
            <h1
              className="text-2xl font-bold text-white text-center"
              style={{ fontFamily: "'Metal Mania', serif" }}
            >
              Lien expiré
            </h1>
          </div>
          <div className="text-center py-6">
            <p className="text-red-400 text-lg mb-4">❌ {errorMsg}</p>
            <Link to="/forgot-password">
              <Button className="w-full">
                Demander un nouveau lien
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-white text-center"
            style={{ fontFamily: "'Metal Mania', serif" }}
          >
            Réinitialiser le mot de passe
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Entrez votre nouveau mot de passe (au moins 8 caractères, avec
            majuscule, chiffre et symbole spécial)
          </p>
        </div>

        {!successMsg ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre nouveau mot de passe..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {password.length > 0 && (
                <div className="text-xs space-y-1">
                  <p
                    className={
                      password.length >= 8
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {password.length >= 8 ? "✓" : "✗"} Au moins 8 caractères
                  </p>
                  <p
                    className={
                      /[A-Z]/.test(password)
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {/[A-Z]/.test(password) ? "✓" : "✗"} Une majuscule
                  </p>
                  <p
                    className={
                      /[0-9]/.test(password)
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {/[0-9]/.test(password) ? "✓" : "✗"} Un chiffre
                  </p>
                  <p
                    className={
                      /[!@#$%^&*]/.test(password)
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {/[!@#$%^&*]/.test(password) ? "✓" : "✗"} Un symbole
                    spécial (!@#$%^&*)
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmez le mot de passe *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmez votre mot de passe..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-400">
                  Les mots de passe ne correspondent pas
                </p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-400">✓ Les mots de passe correspondent</p>
              )}
            </div>

            {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

            <div className="flex justify-between gap-3 mt-4">
              <Link to="/login" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full text-white hover:bg-white/10"
                >
                  Annuler
                </Button>
              </Link>

              <Button
                onClick={handleResetPassword}
                disabled={!canSubmit}
                className="flex-1"
              >
                {loading ? "Chargement..." : "Réinitialiser"}
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
              <Button className="w-full">Aller à la connexion</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
