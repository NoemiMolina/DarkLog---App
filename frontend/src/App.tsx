import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./features/pages/WelcomePage";
import HomePage from "./features/pages/HomePage";
import UserProfile from './features/pages/UserProfile';
import UserPublicProfile from "./features/pages/UserPublicProfile";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)]">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/user/:userId" element={<UserPublicProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
