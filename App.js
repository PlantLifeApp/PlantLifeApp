import { ThemeProvider } from './context/themeContext'
import ThemeWrapper from './themes/ThemeWrapper'
import { I18nextProvider } from 'react-i18next'
import i18n from './localization/i18n'

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <ThemeWrapper />
      </ThemeProvider>
    </I18nextProvider>
  )
}