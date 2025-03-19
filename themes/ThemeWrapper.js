import React, { useContext } from 'react'
import { AuthProvider } from '../context/authContext'
import AuthNavigator from '../navigation/AuthNavigator'
import { PaperProvider } from 'react-native-paper'
import { ThemeContext } from '../context/themeContext'
import { PlantsProvider } from '../context/plantsContext'
export default function ThemeWrapper() {
    const { theme } = useContext(ThemeContext)

    return (
        <PaperProvider theme={theme}>
            <AuthProvider>
                <AuthNavigator />
            </AuthProvider>
        </PaperProvider>
    )
}