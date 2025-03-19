import React, { useContext, useState } from "react"
import { Surface, Text, Button, SegmentedButtons } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { getAuth, signOut } from "firebase/auth"
import { AuthContext } from "../context/authContext"
import { ThemeContext } from "../context/themeContext"
import { useTranslation } from "react-i18next"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dropdown } from "react-native-paper-dropdown"
import LANGUAGES from "../localization/languages"

export default function ProfileScreen() {
    const { user } = useContext(AuthContext)
    const { t, i18n } = useTranslation()
    const [language, setLanguage] = useState(i18n.language)
    const auth = getAuth()

    const { useSystemTheme, setUseSystemTheme, isDarkMode, setIsDarkMode } = useContext(ThemeContext)

    const changeLanguage = async (lng) => {
        i18n.changeLanguage(lng)
        setLanguage(lng)
        await AsyncStorage.setItem("language", lng)
    }

    return (
        <Surface style={styles.container}>

            <View style={styles.topContent}>
                <Text variant="bodyMedium">{t("screens.options.signedInAs")}:</Text>
                <Text variant="bodyLarge" style={styles.sectionEnd}>{user?.email}</Text>

                <Text variant="bodyMedium">{t("screens.options.themeHeader")}</Text>
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
                        { value: "system", label: t("screens.options.system") },
                        { value: "light", label: t("screens.options.light") },
                        { value: "dark", label: t("screens.options.dark") },
                    ]}
                />
            </View>

            <View style={styles.languageContainer}>
                <Text variant="bodyMedium">{t("screens.options.languageHeader")}</Text>
                <Dropdown
                    placeholder={t("screens.options.languagePlaceHolder")}
                    options={LANGUAGES}
                    value={language}
                    onSelect={(lng) => changeLanguage(lng)}
                    style={styles.dropdown}
                />
            </View>

            <View style={styles.bottomContent}>
                <Button style={styles.mainButton} mode="contained" onPress={() => signOut(auth)}>
                    {t("screens.options.logoutButton")}
                </Button>

                <Button style={styles.mainButton} mode="contained">
                    {t("screens.options.deleteAccountButton")}
                </Button>
            </View>
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

    languageContainer: {
        width: "80%",
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },

    dropdown: {
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
    },

})