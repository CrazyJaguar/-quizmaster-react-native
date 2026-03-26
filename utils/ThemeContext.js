import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const themes = {
  light: {
    background: "#ffffff",
    card: "#f2f2f7",
    cardBorder: "#e0e0e6",
    text: "#1c1c1e",
    textSecondary: "#6e6e80",
    accent: "#7c3aed",
    accentLight: "#ede9fe",
    correct: "#16a34a",
    correctBg: "#dcfce7",
    wrong: "#dc2626",
    wrongBg: "#fee2e2",
    dimmedText: "#b0b0c0",
    progressBg: "#e8e8ee",
    shadow: "#7c3aed",
    statusBar: "dark-content",
    divider: "#e0e0e6",
  },
  dark: {
    background: "#111111",
    card: "#1c1c1e",
    cardBorder: "#2c2c2e",
    text: "#ffffff",
    textSecondary: "#98989f",
    accent: "#7c3aed",
    accentLight: "#2a1f4e",
    correct: "#4ade80",
    correctBg: "#166534",
    wrong: "#f87171",
    wrongBg: "#991b1b",
    dimmedText: "#555560",
    progressBg: "#2c2c2e",
    shadow: "#000000",
    statusBar: "light-content",
    divider: "#2c2c2e",
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? themes.dark : themes.light;

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem("quizTheme");
        if (saved !== null) {
          setIsDark(saved === "dark");
        }
      } catch (e) {
        console.log("Error loading theme:", e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    try {
      await AsyncStorage.setItem("quizTheme", newIsDark ? "dark" : "light");
    } catch (e) {
      console.log("Error saving theme:", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
