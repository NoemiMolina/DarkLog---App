import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config/api";
import { fetchWithCreds } from "../config/fetchClient";

interface AuthContextType {
  username: string;
  userId: string | null;
  userProfilePicture: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateAuthState: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string>("Guest");
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(
    null,
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem("authToken");
  });

  const updateAuthState = () => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUserId && storedToken) {
      setUsername(storedUsername || "Guest");
      setUserId(storedUserId);
      setTokenState(storedToken);
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
      setUsername("Guest");
      setUserId(null);
      setTokenState(null);
      setUserProfilePicture(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    const verifyToken = async (isRetry = false) => {
      try {
        const response = await fetchWithCreds(`${API_URL}/users/verify-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("userId", data.user._id);
            localStorage.setItem("username", data.user.UserPseudo || "Guest");
            setUsername(data.user.UserPseudo || "Guest");
            setUserId(data.user._id);
            setUserProfilePicture(data.user.UserProfilePicture || null);
            setIsAuthenticated(true);
          }
        } else if (response.status === 401) {
          // Token is invalid - clear auth
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          setUsername("Guest");
          setUserId(null);
          setUserProfilePicture(null);
        } else {
          // Other error - keep localStorage data, don't reset auth
          const storedUserId = localStorage.getItem("userId");
          if (storedUserId) {
            // Keep existing auth state from localStorage
            updateAuthState();
            if (!isRetry) {
              retryTimeout = setTimeout(() => verifyToken(true), 2000);
            }
          }
        }
      } catch (error) {
        // Network error or CORS issue - use localStorage as fallback
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          updateAuthState();
        } else {
          setUsername("Guest");
          setUserId(null);
          setUserProfilePicture(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    updateAuthState();
    verifyToken();

    const verifyInterval = setInterval(() => {
      verifyToken();
    }, 60000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        verifyToken();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleStorageChange = () => {
      updateAuthState();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(verifyInterval);
      clearTimeout(retryTimeout);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const refreshAuth = async () => {
    try {
      const response = await fetchWithCreds(`${API_URL}/users/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUsername(data.user.UserPseudo || "Guest");
          setUserId(data.user._id);
          setUserProfilePicture(data.user.UserProfilePicture || null);
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error refreshing auth:", error);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("authToken");
    setUsername("Guest");
    setUserId(null);
    setTokenState(null);
    setUserProfilePicture(null);
    setIsAuthenticated(false);
  };

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem("authToken", newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        userId,
        userProfilePicture,
        isAuthenticated,
        isLoading,
        token,
        logout,
        refreshAuth,
        updateAuthState,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
