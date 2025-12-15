import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { pendingWatchlistService } from "../../services/pendingWatchlistService";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit = emailValid && password.trim().length > 0;

  const handleLogin = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserMail: email.trim(),
          UserPassword: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("username", data.user.UserPseudo || "Guest");
      }

      localStorage.setItem("firstConnection", "false");

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setSuccessMsg("✅ Successfully connected!");
      const pendingItem = pendingWatchlistService.getPendingItem();
      
      if (pendingItem && data.user && data.token) {
        try {
          const userId = data.user._id;
          const itemId = pendingItem.item.id || pendingItem.item.tmdb_id; 
          const route =
            pendingItem.type === "movie"
              ? `http://localhost:5000/users/${userId}/watchlist/movie/${itemId}`
              : `http://localhost:5000/users/${userId}/watchlist/tvshow/${itemId}`;

          const watchlistRes = await fetch(route, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${data.token}`
            }
          });

          if (watchlistRes.ok) {
            console.log(`🎬 "${pendingItem.title}" automatically added to watchlist!`);
            setSuccessMsg(`✅ Connected! "${pendingItem.title}" added to your watchlist!`);
          }

          pendingWatchlistService.clearPendingItem();
        } catch (err) {
          console.error("Failed to add pending item to watchlist:", err);
        }
      }

      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-8 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Enter your credentials to continue</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {!emailValid && email.length > 0 && (
              <p className="text-xs text-red-400">Invalid email</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="text-sm text-green-400 bg-green-400/10 p-3 rounded">{successMsg}</p>
          )}

          <Button
            onClick={handleLogin}
            disabled={!canSubmit || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-4"
          >
            {loading ? "Connecting..." : "Login"}
          </Button>

          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full text-white border-gray-700 hover:bg-white/10 mt-2"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;