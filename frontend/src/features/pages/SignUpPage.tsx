import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../../components/HeaderComponents/SignUpForm";

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
            <SignUpForm />
        </div>
    );
};
export default SignUpPage;