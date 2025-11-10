import React from 'react';
import appLogo from "@/assets/logo/appLogo.png";
import PublicSearchBar from './PublicSearchBar';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import GetLuckyDialog from './GetLuckyDialog';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { Button } from '../components/ui/button';

interface HeaderProps {
    isLoggedIn: boolean;
    onLogOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogOut }) => {
    return (
        <header className="text-center -translate-y-[20px] flex flex-col items-center justify-center gap-4 p-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 sm:p-6 xl:flex-row xl:items-center xl:justify-center xl:gap-8 xl:space-x-6 xl:p-8 xl:mt-4 xl:translate-y-5">
            <img
                src={appLogo}
                alt="App Logo"
                className="h-auto w-20 order-1 w-60 sm:w-32 md:w-40 xl:w-60 xl:translate-y-0"

            />
            <div className="order-3 -translate-y-[300px] w-20 pt-0.2 mr-60 sm:w-80 xl:translate-x-2 xl:translate-y-[-20px] xl:mr-0 xl:w-80 xl:gap-4">
                <PublicSearchBar />
            </div>
            <div className="flex flex-row items-center -translate-y-[65px] order-2 gap-2 mb-50 sm:flex-row sm:gap-4 xl:mb-10 xl:translate-y-[-0px] xl:gap-4 xl:ml-2 xl:flex-row">

                {!isLoggedIn ? (
                    <>
                        <LogInForm />
                        <SignUpForm />
                        <GetLuckyDialog />
                    </>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50"
                        >
                            My Profile
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50"
                        >
                            Wishlist
                        </Button>
                        <GetLuckyDialog />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onLogOut}
                            className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50"
                        >
                            Log out
                        </Button>
                    </>
                )}
            </div>
        </header>
    )
};
export default Header;