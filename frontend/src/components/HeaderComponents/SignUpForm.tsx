import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { pendingWatchlistService } from "../../services/pendingWatchlistService";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { X } from "lucide-react";

type SearchItem = {
  _id: string;
  tmdb_id?: number;
  id?: number;
  title?: string;
  name?: string;
  type?: "movie" | "tvshow";
};

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

const calcAgeFromDate = (date: Date | null) => {
  if (!date) return 0;
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age--;
  return Math.max(age, 0);
};

const DialogSignUpForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [open, setOpen] = useState(false);
  const [userPseudo, setUserPseudo] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const age = useMemo(() => calcAgeFromDate(birthDate), [birthDate]);
  const [qMovies, setQMovies] = useState("");
  const [resMovies, setResMovies] = useState<SearchItem[]>([]);
  const [top3Movies, setTop3Movies] = useState<SearchItem[]>([]);
  const [qShows, setQShows] = useState("");
  const [resShows, setResShows] = useState<SearchItem[]>([]);
  const [top3TvShow, setTop3TvShow] = useState<SearchItem[]>([]);
  
  const navigate = useNavigate();
  const locationDialog = useLocation();

  useEffect(() => {
    if (locationDialog.pathname === "/signup") {
      setOpen(true);
    }
  }, [locationDialog.pathname]);

  useEffect(() => {
    if (!qMovies.trim()) { setResMovies([]); return; }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(qMovies)}`);
        const data: SearchItem[] = await r.json();
        setResMovies((data || []).filter(i => (i.type === "movie")));
      } catch { setResMovies([]); }
    }, 350);
    return () => clearTimeout(t);
  }, [qMovies]);

  useEffect(() => {
    if (!qShows.trim()) { setResShows([]); return; }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(qShows)}`);
        const data: SearchItem[] = await r.json();
        setResShows((data || []).filter(i => (i.type === "tvshow")));
      } catch { setResShows([]); }
    }, 350);
    return () => clearTimeout(t);
  }, [qShows]);

  const addMovie = (item: SearchItem) => {
    if (top3Movies.find(x => x._id === item._id)) return;
    if (top3Movies.length >= 3) return;
    setTop3Movies([...top3Movies, item]);
    setQMovies("");
    setResMovies([]);
  };
  const removeMovie = (id: string) => setTop3Movies(top3Movies.filter(x => x._id !== id));

  const addShow = (item: SearchItem) => {
    if (top3TvShow.find(x => x._id === item._id)) return;
    if (top3TvShow.length >= 3) return;
    setTop3TvShow([...top3TvShow, item]);
    setQShows("");
    setResShows([]);
  };
  const removeShow = (id: string) => setTop3TvShow(top3TvShow.filter(x => x._id !== id));

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const passwordValid = passwordRegex.test(password);
  const canSubmit =
    userFirstName.trim().length > 0 &&
    userLastName.trim().length > 0 &&
    userPseudo.trim().length > 0 &&
    userFirstName.trim().length > 0 &&
    userLastName.trim().length > 0 &&
    emailValid &&
    passwordValid &&
    age > 0 &&
    location.trim().length > 0 &&
    top3Movies.length === 3;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        UserFirstName: userFirstName.trim(),
        UserLastName: userLastName.trim(),
        UserPseudo: userPseudo.trim(),
        UserMail: email.trim(),
        UserPassword: password,
        UserAge: age,
        UserLocation: location.trim(),
        Top3Movies: JSON.stringify(top3Movies.map(x => x.tmdb_id || x.id)),
        Top3TvShow: JSON.stringify(top3TvShow.map(x => x.tmdb_id || x.id)),
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        formData.append(key, String(value));
      }

      if (profilePic) {
        formData.append("UserProfilePicture", profilePic);
      }

      const res = await fetch("http://localhost:5000/users/signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Subscription failed");
      }

      setSubmitSuccess("Well done! Your account has been created.");

      const newUser = {
        UserPseudo: userPseudo.trim(),
        UserFirstName: userFirstName.trim(),
        UserLastName: userLastName.trim(),
        UserMail: email.trim(),
        UserProfilePicture: data.user.UserProfilePicture || null,
        top3Movies: [...top3Movies],
        top3TvShow: [...top3TvShow],
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("firstConnection", "true");

      const pendingItem = pendingWatchlistService.getPendingItem();
      if (pendingItem && data.user && data.token) {
        try {
          const route = pendingItem.type === "movie"
            ? `http://localhost:5000/users/${data.user._id}/watchlist/movie/${pendingItem.id}`
            : `http://localhost:5000/users/${data.user._id}/watchlist/tvshow/${pendingItem.id}`;

          await fetch(route, {
            method: "POST",
            headers: { Authorization: `Bearer ${data.token}` }
          });

          pendingWatchlistService.clearPendingItem();
          console.log(`🎬 "${pendingItem.title}" added to watchlist!`);
        } catch (err) {
          console.error("❌ Failed to add pending item:", err);
        }
      }

      setTimeout(() => {
        setOpen(false);
        onClose?.();
        navigate("/home");
      }, 800);

    } catch (e: any) {
      setSubmitError(e?.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { 
      setOpen(v); 
      if (!v) { 
        setSubmitError(null); 
        setSubmitSuccess(null);
        if (locationDialog.pathname === "/signup") {
          navigate("/");
        }
      } 
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50">Sign Up</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] bg-black/40 backdrop-blur-md text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl">Create an account</DialogTitle>
          <DialogDescription className="text-gray-400">
            Please fill in your information to sign up. Fields marked * are required.
          </DialogDescription>
        </DialogHeader>


        <ScrollArea className="max-h-[70vh] pr-2">
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
                    alt="Preview"
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
            <Input id="userName" value={userPseudo} onChange={(e) => setUserPseudo(e.target.value)} placeholder="ex: Ghostface" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First name *</Label>
            <Input id="firstName" value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)} placeholder="ex : Stuart" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last name *</Label>
            <Input id="lastName" value={userLastName} onChange={(e) => setUserLastName(e.target.value)} placeholder="ex : Macher" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="stumacher@ghostface.com" />
            {!emailValid && email.length > 0 && (
              <p className="text-xs text-red-400">Invalid email address.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8, 1 maj, 1 number, 1 special"
            />
            {!passwordValid && password.length > 0 && (
              <p className="text-xs text-red-400">
                Must contain 1 uppercase letter, 1 number, 1 special character, and at least 8 characters.
              </p>
            )}

          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Location *</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="ex : Woodsboro" />
          </div>

          <div className="space-y-2">
            <Label>Birth date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-white">
                  {birthDate ? format(birthDate, "dd MMM yyyy", { locale: fr }) : "Choose a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-full bg-black text-white border border-white/20" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate || undefined}
                  onSelect={(d) => setBirthDate(d ?? null)}
                  initialFocus
                  locale={enUS}
                  captionLayout="dropdown"
                  fromYear={1930}
                  toYear={new Date().getFullYear()}
                  className="rounded-md border w-70"
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-400"> : {age || "—"} years old</p>
          </div>


          <div className="mt-4">
            <Label className="mb-2 block">Top 3 horror movies *</Label>
            <Input
              placeholder="Search for a movie…"
              value={qMovies}
              onChange={(e) => setQMovies(e.target.value)}
            />
            {qMovies && resMovies.length > 0 && (
              <div className="mt-2 border border-white/10 rounded-md">
                <ScrollArea className="max-h-[12rem]">
                  <ul className="divide-y divide-white/10">
                    {resMovies.map(item => (
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
                <span key={m._id} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10">
                  <span className="text-sm">{m.title || m.name}</span>
                  <button onClick={() => removeMovie(m._id)} className="hover:text-red-400" aria-label="Retirer">
                    <X size={16} />
                  </button>
                </span>
              ))}
              {top3Movies.length < 3 && (
                <span className="text-xs text-gray-400">({3 - top3Movies.length} remaining{3 - top3Movies.length === 1 ? "" : "s"})</span>
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
            {qShows && resShows.length > 0 && (
              <div className="mt-2 border border-white/10 rounded-md">
                <ScrollArea className="max-h-[12rem]">
                  <ul className="divide-y divide-white/10">
                    {resShows.map(item => (
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
                <span key={s._id} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/10">
                  <span className="text-sm">{s.title || s.name}</span>
                  <button onClick={() => removeShow(s._id)} className="hover:text-red-400" aria-label="Retirer">
                    <X size={16} />
                  </button>
                </span>
              ))}
              {top3TvShow.length < 3 && top3TvShow.length > 0 && (
                <span className="text-xs text-gray-400">(optional — {3 - top3TvShow.length} remaining{3 - top3TvShow.length === 1 ? "" : "s"})</span>
              )}
            </div>
          </div>

          {submitError && <p className="mt-4 text-sm text-red-400">{submitError}</p>}
          {submitSuccess && <p className="mt-4 text-sm text-green-400">{submitSuccess}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} className="text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit || submitting} className="text-white">
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog >
  );
};

export default DialogSignUpForm;
