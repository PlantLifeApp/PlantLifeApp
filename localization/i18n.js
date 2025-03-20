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
                    succulent: "Succulent",
                    cactus: "Cactus",
                    general: "General",
                    utilitarian: "Utilitarian",
                    watering: "Watering",
                    fertilization: "Fertilizing",
                    pruning: "Pruning",
                    type: "Plant Type",
                    justWatered: "Just Watered!",
                    justFertilized: "Fertilized!",
                    justPruned: "Pruned!",
                    careHistory: "Care History",
                    lastWatered: "Last watered",
                    lastFertilized: "Last fertilized",
                    lastPruned: "Last pruned",
                    plantNotFound: "Plant not found",
                    noCareHistory: "No care history yet",
                    noWaterings: "No waterings yet!",
                    noFertilizations: "No fertilizations yet!",
                    noPrunings: "No prunings yet!",
                    basedOnHistory: "Based on your recent care history...",
                    nextWateringEstimate: "Your plant might need water around",
                    nextFertilizationEstimate: "Consider fertilizing again around",
                    successfullyAdded: "Event added!",
                    errorAdding: "Error adding event. Please try again.",
                    event: "Events",
                    needMoreEvents: "Need more events to calculate!",
                    editHistory: "Edit Care History",
                    editPlant: "Edit Plant Info",
                },
                editPlant: {
                    plantNotFound: "Plant not found",
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

                },
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
                plant: {
                    succulent: "mehikasvi",
                    cactus: "kaktus",
                    general: "yleinen",
                    utilitarian: "hyötykasvi",
                    watering: "kastelu",
                    fertilization: "lannoitus",
                    pruning: "leikkaus",
                    type: "Kasvityyppi",
                    justWatered: "Kasteltu!",
                    justFertilized: "Lannoitettu!",
                    justPruned: "Leikattu!",
                    careHistory: "Hoitohistoria",
                    lastWatered: "Viimeksi kasteltu",
                    lastFertilized: "Viimeksi lannoitettu",
                    lastPruned: "Viimeksi leikattu",
                    plantNotFound: "Kasvia ei löytynyt",
                    noCareHistory: "Ei hoitohistoriaa vielä",
                    noWaterings: "Ei vielä kasteltu",
                    noFertilizations: "Ei vielä lannoitettu!",
                    noPrunings: "Ei vielä leikattu!",
                    nextWateringEstimate: "Seuraava kastelu arvioitu olevan noin",
                    nextFertilizationEstimate: "Seuraava lannoitus arvioitu olevan noin",
                    successfullyAdded: "Lisätty!",
                    errorAdding: "Virhe lisättäessä tapahtumaa. Yritä uudelleen.",
                    event: "Tapahtumat"
                },
                editPlant: {
                    plantNotFound: "Kasvia ei löytynyt",
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
                plant: {
                    succulent: "suckulent",
                    cactus: "kaktus",
                    general: "allmän",
                    utilitarian: "nyttoväxt",
                    watering: "vattning",
                    fertilization: "gödsling",
                    pruning: "beskärning",
                    type: "Växttyp",
                    justWatered: "Vattnad!",
                    justFertilized: "Gödslad!",
                    justPruned: "Beskuren!",
                    careHistory: "Vårdhistorik",
                    lastWatered: "Senast vattnad",
                    lastFertilized: "Senast gödslad",
                    lastPruned: "Senast beskuren",
                    plantNotFound: "Växten hittades inte",
                    noCareHistory: "Ingen vårdhistorik än",
                    noWaterings: "Inga vattningar än!",
                    noFertilizations: "Inga gödslingar än!",
                    noPrunings: "Inga beskärningar än",
                    nextWateringEstimate: "Nästa vattning uppskattas vara runt",
                    nextFertilizationEstimate: "Nästa gödsling uppskattas vara runt",
                    successfullyAdded: "Tillagd!",
                    errorAdding: "Fel vid tillägg av händelse. Försök igen.",
                    event: "Händelser",
                },
                editPlant: {
                    plantNotFound: "Växten hittades inte",
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