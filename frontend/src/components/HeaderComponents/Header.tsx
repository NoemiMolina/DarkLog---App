import React, { useState } from 'react';
import appLogo from "@/assets/logo/appLogo.png";
import PublicSearchBar from './PublicSearchBar';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import GetLuckyDialog from './GetLuckyDialog';
import AddFriendDialog from './AddFriendDialog';
import { Button } from '../../components/ui/button';
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { IoIosMenu } from "react-icons/io";
import { GiShamblingZombie } from "react-icons/gi";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface HeaderProps {
  username?: string;
  userProfilePicture?: string | null;
  onLogOut?: () => void;
  onToggleTVShowMode?: (value: boolean) => void;
  isTVShowMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ username = "Guest", userProfilePicture, onToggleTVShowMode, isTVShowMode }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  console.log("🧩 userProfilePicture =", userProfilePicture);
  const navigate = useNavigate();
  const handleToggle = (value: boolean) => {
    localStorage.setItem('mediaType', value ? 'tvshows' : 'movies');
    onToggleTVShowMode?.(value);
  };

  return (
    <>
    <header className="text-center translate-y-0 sm:-translate-y-[20px] flex flex-col items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 sm:p-6 xl:flex-row xl:items-center xl:justify-center xl:gap-6 xl:space-x-4 xl:p-8 xl:mt-4 xl:translate-y-5">
      {/* Desktop: Menu first - Only for logged in users */}
      {username !== "Guest" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="hidden sm:inline-flex text-white hover:bg-[#4C4C4C] px-2 sm:px-3 z-50 sm:mt-2 order-first"
            >
              <IoIosMenu className="text-3xl sm:text-5xl xl:text-6xl w-7 sm:w-14 xl:w-16 h-7 sm:h-14 xl:h-16" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black/40 backdrop-blur-md border-white/20 text-white translate-y-2">
            <DropdownMenuItem
              onClick={() => navigate('/quiz')}
              className="cursor-pointer hover:bg-white/10"
            >
              Quizzes
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10"
              onClick={() => navigate('/forum')}
            >
              Forum
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setAddFriendOpen(true)}
              className="cursor-pointer hover:bg-white/10"
            >
              Add Friend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <img
        src={appLogo}
        alt="App Logo"
        className="hidden sm:block h-auto w-20 order-2 sm:w-32 md:w-40 xl:w-60 xl:translate-y-0"
      />

      <div className="flex flex-row items-center translate-y-0 sm:-translate-y-[65px] order-1 sm:order-2 gap-2 sm:gap-4 sm:mb-50 sm:flex-row xl:mb-10 xl:translate-y-[-0px] xl:gap-4 xl:ml-2 xl:flex-row w-full sm:w-auto justify-between sm:justify-start">
        {username === "Guest" ? (
          <>
            <div className="sm:hidden flex gap-2 flex-1 justify-center">
              <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-[#4C4C4C] p-2"
                  >
                    <GiShamblingZombie className="text-2xl w-6 h-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/40 backdrop-blur-md border-white/20 text-white">
                  <LogInForm onClose={() => setAuthModalOpen(false)} isMobileModal={true} />
                </DialogContent>
              </Dialog>
              <div className="sm:hidden">
                <GetLuckyDialog />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-[#4C4C4C] p-2"
                onClick={() => setSearchBarOpen(!searchBarOpen)}
              >
                <IoSearchSharp className="text-2xl w-6 h-6" />
              </Button>
            </div>
            <div className="hidden sm:flex sm:gap-4">
              <LogInForm />
              <SignUpForm />
            </div>
            <div className="hidden sm:block">
              <GetLuckyDialog />
            </div>
            <div className="hidden sm:block">
              <PublicSearchBar />
            </div>
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="sm:hidden text-white hover:bg-[#4C4C4C] px-2 z-50 order-1"
                >
                  <IoIosMenu className="text-2xl w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/40 backdrop-blur-md border-white/20 text-white translate-y-2">
                <DropdownMenuItem
                  onClick={() => navigate('/profile')}
                  className="cursor-pointer hover:bg-white/10"
                >
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/quiz')}
                  className="cursor-pointer hover:bg-white/10"
                >
                  Quizzes
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-white/10"
                  onClick={() => navigate('/forum')}
                >
                  Forum
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setAddFriendOpen(true)}
                  className="cursor-pointer hover:bg-white/10"
                >
                  Add Friend
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <img
              src={appLogo}
              alt="App Logo"
              className="sm:hidden h-auto w-40 order-2"
            />
            <div className="sm:hidden order-3 flex gap-2 items-center">
              <div className="sm:hidden flex flex-col items-center gap-1 -mt-2">
                <Switch
                  id="tv-shows-switch-mobile"
                  className="scale-75"
                  checked={isTVShowMode}
                  onCheckedChange={handleToggle}
                />
                <Label
                  htmlFor="tv-shows-switch-mobile"
                  className="text-white text-[0.65rem] font-semibold z-50 hidden sm:block"
                >
                  {isTVShowMode ? "Movies" : "TV Shows"}
                </Label>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-[#4C4C4C] p-2 -mt-2"
                onClick={() => setSearchBarOpen(!searchBarOpen)}
              >
                <IoSearchSharp className="text-2xl w-6 h-6" />
              </Button>
            </div>

            <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-2 sm:mt-9 sm:mr-3 order-3"
              onClick={() => navigate('/profile')}
            >
              {userProfilePicture ? (
                <img
                  src={
                    userProfilePicture?.startsWith("http")
                      ? userProfilePicture
                      : `http://localhost:5000/${userProfilePicture}`
                  }
                  alt={`${username}'s profile`}
                  className="w-15 h-15 rounded-full object-cover border border-white/40 gap-5 cursor-pointer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-600 border border-white/40 flex items-center justify-center text-white text-sm">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <Switch
              id="tv-shows-switch"
              className="hidden sm:block sm:mt-9 order-4"
              checked={isTVShowMode}
              onCheckedChange={handleToggle}
            />

            <Label
              htmlFor="tv-shows-switch"
              className="hidden sm:block sm:mt-9 text-white text-sm font-semibold z-50 order-4"
            >
              {isTVShowMode ? "Movies" : "TV Shows"}
            </Label>

            <div className="hidden sm:block sm:w-80 sm:gap-4 order-5">
              <PublicSearchBar />
            </div>
          </>
        )}
      </div>
    </header>
    <AddFriendDialog 
      currentUserId={username}
      open={addFriendOpen}
      onOpenChange={setAddFriendOpen}
    />
    {searchBarOpen && (
      <div className="sm:hidden w-full -mt-12">
        <PublicSearchBar />
      </div>
    )}
    </>
  );
};

export default Header;
