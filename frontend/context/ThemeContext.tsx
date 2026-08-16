"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ColorMode = "amber" | "blue" | "pink" | "rose" | "emerald" | "black";

export interface ColorModeConfig {
  name: string;
  value: ColorMode;
  hex: string;
  bgClass: string;
}

export const COLOR_MODES: ColorModeConfig[] = [
  { name: "Amber", value: "amber", hex: "#F59E0B", bgClass: "bg-[#F59E0B]" },
  { name: "Blue", value: "blue", hex: "#3B82F6", bgClass: "bg-[#3B82F6]" },
  { name: "Pink", value: "pink", hex: "#EC4899", bgClass: "bg-[#EC4899]" },
  { name: "Rose", value: "rose", hex: "#F43F5E", bgClass: "bg-[#F43F5E]" },
  { name: "Emerald", value: "emerald", hex: "#10B981", bgClass: "bg-[#10B981]" },
  { name: "Black", value: "black", hex: "#171717", bgClass: "bg-[#171717]" },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  currentColorHex: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [colorMode, setColorModeState] = useState<ColorMode>("black");

  // Load saved theme and color mode on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme") as Theme;
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeState(savedTheme);
    }

    const savedColorMode = localStorage.getItem("app_color_mode") as ColorMode;
    if (savedColorMode && COLOR_MODES.some((c) => c.value === savedColorMode)) {
      setColorModeState(savedColorMode);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("app_theme", newTheme);
    if (typeof document !== "undefined") {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const setColorMode = (newColorMode: ColorMode) => {
    setColorModeState(newColorMode);
    localStorage.setItem("app_color_mode", newColorMode);
    if (typeof document !== "undefined") {
      const modeConfig = COLOR_MODES.find((c) => c.value === newColorMode);
      if (modeConfig) {
        document.documentElement.style.setProperty("--primary-accent", modeConfig.hex);
      }
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      const modeConfig = COLOR_MODES.find((c) => c.value === colorMode);
      if (modeConfig) {
        document.documentElement.style.setProperty("--primary-accent", modeConfig.hex);
      }
    }
  }, [theme, colorMode]);

  const currentColorHex = COLOR_MODES.find((c) => c.value === colorMode)?.hex || "#171717";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        colorMode,
        setColorMode,
        currentColorHex,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
