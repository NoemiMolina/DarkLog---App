import React from "react";
import { SignUpFormContent } from "../../components/HeaderComponents/SignUpForm";
import { useNavigate } from "react-router-dom";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-black to-purple-900 min-h-screen w-full">
      <div className="flex items-center justify-center min-h-screen sm:p-4">
        <div className="w-full max-w-[720px] p-4 sm:p-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Create an account
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Please fill in your information to sign up. Fields marked * are
              required.
            </p>
          </div>
          <SignUpFormContent onClose={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
