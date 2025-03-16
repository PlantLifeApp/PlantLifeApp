import React, { useContext } from "react"
import { Surface, Text, Button, SegmentedButtons } from "react-native-paper"
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

                <View style={styles.topContent}>
                    <Text variant="bodyMedium">Signed in as:</Text>
                    <Text variant="bodyLarge" style={styles.sectionEnd}>{user?.email}</Text>

                    <Text variant="bodyMedium">Theme:</Text>
                    <SegmentedButtons
                            value={useSystemTheme ? "system" : isDarkMode ? "dark" : "light"}
                            onValueChange={(value) => {
                                if (value === "system") {
                                    setUseSystemTheme(true)
                                } else {
                                    setUseSystemTheme(false)
                                    setIsDarkMode(value === "dark")
                                }
                            }}
                            buttons={[
                                { value: "system", label: "System" },
                                { value: "light", label: "Light" },
                                { value: "dark", label: "Dark" },
                            ]}
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