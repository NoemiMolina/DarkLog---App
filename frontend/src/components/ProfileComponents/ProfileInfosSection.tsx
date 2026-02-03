import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Eye, EyeOff, Save, Edit, X, Camera } from 'lucide-react';
import { API_URL } from '../../config/api';

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
  onProfilePictureChange: (file: File) => void;
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
  onTogglePasswordVisibility,
  onProfilePictureChange
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleProfilePictureClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onProfilePictureChange) {
      onProfilePictureChange(file);
    }
  };

  return (
    <div className="flex gap-0 items-start">
      <Card className="bg-[#2A2A2A] border-white/20 text-white flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Profile Information</CardTitle>
        <div className="flex gap-2 sm:mt-0 mt-0 -mt-3 mr-2">
          {!isEditing ? (
            <Button onClick={onEdit} className="bg-gray-800/50 border border-purple-500/20 p-1 sm:p-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Edit</span>
            </Button>
          ) : (
            <>
              <Button onClick={onSave} className="bg-gray-800/50 border border-purple-500/20 text-white p-1 sm:p-2">
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Save</span>
              </Button>
              <Button onClick={onCancel} className="bg-gray-800/50 border border-purple-500/20 text-white p-1 sm:p-2">
                <X className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Cancel</span>
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative flex-shrink-0">
            {profileData.userProfilePicture ? (
              <img
                src={profileData.userProfilePicture.startsWith('http')
                  ? profileData.userProfilePicture
                  : `${API_URL}/${profileData.userProfilePicture}`}
                alt="Profile"
                className={`w-24 h-24 rounded-full object-cover border-2 border-white/40 ${isEditing ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
                onClick={handleProfilePictureClick}
              />
            ) : (
              <div 
                className={`w-24 h-24 rounded-full bg-gray-600 border-2 border-white/40 flex items-center justify-center text-3xl ${isEditing ? 'cursor-pointer hover:bg-gray-500 transition-colors' : ''}`}
                onClick={handleProfilePictureClick}
              >
                {profileData.userFirstName?.charAt(0).toUpperCase() || profileData.userPseudo?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            {isEditing && (
              <div 
                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                onClick={handleProfilePictureClick}
              >
                <Camera className="h-4 w-4 text-white" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="w-full sm:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input
                value={profileData.userFirstName || ''}
                onChange={(e) => onInputChange('userFirstName', e.target.value)}
                disabled={!isEditing}
                className="bg-[#1A1A1A] border-white/20 text-white disabled:opacity-60"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input
                value={profileData.userLastName || ''}
                onChange={(e) => onInputChange('userLastName', e.target.value)}
                disabled={!isEditing}
                className="bg-[#1A1A1A] border-white/20 text-white disabled:opacity-60"
              />
            </div>
            <div>
              <Label>Pseudo</Label>
              <Input
                value={profileData.userPseudo || ''}
                onChange={(e) => onInputChange('userPseudo', e.target.value)}
                disabled={!isEditing}
                className="bg-[#1A1A1A] border-white/20 text-white disabled:opacity-60"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={profileData.userMail || ''}
                onChange={(e) => onInputChange('userMail', e.target.value)}
                disabled={!isEditing}
                className="bg-[#1A1A1A] border-white/20 text-white disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 p-4 bg-[#1A1A1A] rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-white">Change Password (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => onPasswordChange('old', e.target.value)}
                    placeholder="Enter current password"
                    className="bg-[#2A2A2A] border-white/20 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={onTogglePasswordVisibility}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
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
                  className="bg-[#2A2A2A] border-white/20 text-white"
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={(e) => onPasswordChange('confirm', e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-[#2A2A2A] border-white/20 text-white"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};

export default ProfileInfoSection;