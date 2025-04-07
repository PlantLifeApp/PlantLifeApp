import React, { useContext, useState, useEffect } from "react"
import { Surface, Text, Button, SegmentedButtons, Portal, Dialog } from "react-native-paper"
import { StyleSheet, View } from "react-native"
import { getAuth, signOut } from "firebase/auth"
import { AuthContext } from "../context/authContext"
import { ThemeContext } from "../context/themeContext"
import { useTranslation } from "react-i18next"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dropdown } from "react-native-paper-dropdown"
import LANGUAGES from "../localization/languages"
import { useNavigation } from "@react-navigation/native"
import DeleteAccountModal from "../components/profile/deleteAccountModal"
import { deleteAccount } from "../services/authService"
import { getWinterMonths, setWinterMonths } from "../utils/dateUtils"
import WinterModal from "../components/profile/WinterModal"

export default function ProfileScreen() {
    const { user } = useContext(AuthContext)
    const { t, i18n } = useTranslation()
    const [language, setLanguage] = useState(i18n.language)
    const auth = getAuth()
    const navigation = useNavigation()

    const { useSystemTheme, setUseSystemTheme, isDarkMode, setIsDarkMode } = useContext(ThemeContext)

    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [winterStart, setWinterStart] = useState(11) // default: November
    const [winterEnd, setWinterEnd] = useState(3) // default: March
    const [savedWinterStart, setSavedWinterStart] = useState(11)
    const [savedWinterEnd, setSavedWinterEnd] = useState(3)
    const [winterMode, setWinterMode] = useState("default")
    const [winterModalVisible, setWinterModalVisible] = useState(false)

    const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
        label: new Date(2000, i).toLocaleString(i18n.language, { month: 'long' }),
        value: i + 1,
    }))

    useEffect(() => {
        getWinterMonths().then(({ start, end }) => {
            setSavedWinterStart(start)
            setSavedWinterEnd(end)
            setWinterStart(start)
            setWinterEnd(end)
        
            if (start === 11 && end === 3) {
                setWinterMode("default")
            } else {
                setWinterMode("custom")
            }
        })
    }, [])

    const handleSaveWinterMonths = async () => {
        await setWinterMonths(winterStart, winterEnd)
        setSavedWinterStart(winterStart)
        setSavedWinterEnd(winterEnd)
        setWinterMode(
            winterStart === 11 && winterEnd === 3 ? "default" : "custom"
        )
        setWinterModalVisible(false)
    }

    const handleCancelWinterModal = () => {
        setWinterStart(savedWinterStart)
        setWinterEnd(savedWinterEnd)
        setWinterMode(
            savedWinterStart === 11 && savedWinterEnd === 3 ? "default" : "custom"
        )
        setWinterModalVisible(false)
    }
    const [dialogMessage, setDialogMessage] = useState('')
    const [dialogVisible, setDialogVisible] = useState(false)

    const changeLanguage = async (lng) => {
        i18n.changeLanguage(lng)
        setLanguage(lng)
        await AsyncStorage.setItem("language", lng)
    }

    const changeTheme = async (theme) => {
        if (theme === "system") {
            setUseSystemTheme(true)
        } else {
            setUseSystemTheme(false)
            setIsDarkMode(theme === "dark")
        }
        await AsyncStorage.setItem("theme", theme)
    }

    const handleDelete = async (password) => {
        try {
            await deleteAccount(password)
            console.log('account deleted')
            
        } catch (error) {
            if ( error.code === 'auth/invalid-credential') {
                setDialogMessage(t("screens.options.wrongPassword"))
            }
            else if(error.code === 'auth/too-many-requests') {
                setDialogMessage(t("screens.options.tooManyRequest"))
            }
            else{
                setDialogMessage(`${t("screens.options.errorDeleting")}: ${error.message}`)
            }
             setDialogVisible(true)

            setTimeout(() => {
                setDialogVisible(false)
            }, 7000)
        }
    }

    return (

        <Surface style={styles.container}>
            <View style={styles.topContent}>
                <Text variant="bodyMedium">{t("screens.options.signedInAs")}</Text>
                <Text variant="bodyLarge" style={styles.sectionEnd}>{user?.email}</Text>

                <Text variant="bodyLarge">{t("screens.options.themeHeader")}</Text>
                <SegmentedButtons
                    value={useSystemTheme ? "system" : isDarkMode ? "dark" : "light"}
                    onValueChange={(value) => changeTheme(value)}
                    buttons={[
                        { value: "system", label: t("screens.options.system") },
                        { value: "light", label: t("screens.options.light") },
                        { value: "dark", label: t("screens.options.dark") },
                    ]}
                />
            
                <View style={{height: 12}} />

                <View style={styles.winterContainer}>
                    <Text style={{alignSelf: "center"}} variant="bodyLarge">{t("screens.options.winterMonthsHeader")}</Text>

                    <SegmentedButtons
                        value={winterMode}
                        onValueChange={(value) => {
                            setWinterMode(value)
                            if (value === "default") {
                                setWinterStart(11)
                                setWinterEnd(3)
                                setWinterMonths(11, 3)
                            } else if (value === "custom") {
                                setWinterModalVisible(true)
                            }
                        }}
                        buttons={[
                            { value: "default", label: t("screens.options.useDefault") },
                            { value: "custom", label: t("screens.options.setCustom") },
                        ]}
                    />
                </View>

                <Text style={{alignSelf: "center"}} variant="bodyLarge">{t("screens.options.graveyardHeading")}</Text>
                <Button style={styles.singleButtonRow} mode="contained" onPress={() => 
                    navigation.navigate("Home", {
                        screen: "GraveyardScreen",
                    })}>{t("screens.options.visitGraveyard")}
                </Button>

                <View style={{height: 12}} />

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

                <WinterModal
                    visible={winterModalVisible}
                    onClose={handleCancelWinterModal}
                    winterStart={winterStart}
                    winterEnd={winterEnd}
                    setWinterStart={setWinterStart}
                    setWinterEnd={setWinterEnd}
                    onSave={handleSaveWinterMonths}
                    monthOptions={MONTH_OPTIONS}
                />

            </View>

            <View style={styles.bottomContent}>

                <View style={styles.doubleButtonRow}>
                    <Button style={styles.mainButton} mode="contained" onPress={() => signOut(auth)}>
                        {t("screens.options.logoutButton")}
                    </Button>

                    <Button style={styles.mainButton} mode="contained" onPress={ () => setDeleteModalVisible(true)}>
                        {t("screens.options.deleteAccountButton")}
                    </Button>
                </View>
            </View>

            <Portal>
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Content style={{alignItems: 'center'}}>
                    <Text >{dialogMessage}</Text>
                </Dialog.Content>
            </Dialog>
        </Portal>
        
        <DeleteAccountModal
            visible={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={(password) => {
                handleDelete(password)
                setDeleteModalVisible(false)
            }}
        />

        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        height: "100%",
        justifyContent: "space-between",
    },

    winterContainer: {
        width: "100%",
        alignSelf: "center",
        marginBottom: 20,
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
        flex: 1,
        alignSelf: "stretch",
        marginBottom: 12,
        marginTop: 12,
        marginLeft: 4,
        marginRight: 4,
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
        paddingHorizontal: 10,
        height: 40,
    },
    doubleButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    singleButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },

})