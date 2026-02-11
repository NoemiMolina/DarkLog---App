import React from "react";
import { LoginFormContent } from "../../components/HeaderComponents/LogInForm";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Metal Mania', serif" }}>Login</h1>
          <p className="text-gray-400 text-sm mt-2 text-center">Enter your email and password to log in.</p>
        </div>
        <LoginFormContent onClose={() => navigate("/")} />
      </div>
    </div>
  );
};

export default LoginPage;