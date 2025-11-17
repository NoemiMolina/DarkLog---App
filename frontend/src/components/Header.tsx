import React from 'react';
import appLogo from "@/assets/logo/appLogo.png";
import PublicSearchBar from './PublicSearchBar';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import GetLuckyDialog from './GetLuckyDialog';
import { Button } from '../components/ui/button';
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";

interface HeaderProps {
  username?: string;
  userProfilePicture?: string | null;
  onLogOut?: () => void;
  onToggleTVShowMode?: (value: boolean) => void;
  isTVShowMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ username = "Guest", userProfilePicture, onLogOut, onToggleTVShowMode, isTVShowMode }) => {
  console.log("🧩 userProfilePicture =", userProfilePicture);

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
        {username === "Guest" ? (
          <>
            <LogInForm />
            <SignUpForm />
            <GetLuckyDialog />
          </>
        ) : (
          <>
            <div className="flex flex-row items-center gap-3 mt-9">
              {userProfilePicture ? (
                <img
                  src={
                    userProfilePicture?.startsWith("http")
                      ? userProfilePicture
                      : `http://localhost:5000/${userProfilePicture}`
                  }
                  alt={`${username}'s profile`}
                  className="w-15 h-15 rounded-full object-cover border border-white/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-600 border border-white/40 flex items-center justify-center text-white text-sm">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50"
            >
              Quizzes
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 text-sm font-semibold z-50"
            >
              Forum
            </Button>

            <div className="flex items-center gap-2 mt-9 px-6 z-50 xl:translate-y-[-17px]">
              <Switch
                id="tv-shows-switch"
                className="mt-9"
                checked={isTVShowMode}
                onCheckedChange={(value) => onToggleTVShowMode?.(value)}
              />

              <Label
                htmlFor="tv-shows-switch"
                className="mt-9 text-white text-sm font-semibold z-50"
              >
                {isTVShowMode ? "Movies" : "TV Shows"}
              </Label>
            </div>


          </>
        )}
      </div>
    </header>
  );
};

export default Header;
