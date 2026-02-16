import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { X, Eye, EyeOff, Check } from "lucide-react";

type SearchItem = {
  _id: string;
  tmdb_id?: number;
  id?: number;
  title?: string;
  name?: string;
  type?: "movie" | "tvshow";
};

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export const SignUpFormContent: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const [userPseudo, setUserPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [qMovies, setQMovies] = useState("");
  const [resMovies, setResMovies] = useState<SearchItem[]>([]);
  const [top3Movies, setTop3Movies] = useState<SearchItem[]>([]);
  const [qShows, setQShows] = useState("");
  const [resShows, setResShows] = useState<SearchItem[]>([]);
  const [top3TvShow, setTop3TvShow] = useState<SearchItem[]>([]);
  const [duplicateMovieError, setDuplicateMovieError] = useState<string | null>(
    null
  );
  const [duplicateShowError, setDuplicateShowError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!qMovies.trim()) {
      setResMovies([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `${API_URL}/search?query=${encodeURIComponent(qMovies)}`,
        );
        const data: SearchItem[] = await r.json();
        setResMovies((data || []).filter((i) => i.type === "movie"));
      } catch {
        setResMovies([]);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [qMovies]);

  useEffect(() => {
    if (!qShows.trim()) {
      setResShows([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `${API_URL}/search?query=${encodeURIComponent(qShows)}`,
        );
        const data: SearchItem[] = await r.json();
        setResShows((data || []).filter((i) => i.type === "tvshow"));
      } catch {
        setResShows([]);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [qShows]);

  const addMovie = (item: SearchItem) => {
    if (top3Movies.find((x) => x._id === item._id)) {
      setDuplicateMovieError(
        "We get it, you truly love this movie, but you can put it only once in your top3"
      );
      setTimeout(() => setDuplicateMovieError(null), 3000);
      return;
    }
    if (top3Movies.length >= 3) return;
    setTop3Movies([...top3Movies, item]);
    setQMovies("");
    setResMovies([]);
    setDuplicateMovieError(null);
  };
  const removeMovie = (id: string) =>
    setTop3Movies(top3Movies.filter((x) => x._id !== id));

  const addShow = (item: SearchItem) => {
    if (top3TvShow.find((x) => x._id === item._id)) {
      setDuplicateShowError(
        "We get it, you truly love this show, but you can put it only once in your top3"
      );
      setTimeout(() => setDuplicateShowError(null), 3000);
      return;
    }
    if (top3TvShow.length >= 3) return;
    setTop3TvShow([...top3TvShow, item]);
    setQShows("");
    setResShows([]);
    setDuplicateShowError(null);
  };
  const removeShow = (id: string) =>
    setTop3TvShow(top3TvShow.filter((x) => x._id !== id));

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const passwordValid = passwordRegex.test(password);
  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit =
    userPseudo.trim().length > 0 &&
    emailValid &&
    passwordValid &&
    passwordsMatch &&
    top3Movies.length === 3;

  const handleSubmit = async () => {
    setAttemptedSubmit(true);
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        UserPseudo: userPseudo.trim(),
        UserMail: email.trim(),
        UserPassword: password,
        Top3Movies: JSON.stringify(top3Movies.map((x) => x.tmdb_id || x.id)),
        Top3TvShow: JSON.stringify(top3TvShow.map((x) => x.tmdb_id || x.id)),
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        formData.append(key, String(value));
      }

      if (profilePic) {
        formData.append("UserProfilePicture", profilePic);
      }

      const res = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        body: formData,
      });


      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Subscription failed");
      }

      setSubmitSuccess("Account created! Check your email to verify your account.");

      // Redirect to email verification page instead of logging in
      setTimeout(() => {
        onClose?.();
        navigate(`/check-email?email=${encodeURIComponent(email.trim())}`);
      }, 1000);
    } catch (e: any) {
      setSubmitError(e?.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 lg:mr-50">
        <Label htmlFor="profilePic">Profile picture (optional)</Label>

        <div
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) setProfilePic(file);
          }}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center cursor-pointer hover:border-white/60 transition"
        >
          {profilePic ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Profile picture preview"
                className="w-24 h-24 rounded-full object-cover border border-white/30 "
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProfilePic(null)}
                className="text-white hover:bg-white/10"
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400">
                Drag & drop your image here, or
              </p>
              <label
                htmlFor="profilePicInput"
                className="text-blue-400 underline cursor-pointer"
              >
                browse files
              </label>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                className="hidden"
              />
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userName">Pseudo *</Label>
        <Input
          id="userName"
          value={userPseudo}
          onChange={(e) => {
            setUserPseudo(e.target.value);
            setAttemptedSubmit(false);
          }}
          placeholder="ex: Ghostface"
          className={
            attemptedSubmit && userPseudo.trim().length === 0
              ? "border-red-500 bg-red-500/10"
              : ""
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setAttemptedSubmit(false);
          }}
          placeholder="stumacherisnotdead@ghostface.com"
          className={
            attemptedSubmit && !emailValid && email.length > 0
              ? "border-red-500 bg-red-500/10"
              : ""
          }
        />
        {!emailValid && email.length > 0 && (
          <p className="text-xs text-red-400">Invalid email address.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAttemptedSubmit(false);
            }}
            placeholder="Min. 8, 1 maj, 1 number, 1 special"
            className={
              attemptedSubmit && (!passwordValid || password.length === 0)
                ? "border-red-500 bg-red-500/10"
                : ""
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {password.length > 0 && (
          <div className="mt-3 space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs font-semibold text-gray-300">Password requirements:</p>
            <div className="space-y-1">
              <div
                className={`flex items-center gap-2 text-xs ${
                  hasMinLength ? "text-green-400" : "text-gray-400"
                }`}
              >
                <Check size={14} className={hasMinLength ? "visible" : "invisible"} />
                At least 8 characters
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${
                  hasUppercase ? "text-green-400" : "text-gray-400"
                }`}
              >
                <Check size={14} className={hasUppercase ? "visible" : "invisible"} />
                One uppercase letter
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${
                  hasNumber ? "text-green-400" : "text-gray-400"
                }`}
              >
                <Check size={14} className={hasNumber ? "visible" : "invisible"} />
                One number
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${
                  hasSpecialChar ? "text-green-400" : "text-gray-400"
                }`}
              >
                <Check size={14} className={hasSpecialChar ? "visible" : "invisible"} />
                One special character (!@#$%^&*)
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setAttemptedSubmit(false);
            }}
            placeholder="Confirm your password"
            className={
              attemptedSubmit && (!passwordsMatch || confirmPassword.length === 0)
                ? "border-red-500 bg-red-500/10"
                : ""
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-xs text-red-400">Passwords don't match</p>
        )}
      </div>

      <div className="mt-4">
        <Label className="mb-2 block">Top 3 horror movies *</Label>
        <Input
          placeholder="Search for a movie…"
          value={qMovies}
          onChange={(e) => {
            setQMovies(e.target.value);
            setAttemptedSubmit(false);
          }}
          className={
            attemptedSubmit && top3Movies.length < 3
              ? "border-red-500 bg-red-500/10"
              : ""
          }
        />
        {attemptedSubmit && top3Movies.length < 3 && (
          <p className="text-xs text-red-400 mt-1">
            You must select 3 movies for your top3
          </p>
        )}
        {duplicateMovieError && (
          <p className="text-xs text-red-400 mt-1">{duplicateMovieError}</p>
        )}
        {qMovies && resMovies.length > 0 && (
          <div className="mt-2 border border-white/10 rounded-md">
            <ScrollArea className="max-h-[12rem]">
              <ul className="divide-y divide-white/10">
                {resMovies.map((item) => (
                  <li key={item._id}>
                    <button
                      type="button"
                      onClick={() => addMovie(item)}
                      className="w-full text-left px-3 py-2 hover:bg-white/5"
                    >
                      {item.title || item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {top3Movies.map((m) => (
            <span
              key={m._id}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10"
            >
              <span className="text-sm">{m.title || m.name}</span>
              <button
                onClick={() => removeMovie(m._id)}
                className="hover:text-red-400"
                aria-label="Retirer"
              >
                <X size={16} />
              </button>
            </span>
          ))}
          {top3Movies.length < 3 && (
            <span className="text-xs text-gray-400">
              ({3 - top3Movies.length} remaining
              {3 - top3Movies.length === 1 ? "" : "s"})
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Label className="mb-2 block">Top 3 TV Shows (optional)</Label>
        <Input
          placeholder="Search for a show…"
          value={qShows}
          onChange={(e) => setQShows(e.target.value)}
        />
        {duplicateShowError && (
          <p className="text-xs text-red-400 mt-1">{duplicateShowError}</p>
        )}
        {qShows && resShows.length > 0 && (
          <div className="mt-2 border border-white/10 rounded-md">
            <ScrollArea className="max-h-[12rem]">
              <ul className="divide-y divide-white/10">
                {resShows.map((item) => (
                  <li key={item._id}>
                    <button
                      type="button"
                      onClick={() => addShow(item)}
                      className="w-full text-left px-3 py-2 hover:bg-white/5"
                    >
                      {item.title || item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {top3TvShow.map((s) => (
            <span
              key={s._id}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10"
            >
              <span className="text-sm">{s.title || s.name}</span>
              <button
                onClick={() => removeShow(s._id)}
                className="hover:text-red-400"
                aria-label="Retirer"
              >
                <X size={16} />
              </button>
            </span>
          ))}
          {top3TvShow.length < 3 && top3TvShow.length > 0 && (
            <span className="text-xs text-gray-400">
              (optional — {3 - top3TvShow.length} remaining
              {3 - top3TvShow.length === 1 ? "" : "s"})
            </span>
          )}
        </div>
      </div>

      {submitError && (
        <p className="mt-4 text-sm text-red-400">{submitError}</p>
      )}
      {submitSuccess && (
        <p className="mt-4 text-sm text-green-400">{submitSuccess}</p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => onClose?.()}
          className="text-white hover:bg-white/10"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="text-white"
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

const DialogSignUpForm: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50"
      style={{ fontFamily: "'Metal Mania', serif" }}
      onClick={() => navigate("/signup")}
    >
      Sign Up
    </Button>
  );
};

export default DialogSignUpForm;
