import React, { useContext } from "react"
import { Surface, Text, Button, Switch } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { getAuth, signOut } from "firebase/auth"
import { AuthContext } from "../context/authContext"
import { ThemeContext } from "../context/themeContext"

export default function ProfileScreen() {
    const { user } = useContext(AuthContext)
    const auth = getAuth()

    const { useSystemTheme, setUseSystemTheme, isDarkMode, setIsDarkMode } = useContext(ThemeContext)

    return (
        <Surface style={styles.container}>

            <View style={styles.content}>
                <Text variant="headlineSmall">Signed in as:</Text>
                <Text variant="headlineSmall" style={styles.sectionEnd}>{user?.email}</Text>

                <Text variant="bodyMedium" style={styles.paragraph}>Use System Theme:</Text>
                <Switch 
                    value={useSystemTheme} 
                    onValueChange={(value) => setUseSystemTheme(value)} 
                />

                <Text variant="bodyMedium" style={styles.paragraph}>Always Use Dark Theme:</Text>
                <Switch 
                    value={isDarkMode}
                    onValueChange={(value) => setIsDarkMode(value)}
                    disabled={useSystemTheme}
                />  
            </View>

            <View style={styles.buttonContainer}>
                <Button style={styles.mainButton} mode="contained" onPress={() => signOut(auth)}>
                    Log Out
                </Button>

                <Button style={styles.mainButton} mode="contained">
                    Delete Account
                </Button>
            </View>
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensures the entire screen is used
        padding: 20,
    },

    content: {
        flexGrow: 1, // Ensures the content takes all available space
        justifyContent: "center", // Keeps content centered
        alignItems: "center",
    },

    buttonContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        alignSelf: "flex-end"
    },

    mainButton: {
        alignSelf: "stretch",
        margin: 20
    },

    sectionEnd: {
        marginBottom: 20,
    },

    paragraph: {
        marginTop: 20,
        marginBottom: 10,
    },
})