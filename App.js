import { StyleSheet, useColorScheme } from 'react-native'
import { AuthProvider } from './context/authContext'
import AuthNavigator from './navigation/AuthNavigator'
import { PaperProvider } from 'react-native-paper'
import { customLightTheme, customDarkTheme } from './themes/CustomTheme'
import { useContext } from 'react'
import { ThemeContext, ThemeProvider } from './context/themeContext'
import ThemeWrapper from './themes/ThemeWrapper'

import { I18nextProvider } from 'react-i18next'
import i18n from './localization/i18n'

export default function App() {
  return (
    <I18nextProvider>
      <ThemeProvider>
        <ThemeWrapper />
      </ThemeProvider>
    </I18nextProvider>
  )
}