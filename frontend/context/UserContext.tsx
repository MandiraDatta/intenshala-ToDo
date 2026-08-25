"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { userService } from "@/services/user.service";

export interface UserProfile {
  id?: string;
  avatar: string;
  email: string;
  fullName: string;
  title: string;
  username: string;
  theme?: string;
  colorMode?: string;
}

interface UserContextType {
  user: UserProfile;
  loading: boolean;
  updateUser: (updatedFields: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  avatar: "/Pasted image.png",
  email: "",
  fullName: "User",
  title: "Member",
  username: "user",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await userService.getProfile();
      setUser({
        id: data.id,
        email: data.email || "",
        fullName: data.fullName || "User",
        title: data.title || "Member",
        username: data.username || "user",
        avatar: data.avatarUrl || "/Pasted image.png",
        theme: data.theme,
        colorMode: data.colorMode,
      });
    } catch (e) {
      console.error("Failed to fetch user profile from server", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateUser = async (updatedFields: Partial<UserProfile>) => {
    try {
      let newAvatarUrl: string | undefined;
      
      // Update avatar if provided
      if (updatedFields.avatar) {
        const avatarRes = await userService.updateAvatar(updatedFields.avatar);
        newAvatarUrl = avatarRes?.avatarUrl || updatedFields.avatar;
      }

      // Update text fields if provided
      let updatedProfileRes: any;
      if (updatedFields.fullName !== undefined || updatedFields.title !== undefined || updatedFields.username !== undefined) {
        updatedProfileRes = await userService.updateProfile({
          fullName: updatedFields.fullName,
          title: updatedFields.title,
          username: updatedFields.username,
        });
      }

      setUser((prev) => ({
        ...prev,
        fullName: updatedProfileRes?.fullName ?? prev.fullName,
        title: updatedProfileRes?.title ?? prev.title,
        username: updatedProfileRes?.username ?? prev.username,
        avatar: newAvatarUrl || updatedProfileRes?.avatarUrl || prev.avatar,
      }));
    } catch (e) {
      console.error("Failed to update user profile on server", e);
      throw e;
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, refreshUser: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
