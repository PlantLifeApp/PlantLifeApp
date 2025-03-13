import { MD3LightTheme, MD3DarkTheme } from "react-native-paper"
import { Colors } from '../constants/colors.js'

const customLightTheme = { 
    ...MD3LightTheme, 
    colors: Colors.light, }
const customDarkTheme = { 
    ...MD3DarkTheme, 
    colors: Colors.dark, }

export { customLightTheme, customDarkTheme }