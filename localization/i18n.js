import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import AsyncStorage from "@react-native-async-storage/async-storage"


const resources = {
    en: {
        translation: {
            tabs: {
                home: "Home",
                options: "Options",
                gallery: "Gallery"
            },
            screens: {
                auth: {
                    loginTitle: "Login",
                    registerTitle: "Register",
                    loginButton: "Log in",
                    registerButton: "Register",
                    username: "Username",
                    email: "Email address",
                    password: "Password",
                    goToRegister: "No account yet? Register here!",
                    goToLogin: "Already have an account? Sign in here!",
                    registerHeader: "Sign up to PlantLife!"
                },
                home: {
                    
                },
                plant: {
                    plantNotFound: "Plant not found.",
                },
                editPlant: {
                    plantNotFound: "Plant not found.",
                },
                options: {
                    themeHeader: "Theme",
                    system: "System",
                    light: "Light",
                    dark: "Dark",
                    languageHeader: "Language",
                    languages: "Languages",
                    languagePlaceholder: "Select language",
                    logoutButton: "Log Out",
                    deleteAccountButton: "Delete Account",
                    signedInAs: "Signed in as"
                }
            },
            common: {
                confirm: "Confirm",
                cancel: "Cancel",
                save: "Save"
            }
        }
    },
    fi: {
        translation: {
            tabs: {
                home: "Koti",
                options: "Valinnat",
                gallery: "Galleria"
            },
            screens: {
                auth: {
                    loginTitle: "Kirjautuminen",
                    registerTitle: "Rekisteröityminen",
                    loginButton: "Kirjaudu Sisään",
                    registerButton: "Rekisteröidy",
                    username: "Käyttäjänimi",
                    email: "Sähköpostiosoite",
                    password: "Salasana",
                    goToRegister: "Ei käyttäjätunnusta? Rekisteröidy täällä!",
                    goToLogin: "Oletko jo rekisteröitynyt? Kirjaudu täällä!",
                    registerHeader: "Rekisteröidy PlantLife sovellukseen!"
                },
                home: {
                    
                },
                options: {
                    themeHeader: "Teema",
                    system: "Järjestelmä",
                    light: "Vaalea",
                    dark: "Tumma",
                    languageHeader: "Kieli",
                    languages: "Kielet",
                    languagePlaceholder: "Valitse kieli",
                    logoutButton: "Kirjaudu ulos",
                    deleteAccountButton: "Poista käyttäjätunnus",
                    signedInAs: "Kirjautuneena käyttäjänä"
                }
            },
            common: {
                confirm: "Vahvista",
                cancel: "Peruuta",
                save: "Tallenna"
            }
        }
    },
    sv: {
        translation: {
            tabs: {
                home: "Hem",
                options: "Alternativ",
                gallery: "Galleri"
            },
            screens: {
                auth: {
                    loginTitle: "Logga in",
                    registerTitle: "Registrera",
                    loginButton: "Logga in",
                    registerButton: "Registrera",
                    username: "Användarnamn",
                    email: "E-postadress",
                    password: "Lösenord",
                    goToRegister: "Inget konto än? Registrera dig här!",
                    goToLogin: "Har du redan ett konto? Logga in här!",
                    registerHeader: "Registrera dig på PlantLife!"
                },
                home: {
                    
                },
                plant: {
                    plantNotFound: "Växten hittades inte.",
                },
                editPlant: {
                    plantNotFound: "Växten hittades inte.",
                },
                options: {
                    themeHeader: "Tema",
                    system: "System",
                    light: "Ljus",
                    dark: "Mörk",
                    languageHeader: "Språk",
                    languages: "Språk",
                    languagePlaceholder: "Välj språk",
                    logoutButton: "Logga ut",
                    deleteAccountButton: "Ta bort konto",
                    signedInAs: "Inloggad som",
                }
            },
            common: {
                confirm: "Bekräfta",
                cancel: "Avbryt",
                save: "Spara"
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