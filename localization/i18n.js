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
                    noWateringHistory: "No watering history",
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
                    title: "Plant Info",
                    succulent: "Succulent",
                    cactus: "Cactus",
                    general: "General",
                    utilitarian: "Utilitarian",
                    watering: "Watering",
                    fertilization: "Fertilizing",
                    pruning: "Pruning",
                    type: "Plant Type",
                    justWatered: "Just Watered",
                    justFertilized: "Just Fertilized",
                    justPruned: "Pruned",
                    justRepotted: "Repotted",
                    careHistory: "Care History",
                    lastWatered: "Last watered",
                    lastFertilized: "Last fertilized",
                    lastPruned: "Last pruned",
                    lastRepotted: "Last repotted",
                    plantNotFound: "Plant not found",
                    noCareHistory: "No care history yet",
                    neverWatered: "No waterings yet!",
                    neverFertilized: "No fertilizations yet!",
                    neverPruned: "No prunings yet!",
                    neverRepotted: "No repottings recorded!",
                    basedOnHistory: "Based on your recent care history...",
                    nextWateringEstimate: "Your plant might need water around",
                    nextFertilizationEstimate: "Consider fertilizing again around",
                    successfullyAdded: "Event added!",
                    errorAdding: "Error adding event. Please try again.",
                    event: "Events",
                    needMoreEvents: "Need more events to calculate!",
                    editHistory: "Edit Care History",
                    editPlant: "Edit Plant Info",
                    infoTitle: "About Care Predictions",
                    infoMessage: "Our watering and fertilizing estimates are based on your history, not rigid schedules. Your plant, your rules – trust your green thumb!"
                },
                editPlant: {
                    title: "Edit Plant Info",
                    givenName: "Plant Nickname",
                    scientificName: "Scientific Name",
                    plantType: "Plant Type",
                    plantNotFound: "Plant not found",
                    delete: "Delete This Plant",
                    errorDeleting: "Error deleting plant!",
                    confirmDeleteTitle: "Delete Plant",
                    confirmDelete: "Are you sure you want to delete this plant? This action cannot be undone.",
                },
                editCareHistory: {
                    title: "Edit Care History",
                    editCareHistory: "Edit Care History",
                    date: "Date",
                    type: "Type",
                    confirmDeleteTitle: "Delete Entry",
                    confirmDelete: "Are you sure you want to delete this entry?",
                    errorDeleting: "Error deleting entry",
                    successDeleting: "Care entry deleted!",
                    watering: "Watering",
                    fertilizing: "Fertilizing",
                    fertilization: "Fertilizing",
                    pruning: "Pruning",
                    repotting: "Repotting",
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
                    camera: "Take Photo",
                    phoneGallery: "Choose Photo",
                    requestPermissionHeader: "Permission Needed",
                    requestMediaPermission: "Allow Access to Photos",
                    requestCameraPermission: "Allow Access to Camera",
                }
            },
            common: {
                confirm: "Confirm",
                cancel: "Cancel",
                save: "Save",
                ok: "OK",
                delete: "Delete"
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
                    loginButton: "Kirjaudu sisään",
                    registerButton: "Rekisteröidy",
                    username: "Käyttäjänimi",
                    email: "Sähköpostiosoite",
                    password: "Salasana",
                    goToRegister: "Ei käyttäjätunnusta? Rekisteröidy täällä!",
                    goToLogin: "Oletko jo rekisteröitynyt? Kirjaudu täällä!",
                    registerHeader: "Rekisteröidy PlantLife-sovellukseen!"
                },
                home: {
                    noWateringHistory: "Ei kasteluhistoriaa",
                },
                addPlant: {
                    title: "Lisää kasvin tiedot",
                    nickname: "Kasvin lempinimi",
                    scientificName: "Tieteellinen nimi",
                    selectType: "Valitse tyyppi",
                    addButton: "Lisää kasvi",
                    cancelButton: "Peruuta"
                },
                plant: {
                    title: "Kasvin tiedot",
                    succulent: "mehikasvi",
                    cactus: "kaktus",
                    general: "yleinen",
                    utilitarian: "hyötykasvi",
                    watering: "kastelu",
                    fertilization: "lannoitus",
                    pruning: "leikkaus",
                    lastRepotted: "Viimeksi istutettu uudelleen",
                    neverRepotted: "Ei vielä uudelleenistutuksia!",
                    justRepotted: "Mullat vaihdettu!",
                    repotting: "Uudelleenistutus",
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
                    noWaterings: "Ei vielä kasteltu!",
                    noFertilizations: "Ei vielä lannoitettu!",
                    noPrunings: "Ei vielä leikattu!",
                    basedOnHistory: "Perustuen viimeaikaiseen hoitohistoriaasi...",
                    nextWateringEstimate: "Kasvisi saattaa tarvita kastelua noin",
                    nextFertilizationEstimate: "Harkitse lannoittamista uudelleen noin",
                    successfullyAdded: "Tapahtuma lisätty!",
                    errorAdding: "Virhe lisättäessä tapahtumaa. Yritä uudelleen.",
                    event: "Tapahtumat",
                    needMoreEvents: "Tarvitaan lisää tapahtumia laskentaan!",
                    editHistory: "Muokkaa hoitohistoriaa",
                    editPlant: "Muokkaa kasvin tietoja",
                    infoTitle: "Hoitoennusteista",
                    infoMessage: "Kastelu- ja lannoitusarviot perustuvat hoitohistoriaasi, eivät tiukkoihin aikatauluihin. Sinä tunnet kasvisi parhaiten – luota vihreään peukaloosi!"
                },
                editPlant: {
                    title: "Muokkaa kasvin tietoja",
                    givenName: "Lempinimi",
                    scientificName: "Tieteellinen nimi",
                    plantType: "Kasvityyppi",
                    plantNotFound: "Kasvia ei löytynyt",
                    delete: "Poista kasvi",
                    errorDeleting: "Virhe poistaessa kasvia",
                    confirmDeleteTitle: "Poista kasvi",
                    confirmDelete: "Oletko varma, että haluat poistaa kasvin? Tätä toimintoa ei voi peruuttaa.",
                },
                editCareHistory: {
                    title: "Muokkaa hoitohistoriaa",
                    editCareHistory: "Muokkaa hoitohistoriaa",
                    date: "Päivämäärä",
                    type: "Tyyppi",
                    confirmDeleteTitle: "Poista tapahtuma",
                    confirmDelete: "Oletko varma, että haluat poistaa tämän tapahtuman?",
                    errorDeleting: "Virhe poistaessa tapahtumaa",
                    successDeleting: "Hoitotapahtuma poistettu!",
                    watering: "kastelu",
                    fertilizing: "lannoitus",
                    fertilization: "lannoitus",
                    pruning: "hoitoleikkaus",
                    repotting: "multien uusiminen",
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
                save: "Tallenna",
                ok: "OK"
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
                    noWateringHistory: "Ingen vattningshistorik",
                },
                addPlant: {
                    title: "Lägg till växtinformation",
                    nickname: "Växtens smeknamn",
                    scientificName: "Vetenskapligt namn",
                    selectType: "Välj typ",
                    addButton: "Lägg till växt",
                    cancelButton: "Avbryt",
                },
                plant: {
                    title: "Växtinfo",
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
                    noPrunings: "Inga beskärningar än!",
                    basedOnHistory: "Baserat på din senaste vårdhistorik...",
                    nextWateringEstimate: "Din växt kan behöva vatten runt",
                    nextFertilizationEstimate: "Överväg att gödsla igen runt",
                    successfullyAdded: "Händelse tillagd!",
                    errorAdding: "Fel vid tillägg av händelse. Försök igen.",
                    event: "Händelser",
                    needMoreEvents: "Behöver fler händelser för att beräkna!",
                    editHistory: "Redigera vårdhistorik",
                    editPlant: "Redigera växtinformation",
                    infoTitle: "Om skötselprognoser",
                    infoMessage: "Våra uppskattningar för vattning och gödsling baseras på din historik, inte fasta scheman. Du känner din växt bäst – lita på din gröna tumme!"
                },
                editPlant: {
                    title: "Redigera växtinformation",
                    givenName: "Smeknamn",
                    scientificName: "Vetenskapligt namn",
                    plantType: "Växttyp",
                    plantNotFound: "Växten hittades inte",
                    delete: "Ta bort denna växt",
                    errorDeleting: "Fel vid borttagning av växt",
                    confirmDeleteTitle: "Ta bort växt",
                    confirmDelete: "Är du säker på att du vill ta bort denna växt? Denna åtgärd kan inte ångras.",
                },
                editCareHistory: {
                    title: "Redigera vårdhistorik",
                    editCareHistory: "Redigera vårdhistorik",
                    date: "Datum",
                    type: "Typ",
                    confirmDeleteTitle: "Ta bort post",
                    confirmDelete: "Är du säker på att du vill ta bort denna post?",
                    errorDeleting: "Fel vid borttagning av post",
                    successDeleting: "Vårdpost borttagen!",
                    watering: "vattning",
                    fertilizing: "gödsling",
                    fertilization: "gödsling",
                    pruning: "beskärning",
                    repotting: "ompotning",
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
                    listEmpty: "Inga bilder tillgängliga",
                },
                fab: {
                    camera: "Ta foto",
                    phoneGallery: "Välj foto",
                    requestPermissionHeader: "Behörighet krävs",
                    requestMediaPermission: "Tillåt åtkomst till bilder",
                    requestCameraPermission: "Tillåt åtkomst till kamera",

                },
            },

            common: {
                confirm: "Bekräfta",
                cancel: "Avbryt",
                save: "Spara",
                ok: "OK"
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