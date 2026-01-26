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
  console.log("🧩 userProfilePicture =", userProfilePicture);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || '';
  const handleToggle = (value: boolean) => {
    localStorage.setItem('mediaType', value ? 'tvshows' : 'movies');
    onToggleTVShowMode?.(value);
  };

  return (
    <>
      <header className="text-center translate-y-0 sm:-translate-y-[20px] flex flex-col items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 sm:p-6 xl:flex-row xl:items-center xl:justify-center xl:gap-6 xl:space-x-4 xl:p-8 xl:mt-4 xl:translate-y-5 ">
        {/* MENU DESKTOP (seulement quand connecté) */}
        {username !== "Guest" && (
          <div className="hidden xl:block xl:order-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer">
                  <IoIosMenu className="text-8xl w-24 h-5" />
                  <NotificationBadge count={unreadCount} className="top-1 right-0" />
                </div>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* LOGO - CENTRE */}
        <img
          src={appLogo}
          alt="App Logo"
          onClick={() => navigate('/home')}
          className="hidden sm:block h-auto w-20 order-2 sm:w-32 md:w-40 xl:w-75 xl:translate-y-0 cursor-pointer hover:opacity-80 transition-opacity xl:order-2"
        />

        {/* ESPACE VIDE POUR ALIGNEMENT (seulement desktop connecté) */}
        {username !== "Guest" && (
          <div className="hidden xl:block xl:w-[500px] xl:order-3"></div>
        )}

        {/* SECTION DROITE (search + switch + profile) */}
        <div className="flex flex-row items-center translate-y-0 sm:-translate-y-[65px] order-1 sm:order-2 gap-2 sm:gap-4 sm:mb-50 sm:flex-row xl:mb-10 xl:translate-y-[-0px] xl:gap-4 xl:ml-2 xl:flex-row w-full sm:w-auto justify-between sm:justify-start xl:order-4">
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
            // HEADER UTILISATEUR CONNECTÉ
            <>
              {/* MENU MOBILE (seulement mobile) - Rien changé ici */}
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

              {/* SECTION DROITE DESKTOP (search + switch + profile) */}
              <div className="hidden xl:flex xl:items-center xl:gap-6 xl:order-1">
                {/* SEARCH BAR */}
                <div className="xl:w-80">
                  <PublicSearchBar />
                </div>

                {/* SWITCH */}
                <div className="xl:flex xl:flex-col xl:items-center xl:gap-1">
                  <Switch
                    id="tv-shows-switch"
                    checked={isTVShowMode}
                    onCheckedChange={handleToggle}
                  />
                  <Label
                    htmlFor="tv-shows-switch"
                    className="text-white text-sm font-semibold z-5 -mb-20"
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
                      className="w-12 h-12 rounded-full object-cover border border-white/40 -mb-5"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 border border-white/40 flex items-center justify-center text-white text-sm">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* VERSION TABLETTE (sm à xl) */}
              <div className="hidden sm:flex sm:items-center sm:gap-4 sm:mt-9 sm:mr-3 xl:hidden">
                {/* SEARCH BAR TABLETTE */}
                <div className="sm:w-64">
                  <PublicSearchBar />
                </div>

                {/* SWITCH TABLETTE */}
                <div className="sm:flex sm:flex-col sm:items-center sm:gap-1">
                  <Switch
                    id="tv-shows-switch-tablet"
                    checked={isTVShowMode}
                    onCheckedChange={handleToggle}
                  />
                  <Label
                    htmlFor="tv-shows-switch-tablet"
                    className="text-white text-sm font-semibold z-50"
                  >
                    {isTVShowMode ? "Movies" : "TV Shows"}
                  </Label>
                </div>

                {/* PROFILE PICTURE TABLETTE */}
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
                      className="w-12 h-12 rounded-full object-cover border border-white/40"
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