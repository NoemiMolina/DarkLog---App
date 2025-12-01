import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Save } from 'lucide-react';

interface ProfileInfoSectionProps {
  profileData: {
    userProfilePicture: string | null;
    userFirstName: string;
    userLastName: string;
    userPseudo: string;
    userMail: string;
  };
  isEditing: boolean;
  showPassword: boolean;
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: string, value: string) => void;
  onPasswordChange: (field: 'old' | 'new' | 'confirm', value: string) => void;
  onTogglePasswordVisibility: () => void;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  profileData,
  isEditing,
  showPassword,
  oldPassword,
  newPassword,
  passwordConfirm,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onPasswordChange,
  onTogglePasswordVisibility
}) => {
  return (
    <Card className="bg-[#2A2A2A] border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {profileData.userProfilePicture ? (
              <img
                src={profileData.userProfilePicture.startsWith('http')
                  ? profileData.userProfilePicture
                  : `http://localhost:5000/${profileData.userProfilePicture}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-white/40"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-600 border-2 border-white/40 flex items-center justify-center text-3xl">
                {profileData.userFirstName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={profileData.userFirstName || ''}
                onChange={(e) => onInputChange('userFirstName', e.target.value)}
                disabled={!isEditing}
                className="bg-[#1A1A1A] border-white/20 text-white"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={profileData.userLastName || ''}
                onChange={(e) => onInputChange('userLastName', e.target.value)}
                disabled={!isEditing}
                className="bg-[#1A1A1A] border-white/20 text-white"
              />
            </div>
            <div>
              <Label>Pseudo</Label>
              <Input
                value={profileData.userPseudo || ''}
                onChange={(e) => onInputChange('userPseudo', e.target.value)}
                disabled={!isEditing}
                className="bg-[#1A1A1A] border-white/20 text-white"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={profileData.userMail || ''}
                onChange={(e) => onInputChange('userMail', e.target.value)}
                disabled={!isEditing}
                className="bg-[#1A1A1A] border-white/20 text-white"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => onPasswordChange('old', e.target.value)}
                  placeholder="Enter current password"
                  className="bg-[#1A1A1A] border-white/20 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={onTogglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => onPasswordChange('new', e.target.value)}
                placeholder="Enter new password"
                className="bg-[#1A1A1A] border-white/20 text-white"
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => onPasswordChange('confirm', e.target.value)}
                placeholder="Confirm new password"
                className="bg-[#1A1A1A] border-white/20 text-white"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {!isEditing ? (
            <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2" size={16} /> Save Changes
              </Button>
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoSection;