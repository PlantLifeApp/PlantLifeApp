import React, { createContext, useState } from "react"
import { useColorScheme } from "react-native"
import { customLightTheme, customDarkTheme } from "../themes/CustomTheme"

// create a context for the theme
export const ThemeContext = createContext()

// themeprovider wraps the app and provides theme-related values to all children
export const ThemeProvider = ({ children }) => {

    // get the system theme from the device with react-native hook
    const systemTheme = useColorScheme()
    
    // state to toggle whether system settings are used
    const [useSystemTheme, setUseSystemTheme] = useState(true)
    
    // state to toggle dark mode
    const [isDarkMode, setIsDarkMode] = useState(systemTheme === "dark")

    // if system theme is enabled, dark mode is set to system theme setting
    // otherwise, dark theme is controlled manually
    const theme = useSystemTheme
        ? (systemTheme === "dark" ? customDarkTheme : customLightTheme)
        : (isDarkMode ? customDarkTheme : customLightTheme)

    return (
        <ThemeContext.Provider value={{ theme, useSystemTheme, setUseSystemTheme, isDarkMode, setIsDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}