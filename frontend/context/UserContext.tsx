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
      const updated = await userService.updateProfile({
        fullName: updatedFields.fullName,
        title: updatedFields.title,
        username: updatedFields.username,
      });

      setUser((prev) => ({
        ...prev,
        fullName: updated.fullName || prev.fullName,
        title: updated.title || prev.title,
        username: updated.username || prev.username,
        avatar: updated.avatarUrl || prev.avatar,
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
