import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config/api';

interface AuthContextType {
  username: string;
  userId: string | null;
  userProfilePicture: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>('Guest');
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateAuthState = () => {
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token && storedUserId) {
      setUsername(storedUsername || 'Guest');
      setUserId(storedUserId);
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserProfilePicture(user.UserProfilePicture || null);
        } catch (e) {
          setUserProfilePicture(null);
        }
      }
      setIsAuthenticated(true);
    } else {
      setUsername('Guest');
      setUserId(null);
      setUserProfilePicture(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const verifyStoredToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/verify-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('username', data.user.UserPseudo || 'Guest');
            setUsername(data.user.UserPseudo || 'Guest');
            setUserId(data.user._id);
            setUserProfilePicture(data.user.UserProfilePicture || null);
            setIsAuthenticated(true);
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyStoredToken();

    // Écouter les changements du localStorage (pour la connexion via LogInForm)
    const handleStorageChange = () => {
      updateAuthState();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const refreshAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/verify-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUsername(data.user.UserPseudo || 'Guest');
          setUserId(data.user._id);
          setUserProfilePicture(data.user.UserProfilePicture || null);
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUsername('Guest');
    setUserId(null);
    setUserProfilePicture(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ username, userId, userProfilePicture, isAuthenticated, isLoading, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
