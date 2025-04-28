import React, { useContext } from 'react'
import { AuthProvider } from '../context/authContext'
import AuthNavigator from '../navigation/AuthNavigator'
import { PaperProvider } from 'react-native-paper'
import { ThemeContext } from '../context/themeContext'
import Toast from 'react-native-toast-message'

// this component wraps the entire app in the theme provider and auth provider
// toast is also wrapped here to ensure it has access to the theme

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