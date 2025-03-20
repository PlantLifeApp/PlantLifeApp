import { formatDate } from "./dateUtils"


export const searchMostRecentWatering = (careHistory) => {
    console.log(careHistory)
    let mostRecentWatering = 0
    for (let i = 0; i < careHistory.length; i++) {
        console.log(Date(careHistory[i]))
        if (careHistory[i].type.includes("watering") && careHistory[i].date > mostRecentWatering) {
            console.log(mostRecentWatering)
            mostRecentWatering = careHistory[i].date
        }
    }
    if (mostRecentWatering == 0) {
        return 0
    }
    else {
        const rawDate = new Date(mostRecentWatering.seconds * 1000) // convert Firestore timestamp to milliseconds
        return rawDate
    }
}