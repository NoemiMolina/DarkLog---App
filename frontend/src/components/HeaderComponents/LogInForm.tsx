import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const DialogLoginForm: React.FC = () => {
  const [open, setOpen] = useState(false);

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
  
  setTimeout(() => {
    setOpen(false);
    navigate("/home");
  }, 800);

} catch (err: any) {
  setErrorMsg(err?.message || "Unknown error");
} finally {
  setLoading(false);
}
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setErrorMsg(null);
          setSuccessMsg(null);
          setEmail("");
          setPassword("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50"
        >
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] bg-black text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl">Login</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your email and password to log in.
          </DialogDescription>
        </DialogHeader>

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
              onClick={() => setOpen(false)}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLoginForm;
