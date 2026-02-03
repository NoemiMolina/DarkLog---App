import React, { useState } from 'react';
import appLogo from "@/assets/logo/appLogo.png";
import PublicSearchBar from './PublicSearchBar';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';
import GetLuckyDialog from './GetLuckyDialog';
import AddFriendDialog from './AddFriendDialog';
import { ImportModal } from '../ImportComponents';
import { FriendRequestDialog } from '../NotificationsComponents/FriendRequestDialog';
import { NotificationBadge } from '../NotificationsComponents/NotificationBadge';
import { useNotifications } from '../../context/NotificationContext';
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
  const [friendRequestOpen, setFriendRequestOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const { unreadCount, friendRequestsCount, forumNotificationsCount } = useNotifications();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || '';
  const handleToggle = (value: boolean) => {
    localStorage.setItem('mediaType', value ? 'tvshows' : 'movies');
    onToggleTVShowMode?.(value);
  };

  return (
    <>
      <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 p-3 sm:p-4 lg:px-8 lg:py-4 lg:flex-row lg:items-center lg:gap-8 lg:mt-2">
        {/* MENU + LOGO (left for connected, center for guest on lg) */}
        {username !== "Guest" ? (
          <div className="flex flex-row items-center gap-2 lg:gap-6 flex-shrink-0">
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative cursor-pointer">
                    <IoIosMenu className="text-4xl w-10 h-10 lg:w-5 2xl:translate-x-40" />
                    <NotificationBadge count={unreadCount} className="top-1 right-0" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/40 backdrop-blur-md border-white/20 text-white translate-y-2 2xl:translate-x-[120px] 2xl:translate-y-0">
                  <DropdownMenuItem
                    onClick={() => navigate('/quiz')}
                    className="cursor-pointer hover:bg-white/10"
                  >
                    Quizzes
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10"
                    onClick={() => navigate('/forum')}
                  >
                    <div className="flex items-center gap-2">
                      Forum
                      {forumNotificationsCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {forumNotificationsCount > 99 ? '99+' : forumNotificationsCount}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setAddFriendOpen(true);
                      if (friendRequestsCount > 0) {
                        setTimeout(() => setFriendRequestOpen(true), 100);
                      }
                    }}
                    className="cursor-pointer hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      Add Friend
                      {friendRequestsCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {friendRequestsCount > 99 ? '99+' : friendRequestsCount}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setImportModalOpen(true)}
                    className="cursor-pointer hover:bg-white/10"
                  >
                    Import from
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      localStorage.removeItem("userId");
                      navigate('/');
                    }}
                    className="cursor-pointer hover:bg-red-500/20 text-red-400"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <img
              src={appLogo}
              alt="App Logo"
              onClick={() => navigate('/home')}
              className="hidden sm:block h-auto w-20 sm:w-32 md:w-40 lg:w-56 xl:w-80 2xl:translate-x-45 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>
        ) : (
          <>
            {/* On lg, center the logo for guest */}
            <div className="hidden lg:flex w-full justify-center items-center">
              <img
                src={appLogo}
                alt="App Logo"
                onClick={() => navigate('/home')}
                className="h-auto w-56 cursor-pointer hover:opacity-80 transition-opacity xl:w-80 xl:-translate-x-15 2xl:w-72 2xl:-translate-x-20 2xl:w-70"
              />
            </div>
            {/* On <lg, keep previous layout */}
            <img
              src={appLogo}
              alt="App Logo"
              onClick={() => navigate('/home')}
              className="hidden sm:block lg:hidden h-auto w-20 sm:w-32 md:w-40 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </>
        )}

        {/* FLEX SPACER (center) */}
        <div className="hidden lg:block flex-grow"></div>

        {/* SECTION DROITE (search + switch + profile) */}
        <div className="flex flex-row items-center gap-2 sm:gap-4 flex-shrink-0">
          {username === "Guest" ? (
            // HEADER GUEST (non connecté)
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
              <div className="hidden sm:flex sm:gap-4 lg:-translate-x-10 xl:-translate-x-25 2xl:-translate-x-85">
                <LogInForm />
                <SignUpForm />
              </div>
              <div className="hidden sm:block xl:-translate-x-25 2xl:-translate-x-85">
                <GetLuckyDialog />
              </div>
              <div className="hidden sm:block xl:-translate-x-25 2xl:-translate-x-85">
                <PublicSearchBar />
              </div>
            </>
          ) : (
            // HEADER UTILISATEUR CONNECTÉ (desktop/tablette)
            <>
              {/* MOBILE ONLY: menu, logo, switch, search */}
              <div className="lg:hidden flex flex-row items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="text-white hover:bg-[#4C4C4C] px-2 z-50"
                    >
                      <IoIosMenu className="text-2xl w-6 h-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/40 backdrop-blur-md border-white/20 text-white translate-y-2">
                    <DropdownMenuItem
                      onClick={() => navigate('/profile')}
                      className="cursor-pointer hover:bg-white/10"
                    >
                      Profile
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
                    <DropdownMenuItem
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("userId");
                        navigate('/');
                      }}
                      className="cursor-pointer hover:bg-red-500/20 text-red-400"
                    >
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <img
                  src={appLogo}
                  alt="App Logo"
                  className="h-auto w-32"
                />
                <div className="flex flex-col items-center gap-1 -mt-2">
                  <Switch
                    id="tv-shows-switch-mobile"
                    className="scale-75"
                    checked={isTVShowMode}
                    onCheckedChange={handleToggle}
                  />
                  <Label
                    htmlFor="tv-shows-switch-mobile"
                    className="text-white text-[0.65rem] font-semibold z-50"
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

              {/* DESKTOP/TABLETTE: search, switch, profile (right) */}
              <div className="hidden lg:flex flex-row items-center gap-6 lg:gap-8 xl:gap-10 2xl:-translate-x-35">
                {/* SEARCH BAR */}
                <div className="w-64 2xl:w-80 lg:-translate-y-5">
                  <PublicSearchBar />
                </div>
                {/* SWITCH */}
                <div className="flex flex-col items-center gap-1 xl:pl-5">
                  <Switch
                    id="tv-shows-switch"
                    checked={isTVShowMode}
                    onCheckedChange={handleToggle}
                  />
                  <Label
                    htmlFor="tv-shows-switch"
                    className="text-white text-sm font-semibold z-5"
                  >
                    {isTVShowMode ? "Movies" : "TV Shows"}
                  </Label>
                </div>
                {/* PROFILE PICTURE */}
                <div 
                  className="cursor-pointer"
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
                      className="w-12 h-12 rounded-full object-cover border border-white/40 lg:-translate-y-2"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 border border-white/40 flex items-center justify-center text-white text-sm">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </header>
      <AddFriendDialog
        currentUserId={userId}
        open={addFriendOpen}
        onOpenChange={setAddFriendOpen}
      />

      {/* Friend Request Dialog */}
      <FriendRequestDialog
        open={friendRequestOpen}
        onOpenChange={setFriendRequestOpen}
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        userId={userId}
        onSuccess={(stats) => {
          console.log("✅ Import réussi avec stats:", stats);
        }}
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