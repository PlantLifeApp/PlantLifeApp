import { StyleSheet, useColorScheme } from 'react-native'
import { AuthProvider } from './context/authContext'
import AuthNavigator from './navigation/AuthNavigator'
import { PaperProvider } from 'react-native-paper'
import { customLightTheme, customDarkTheme } from './themes/CustomTheme'
import { useContext } from 'react'
import { ThemeContext, ThemeProvider } from './context/themeContext'
import ThemeWrapper from './themes/ThemeWrapper'

export default function App() {
  return (
      <ThemeProvider>
          <ThemeWrapper />
      </ThemeProvider>
  )
}