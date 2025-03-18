import React, { useContext } from 'react'
import { AuthProvider } from '../context/authContext'
import AuthNavigator from '../navigation/AuthNavigator'
import { PaperProvider } from 'react-native-paper'
import { ThemeContext } from '../context/themeContext'
import Toast from 'react-native-toast-message'

export default function ThemeWrapper() {
    const { theme } = useContext(ThemeContext)

    return (
        <PaperProvider theme={theme}>
            <AuthProvider>
                <AuthNavigator />
                <Toast ref={Toast.setRef} />
            </AuthProvider>
        </PaperProvider>
    )
}