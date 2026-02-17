import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { Footer } from "./components/FooterComponents/Footer";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";

// Lazy load pages to reduce initial bundle
const WelcomePage = lazy(() => import("./features/pages/WelcomePage"));
const HomePage = lazy(() => import("./features/pages/HomePage"));
const UserProfile = lazy(() => import("./features/pages/UserProfilePage"));
const UserPublicProfile = lazy(() => import("./features/pages/UserPublicProfilePage"));
const QuizzPage = lazy(() => import("./features/pages/QuizzPage"));
const ForumPage = lazy(() => import("./features/pages/ForumPage"));
const LoginPage = lazy(() => import("./features/pages/LoginPage"));
const SignUpPage = lazy(() => import("./features/pages/SignUpPage"));
const ContactFormPage = lazy(() => import("./features/pages/ContactFormPage"));
const PrivacyPage = lazy(() => import("./features/pages/PrivacyPage"));
const TermsPage = lazy(() => import("./features/pages/TermsPage"));
const WatchedItemsPage = lazy(() => import("./features/pages/WatchedItemsPage"));
const ItemDetailPage = lazy(() => import("./features/pages/ItemDetailPage"));
const HomemadeWatchlistDetailPage = lazy(() => import("./features/pages/HomemadeWatchlistDetailPage"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin">⏳</div>
  </div>
);

export default function App() {
  const [isTVShowMode, setIsTVShowMode] = useState<boolean>(() => {
    const storedType = localStorage.getItem("mediaType");
    return storedType === "tvshows";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedType = localStorage.getItem("mediaType");
      setIsTVShowMode(storedType === "tvshows");
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes isTVShowMode={isTVShowMode} />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppRoutes({ isTVShowMode }: { isTVShowMode: boolean }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/home" /> : <WelcomePage />
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/contactform" element={<ContactFormPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/user/:userId" element={<UserPublicProfile />} />
            <Route
              path="/quiz"
              element={<QuizzPage isTVShowMode={isTVShowMode} />}
            />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/watched-items" element={<WatchedItemsPage />} />
            <Route path="/item/:type/:id" element={<ItemDetailPage />} />
            <Route path="/homemade-watchlist/:watchlistId" element={<HomemadeWatchlistDetailPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}
