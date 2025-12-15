import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";
import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { X } from "lucide-react";
import { pendingWatchlistService } from "../../services/pendingWatchlistService";

type SearchItem = {
    _id: string;
    title?: string;
    name?: string;
    type?: "movie" | "tvshow";
};

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

function calcAgeFromDate(date: Date | null) {
    if (!date) return 0;
    const now = new Date();
    let age = now.getFullYear() - date.getFullYear();
    const m = now.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age--;
    return Math.max(age, 0);
}

const SignUpPage: React.FC = () => {
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
                Top3Movies: top3Movies.map(x => x._id),
                Top3TvShow: top3TvShow.map(x => x._id),
            };

            const formData = new FormData();
            for (const [key, value] of Object.entries(payload)) {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
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
                throw new Error(data?.message || "Subscription failed");
            }

            setSubmitSuccess("✅ Account created successfully!");
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("username", data.user.UserPseudo || "Guest");
            }
            localStorage.setItem("firstConnection", "true");

            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            const pendingItem = pendingWatchlistService.getPendingItem();

            if (pendingItem && data.user && data.token) {
                try {
                    const userId = data.user._id;
                    const route =
                        pendingItem.type === "movie"
                            ? `http://localhost:5000/users/${userId}/watchlist/movie/${pendingItem.id}`
                            : `http://localhost:5000/users/${userId}/watchlist/tvshow/${pendingItem.id}`;

                    const watchlistRes = await fetch(route, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${data.token}`
                        }
                    });

                    if (watchlistRes.ok) {
                        console.log(`🎬 "${pendingItem.title}" automatically added to watchlist!`);
                        setSubmitSuccess(`✅ Welcome! "${pendingItem.title}" added to your watchlist!`);
                    }

                    pendingWatchlistService.clearPendingItem();
                } catch (err) {
                    console.error("Failed to add pending item to watchlist:", err);
                }
            }

            setTimeout(() => {
                navigate("/home");
            }, 1500);

        } catch (e: any) {
            setSubmitError(e?.message || "Unknown error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg p-8 shadow-2xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Create an account</h1>
                    <p className="text-gray-400">
                        Please fill in your information to sign up. Fields marked * are required.
                    </p>
                </div>

                <ScrollArea className="max-h-[calc(100vh-250px)] pr-4">
                    <div className="space-y-6">
                        <div className="space-y-2">
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
                                            className="w-24 h-24 rounded-full object-cover border border-white/30"
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
                                            className="text-purple-400 underline cursor-pointer"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="userName">Pseudo *</Label>
                                <Input
                                    id="userName"
                                    value={userPseudo}
                                    onChange={(e) => setUserPseudo(e.target.value)}
                                    placeholder="ex: Ghostface"
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name *</Label>
                                <Input
                                    id="firstName"
                                    value={userFirstName}
                                    onChange={(e) => setUserFirstName(e.target.value)}
                                    placeholder="ex: Stuart"
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name *</Label>
                                <Input
                                    id="lastName"
                                    value={userLastName}
                                    onChange={(e) => setUserLastName(e.target.value)}
                                    placeholder="ex: Macher"
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="stumacher@ghostface.com"
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
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
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                                {!passwordValid && password.length > 0 && (
                                    <p className="text-xs text-red-400">
                                        Must contain 1 uppercase letter, 1 number, 1 special character, and at least 8 characters.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="ex: Woodsboro"
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Birth date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between text-white bg-gray-800 border-gray-700">
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
                                            className="rounded-md border"
                                        />
                                    </PopoverContent>
                                </Popover>
                                <p className="text-xs text-gray-400">Age: {age || "—"} years old</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="block">Top 3 horror movies *</Label>
                            <Input
                                placeholder="Search for a movie…"
                                value={qMovies}
                                onChange={(e) => setQMovies(e.target.value)}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            {qMovies && resMovies.length > 0 && (
                                <div className="mt-2 border border-white/10 rounded-md bg-gray-900">
                                    <ScrollArea className="max-h-[12rem]">
                                        <ul className="divide-y divide-white/10">
                                            {resMovies.map(item => (
                                                <li key={item._id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => addMovie(item)}
                                                        className="w-full text-left px-3 py-2 hover:bg-white/5 text-white"
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
                                    <span key={m._id} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-purple-600/20 border border-purple-500/50">
                                        <span className="text-sm text-white">{m.title || m.name}</span>
                                        <button onClick={() => removeMovie(m._id)} className="hover:text-red-400" aria-label="Remove">
                                            <X size={16} />
                                        </button>
                                    </span>
                                ))}
                                {top3Movies.length < 3 && (
                                    <span className="text-xs text-gray-400">({3 - top3Movies.length} remaining)</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="block">Top 3 TV Shows (optional)</Label>
                            <Input
                                placeholder="Search for a show…"
                                value={qShows}
                                onChange={(e) => setQShows(e.target.value)}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            {qShows && resShows.length > 0 && (
                                <div className="mt-2 border border-white/10 rounded-md bg-gray-900">
                                    <ScrollArea className="max-h-[12rem]">
                                        <ul className="divide-y divide-white/10">
                                            {resShows.map(item => (
                                                <li key={item._id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => addShow(item)}
                                                        className="w-full text-left px-3 py-2 hover:bg-white/5 text-white"
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
                                    <span key={s._id} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-purple-600/20 border border-purple-500/50">
                                        <span className="text-sm text-white">{s.title || s.name}</span>
                                        <button onClick={() => removeShow(s._id)} className="hover:text-red-400" aria-label="Remove">
                                            <X size={16} />
                                        </button>
                                    </span>
                                ))}
                                {top3TvShow.length < 3 && top3TvShow.length > 0 && (
                                    <span className="text-xs text-gray-400">(optional — {3 - top3TvShow.length} remaining)</span>
                                )}
                            </div>
                        </div>
                        {submitError && (
                            <p className="text-sm text-red-400 bg-red-400/10 p-3 rounded">{submitError}</p>
                        )}
                        {submitSuccess && (
                            <p className="text-sm text-green-400 bg-green-400/10 p-3 rounded">{submitSuccess}</p>
                        )}
                    </div>
                </ScrollArea>
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="text-white border-gray-700 hover:bg-white/10"
                    >
                        Back to Home
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/login")}
                            className="text-white border-gray-700 hover:bg-white/10"
                        >
                            Already have an account?
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit || submitting}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                            {submitting ? "Creating..." : "Create Account"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

 
    


export default SignUpPage;