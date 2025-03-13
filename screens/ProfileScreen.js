import React, { useContext } from "react"
import { Surface, Text, Button, Switch } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { getAuth, signOut } from "firebase/auth"
import { AuthContext } from "../context/authContext"
import { ThemeContext } from "../context/themeContext"
import { SafeAreaView } from "react-native-safe-area-context"

export default function ProfileScreen() {
    const { user } = useContext(AuthContext)
    const auth = getAuth()

    const { useSystemTheme, setUseSystemTheme, isDarkMode, setIsDarkMode } = useContext(ThemeContext)

    return (
            <Surface style={styles.container}>

                <View style={styles.topContent}>
                    <Text variant="bodyLarge">Signed in as:</Text>
                    <Text variant="bodyLarge" style={styles.sectionEnd}>{user?.email}</Text>

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

                <View style={styles.bottomContent}>
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
        height: "100%",
    },

    topContent: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    bottomContent: {
        alignItems: "center",
        width: "100%",
    },

    mainButton: {
        alignSelf: "stretch",
        margin: 10
    },

    sectionEnd: {
        marginBottom: 20,
    },

    paragraph: {
        marginTop: 20,
        marginBottom: 10,
    },
    
})