import React, { useContext } from "react"
import { StatusBar } from "react-native"
import { ThemeContext } from "../context/themeContext"

const ThemedStatusBar = () => {
    const { isDarkMode, theme } = useContext(ThemeContext)

    return (
        <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={theme.colors.background} //Android
        />
    )
}

export default ThemedStatusBar
