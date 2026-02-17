import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { GiShamblingZombie } from "react-icons/gi";

const CookieConsentBanner: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const cookieConsent = localStorage.getItem("cookieConsent");
        if (!cookieConsent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg p-4 z-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <GiShamblingZombie size={24} className="text-lime-400" />
                        <h3 className="text-white font-semibold">Cookie Consent</h3>
                    </div>
                    <p className="text-gray-300 text-sm">
                        We use cookies to provide you with the best experience. Essential cookies are always enabled.
                        You can accept or decline additional cookies at any time.
                    </p>
                </div>

                <div className="flex gap-3 flex-shrink-0">
                    <button
                        onClick={handleDecline}
                        className="px-4 py-2 rounded-lg text-gray-300 border border-gray-600 hover:border-gray-500 hover:text-white transition"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition font-medium"
                    >
                        Accept
                    </button>
                </div>

                <button
                    onClick={handleDecline}
                    className="md:hidden absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default CookieConsentBanner;
