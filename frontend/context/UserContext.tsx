"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  avatar: string;
  email: string;
  fullName: string;
  title: string;
  username: string;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updatedFields: Partial<UserProfile>) => void;
}

const DEFAULT_USER: UserProfile = {
  avatar: "/Pasted image.png",
  email: "dexter@gmail.com",
  fullName: "Dexter",
  title: "Designer",
  username: "Dexuser",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  useEffect(() => {
    const saved = localStorage.getItem("app_user_profile");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user profile from localStorage", e);
      }
    }
  }, []);

  const updateUser = (updatedFields: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem("app_user_profile", JSON.stringify(next));
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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
