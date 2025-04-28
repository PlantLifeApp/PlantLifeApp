import React, { useContext, useState, useEffect } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Surface, Text, Button, SegmentedButtons, Portal, Dialog } from "react-native-paper"
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
import { getWinterMonths, setWinterMonths, formatDate } from "../utils/dateUtils"
import WinterModal from "../components/profile/WinterModal"
import { usePlants } from "../context/plantsContext"
import { useTheme } from "react-native-paper"

// a reusable component to group options in the profile screen
const ProfileOptionGroup = ({ title, children }) => (
  <View style={styles.groupWrapper}>
    <Text style={styles.groupTitle}>{title}</Text>
    <Surface style={styles.groupSurface} elevation={1}>
      {children}
    </Surface>
  </View>
)

// the options screen is used to show the user's account information
// you can change the theme, language, and winter months
// it is also used to log out, delete account, and navigate to the graveyard screen

export default function ProfileScreen() {

  const { user } = useContext(AuthContext)
  const { alivePlants } = usePlants()
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language)
  const auth = getAuth()
  const navigation = useNavigation()
  const { useSystemTheme, setUseSystemTheme, isDarkMode, setIsDarkMode } = useContext(ThemeContext)

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [dialogVisible, setDialogVisible] = useState(false)

  const [winterStart, setWinterStart] = useState(11)
  const [winterEnd, setWinterEnd] = useState(3)
  const [savedWinterStart, setSavedWinterStart] = useState(11)
  const [savedWinterEnd, setSavedWinterEnd] = useState(3)
  const [winterMode, setWinterMode] = useState("default")
  const [winterModalVisible, setWinterModalVisible] = useState(false)

  useEffect(() => {
    getWinterMonths().then(({ start, end }) => {
      setSavedWinterStart(start)
      setSavedWinterEnd(end)
      setWinterStart(start)
      setWinterEnd(end)
      setWinterMode(start === 11 && end === 3 ? "default" : "custom")
    })
  }, [])

  const handleSaveWinterMonths = async () => {
    await setWinterMonths(winterStart, winterEnd)
    setSavedWinterStart(winterStart)
    setSavedWinterEnd(winterEnd)
    setWinterMode(winterStart === 11 && winterEnd === 3 ? "default" : "custom")
    setWinterModalVisible(false)
  }

  const handleCancelWinterModal = () => {
    setWinterStart(savedWinterStart)
    setWinterEnd(savedWinterEnd)
    setWinterMode(savedWinterStart === 11 && savedWinterEnd === 3 ? "default" : "custom")
    setWinterModalVisible(false)
  }

  const changeLanguage = async (lng) => {
    i18n.changeLanguage(lng)
    setLanguage(lng)
    await AsyncStorage.setItem("language", lng)
  }

  const changeTheme = async (theme) => {
    if (theme === "system") setUseSystemTheme(true)
    else {
      setUseSystemTheme(false)
      setIsDarkMode(theme === "dark")
    }
    await AsyncStorage.setItem("theme", theme)
  }

  const handleDelete = async (password) => {
    try {
      await deleteAccount(password)
    } catch (error) {
      if (error.code === 'auth/invalid-credential') setDialogMessage(t("screens.options.wrongPassword"))
      else if (error.code === 'auth/too-many-requests') setDialogMessage(t("screens.options.tooManyRequest"))
      else setDialogMessage(`${t("screens.options.errorDeleting")}: ${error.message}`)

      setDialogVisible(true)
      setTimeout(() => setDialogVisible(false), 7000)
    }
  }

  // create a list of month options for the dropdown
  // this is used in the winter months modal
  // the months are in the format "January", "February", etc.
  const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(2000, i).toLocaleString(i18n.language, { month: 'long' }),
    value: i + 1,
  }))

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <ProfileOptionGroup title={t("screens.options.account")}>
          <Text variant="bodyLarge">{t("screens.options.signedInAs")} {user?.email}.</Text><Text></Text>
          <Text variant="bodyMedium">{t("screens.options.userSince")} {formatDate(user?.metadata?.creationTime)} {t("screens.options.collectionCount", { count: alivePlants.length })}.</Text>
        </ProfileOptionGroup>

        <ProfileOptionGroup title={t("screens.options.displayPreferences")}>
            <Text style={styles.fieldLabel}>{t("screens.options.themeLabel")}</Text>

            {LANGUAGES.length <= 3 ? (
                <SegmentedButtons
                value={useSystemTheme ? "system" : isDarkMode ? "dark" : "light"}
                onValueChange={changeTheme}
                buttons={[
                    { value: "system", label: t("screens.options.system") },
                    { value: "light", label: t("screens.options.light") },
                    { value: "dark", label: t("screens.options.dark") },
                ]}
                />
            ) : (
                <Dropdown
                placeholder={t("screens.options.themePlaceHolder")}
                options={[
                    { label: t("screens.options.system"), value: "system" },
                    { label: t("screens.options.light"), value: "light" },
                    { label: t("screens.options.dark"), value: "dark" },
                ]}
                value={useSystemTheme ? "system" : isDarkMode ? "dark" : "light"}
                onSelect={changeTheme}
                />
            )}

            <View style={{ height: 16 }} />

            <Text style={styles.fieldLabel}>{t("screens.options.languageLabel")}</Text>

            {LANGUAGES.length <= 3 ? (
                <SegmentedButtons
                value={language}
                onValueChange={changeLanguage}
                buttons={LANGUAGES.map(({ label, value }) => ({
                    value,
                    label,
                }))}
                />
            ) : (
                <Dropdown
                placeholder={t("screens.options.languagePlaceHolder")}
                options={LANGUAGES}
                value={language}
                onSelect={changeLanguage}
                />
            )}
            </ProfileOptionGroup>

        <ProfileOptionGroup title={t("screens.options.plantLifeFeatures")}>
            <Text style={styles.fieldLabel}>{t("screens.options.winterModeLabel")}</Text>
            <SegmentedButtons
            value={winterMode}
            onValueChange={(value) => {
                setWinterMode(value)
                if (value === "default") {
                setWinterStart(11)
                setWinterEnd(3)
                setWinterMonths(11, 3)
                } else {
                setWinterModalVisible(true)
                }
            }}
            buttons={[
                { value: "default", label: t("screens.options.useDefault") },
                { value: "custom", label: t("screens.options.setCustom") },
            ]}
            />

            <View style={{ height: 16 }} />

            <Text style={styles.fieldLabel}>{t("screens.options.graveyardLabel")}</Text>
            <Button
                buttonColor={theme.colors.elevation.level3}
                textColor={theme.colors.onSurface}
                
                style={[
                    styles.graveyardButton,
                    {
                    shadowColor: theme.dark ? "#666" : "#333",
                    borderColor: theme.colors.outline,
                    },
                ]}
                mode="contained"
                onPress={() => navigation.navigate("GraveyardScreen")}
                >
                {t("screens.options.rip")} 🌿
            </Button>
        </ProfileOptionGroup>

        <ProfileOptionGroup title={t("screens.options.accountActions")}>
          <Button 
            mode="contained" 
            onPress={() => signOut(auth)}
            >
                {t("screens.options.logoutButton")}
          </Button>
          <View style={{ height: 8 }} />
          <Button 
            mode="contained" 
            onPress={() => setDeleteModalVisible(true)}
            >
                {t("screens.options.deleteAccountButton")}
          </Button>
        </ProfileOptionGroup>

      </ScrollView>

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

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Content style={{ alignItems: 'center' }}>
            <Text>{dialogMessage}</Text>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  groupWrapper: {
    marginBottom: 24,
    width: "100%",
  },
  groupTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  groupSurface: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
  },
  fieldLabel: {
    marginBottom: 6,
    fontWeight: "400",
  },
  graveyardButton: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,  // This was missing!
    shadowRadius: 4,      // Optional but makes the shadow softer
    elevation: 4,         // Needed for Android shadow
  }
})
