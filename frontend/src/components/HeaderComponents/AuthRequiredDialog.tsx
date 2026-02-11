import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface AuthRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
}

const AuthRequiredDialog: React.FC<AuthRequiredDialogProps> = ({
  isOpen,
  onClose,
  itemTitle,
}) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
    onClose();
  };

  const handleCreateAccount = () => {
    navigate("/signup");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-black border-purple-500/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Sign in to save "{itemTitle}"
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Create an account or sign in to add this to your watchlist.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleSignIn}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Already have an account? Sign In
          </Button>

          <Button
            onClick={handleCreateAccount}
            variant="outline"
            className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10"
          >
            Create New Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredDialog;
