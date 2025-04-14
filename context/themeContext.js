import React, { createContext, useEffect, useState } from "react"
import { useColorScheme } from "react-native"
import { customLightTheme, customDarkTheme } from "../themes/CustomTheme"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ThemedStatusBar from "../themes/ThemedStatusbar"

// create a context for the theme
export const ThemeContext = createContext()

// themeprovider wraps the app and provides theme-related values to all children
export const ThemeProvider = ({ children }) => {

    // get the system theme from the device with react-native hook
    const systemTheme = useColorScheme()

    const [useSystemTheme, setUseSystemTheme] = useState(null)
    const [isDarkMode, setIsDarkMode] = useState(null)

    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem("theme")

                if (!storedTheme || storedTheme == "system") {
                    setUseSystemTheme(true)
                    setIsDarkMode(systemTheme === "dark")
                } else {
                    setUseSystemTheme(false)
                    setIsDarkMode(storedTheme === "dark")
                }
            } catch (error) {
                console.log("Error fetching stored theme", error)
            }
        }
        loadThemePreference()
    }, [systemTheme])

    if (useSystemTheme === null || isDarkMode === null) {
        return null
    }

    // if system theme is enabled, dark mode is set to system theme setting
    // otherwise, dark theme is controlled manually
    const theme = useSystemTheme
        ? (systemTheme === "dark" ? customDarkTheme : customLightTheme)
        : (isDarkMode ? customDarkTheme : customLightTheme)

    return (
        <ThemeContext.Provider value={{ theme, useSystemTheme, setUseSystemTheme, isDarkMode, setIsDarkMode }}>
            <ThemedStatusBar />
            {children}
        </ThemeContext.Provider>
    )
}