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
                addPlant: {
                    title: "Enter plant details",
                    nickname: "Plant Nickname",
                    scientificName: "Scientific Name",
                    selectType: "Select Type",
                    addButton: "Add Plant",
                    cancelButton: "Cancel"
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
                },
                gallery: {
                    listEmpty: "No Images Available",
                },
                fab: {
                    camera: "Take photo",
                    phoneGallery: "Choose photo",
                    requestPermissionHeader: "Permission is needed",
                    requestMediaPermission: "Allow access to photos",
                    requestCameraPermission: "Allow access to camera",
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
                addPlant: {
                    title: "Lisää kasvin tiedot",
                    nickname: "Kasvin Lempinimi",
                    scientificName: "Tieteellinen Nimi",
                    selectType: "Valitse tyyppi",
                    addButton: "Lisää Kasvi",
                    cancelButton: "Peruuta"
                },
                plant: {
                    plantNotFound: "Kasvia ei löytynyt.",
                },
                editPlant: {
                    plantNotFound: "Kasvia ei löytynyt.",
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
                },
                gallery: {
                    listEmpty: "Ei kuvia saatavilla"
                },
                fab: {
                    camera: "Ota kuva",
                    phoneGallery: "Valitse kuva",
                    requestPermissionHeader: "Lupa tarvitaan",
                    requestMediaPermission: "Anna sovellukselle pääsy kuviin",
                    requestCameraPermission: "Anna sovellukselle pääsy kameraan",
                },
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
                addPlant: {
                    title: "Lisää kasvin tiedot",   //TRANSLATION ---->
                    nickname: "Kasvin Lempinimi",
                    scientificName: "Tieteellinen Nimi",
                    selectType: "Valitse tyyppi",
                    addButton: "Lisää Kasvi",
                    cancelButton: "Ja but Nej"         //<------
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
                },
                gallery: {
                    // listEmpty: "No Images Available",
                },
                fab: {
                    // camera: "Take photo",
                    // phoneGallery: "Choose photo",
                    // requestPermissionHeader: "Permission is needed",
                    // requestMediaPermission: "Allow access to photos",
                    // requestCameraPermission: "Allow access to camera",
                },
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