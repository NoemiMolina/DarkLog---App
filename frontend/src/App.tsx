import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./features/pages/WelcomePage";
import HomePage from "./features/pages/HomePage";
import UserProfile from './features/pages/UserProfilePage';
import UserPublicProfile from "./features/pages/UserPublicProfilePage";
import QuizzPage from "./features/pages/QuizzPage";
import  ForumPage  from "./features/pages/ForumPage";
import LoginPage from "./features/pages/LoginPage";
import SignUpPage from "./features/pages/SignUpPage";
import PrivacyPage from "./features/pages/PrivacyPage";
import TermsPage from "./features/pages/TermsPage";
import { Footer } from "./components/FooterComponents/Footer";
import { NotificationProvider } from "./context/NotificationContext";
import { useEffect, useState } from "react";

export default function App() {
  const [isTVShowMode, setIsTVShowMode] = useState<boolean>(() => {
    const storedType = localStorage.getItem('mediaType');
    return storedType === 'tvshows';
  });
  useEffect(() => {
    const handleStorageChange = () => {
      const storedType = localStorage.getItem('mediaType');
      setIsTVShowMode(storedType === 'tvshows');
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      const storedType = localStorage.getItem('mediaType');
      setIsTVShowMode(storedType === 'tvshows');
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);


  return (
    <BrowserRouter>
      <NotificationProvider>
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/user/:userId" element={<UserPublicProfile />} />
              <Route path="/quiz" element={<QuizzPage isTVShowMode={isTVShowMode} />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </NotificationProvider>
    </BrowserRouter>
  );
}
