// "use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useColorScheme } from "react-native"

// Define theme colors
const lightTheme = {
  background: "#FFFFFF",
  card: "#F9F9F9",
  text: "#333333",
  border: "#E0E0E0",
  primary: "#3366FF",
  secondary: "#5E5CE6",
  success: "#00C853",
  warning: "#FFD600",
  danger: "#FF3B30",
  info: "#0A84FF",
  gray: "#8E8E93",
}

const darkTheme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  border: "#2C2C2C",
  primary: "#5E8AFF",
  secondary: "#7A7AFF",
  success: "#30D158",
  warning: "#FFD60A",
  danger: "#FF453A",
  info: "#64D2FF",
  gray: "#8E8E93",
}

type ThemeType = typeof lightTheme

type ThemeContextType = {
  theme: ThemeType
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark")
  const theme = isDarkMode ? darkTheme : lightTheme

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>
}
