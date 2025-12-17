import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../../components/HeaderComponents/SignUpForm";

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(true);

    useEffect(() => {
        if (!showDialog) {
            navigate("/");
        }
    }, [showDialog, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
            <SignUpForm />
        </div>
    );
};
export default SignUpPage;