import React from "react";
import LoginForm from "../../components/HeaderComponents/LogInForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
};

export default LoginPage;