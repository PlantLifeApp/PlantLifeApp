import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import AsyncStorage from "@react-native-async-storage/async-storage"


const resources = {
    en: {
        translation: {
            home: "Home",
            tabs: {
                home: "Home",
                options: "Options",
                gallery: "Gallery"
            }
        }
    },
    fi: {
        translation: {
            tabs: {
                home: "Koti",
                options: "Valinnat",
                gallery: "Galleria"
            }
        }
    }
}

const getStoredLanguage = async () => {
    try {
        const storedLang = await AsyncStorage.getItem("language")
        return storedLang || "en"
    } catch (error) {
        console.error("Error fetching stored language", error)
        return "en"
    }
}

getStoredLanguage().then((lang) => {
    i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: lang,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    })
})

export default i18n