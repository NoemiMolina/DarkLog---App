import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./features/pages/WelcomePage";
import HomePage from "./features/pages/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)]">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
