import React, { createContext, useState } from "react"
import { useColorScheme } from "react-native"
import { customLightTheme, customDarkTheme } from "../themes/CustomTheme"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme()
    
    const [useSystemTheme, setUseSystemTheme] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(systemTheme === "dark")

    // determine the current theme
    const theme = useSystemTheme
        ? (systemTheme === "dark" ? customDarkTheme : customLightTheme)
        : (isDarkMode ? customDarkTheme : customLightTheme)

    return (
        <ThemeContext.Provider value={{ theme, useSystemTheme, setUseSystemTheme, isDarkMode, setIsDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}