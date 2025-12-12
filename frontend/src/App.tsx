import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./features/pages/WelcomePage";
import HomePage from "./features/pages/HomePage";
import UserProfile from './features/pages/UserProfilePage';
import UserPublicProfile from "./features/pages/UserPublicProfilePage";
import QuizzPage from "./features/pages/QuizzPage";
import  ForumPage  from "./features/pages/ForumPage";
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
      <div className="min-h-screen bg-[var(--background)]">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user/:userId" element={<UserPublicProfile />} />
          <Route path="/quiz" element={<QuizzPage isTVShowMode={isTVShowMode} />} />
          <Route path="/forum" element={<ForumPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
