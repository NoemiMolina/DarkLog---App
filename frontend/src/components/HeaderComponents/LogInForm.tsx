import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../config/api";
import { pendingWatchlistService } from "../../services/pendingWatchlistService";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const LoginFormContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const { updateAuthState } = useAuth();

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit = emailValid && password.trim().length > 0;

  const handleLogin = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserMail: email.trim(),
          UserPassword: password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg("Mail or password incorrect, not telling you which one it is, try again");
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("username", data.user.UserPseudo || "Guest");
      }
      localStorage.setItem("firstConnection", "false");

      // Notify AuthContext of the login
      updateAuthState();

      setSuccessMsg("✅ Successfully connected!");
      const pendingItem = pendingWatchlistService.getPendingItem();
      if (pendingItem && data.user && data.token) {
        try {
          const userId = data.user._id;
          const itemId = pendingItem.id;
          const route =
            pendingItem.type === "movie"
              ? `${API_URL}/users/${userId}/watchlist/movie/${itemId}`
              : `${API_URL}/users/${userId}/watchlist/tvshow/${itemId}`;

          const watchlistRes = await fetch(route, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          });
          const responseData = await watchlistRes.json();
          console.log("📥 Response data:", responseData);
          if (watchlistRes.ok) {
            setSuccessMsg(`✅ Connected! "${pendingItem.title}" added to your watchlist!`);
          }

          pendingWatchlistService.clearPendingItem();
        } catch (err) {
          console.error("❌ Failed to add pending item to watchlist:", err);
        }
      }

      setTimeout(() => {
        onClose?.();
        navigate("/home");
      }, 1500);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-2">

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!emailValid && email.length > 0 && (
          <p className="text-xs text-red-400">Invalid email</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      {successMsg && (
        <p className="text-sm text-green-400">{successMsg}</p>
      )}

      <div className="flex justify-end mt-4 gap-3">
        <Button
          variant="outline"
          onClick={() => {
            onClose?.();
          }}
          className="text-white hover:bg-white/10"
        >
          Cancel
        </Button>

        <Button
          onClick={handleLogin}
          disabled={!canSubmit || loading}
          className="text-white"
        >
          {loading ? "Connecting..." : "Login"}
        </Button>
      </div>

      <div className="text-center pt-2 border-t border-white/10">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => {
              onClose?.();
              navigate("/signup");
            }}
            className="text-purple-400 hover:text-purple-300 font-semibold underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

const DialogLoginForm: React.FC = () => {

  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50"
      onClick={() => navigate("/login")}
    >
      Login
    </Button>
  );
};

export default DialogLoginForm;
