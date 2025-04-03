export const searchMostRecentWatering = (careHistory) => {
    let mostRecentWatering = null

    for (let i = 0; i < careHistory.length; i++) {
        const entry = careHistory[i]

        if (entry.type.includes("watering")) {
            let date = entry.date

            // Convert Firestore Timestamp to Date if needed
            if (date && typeof date?.seconds === "number") {
                date = new Date(date.seconds * 1000)
            }

            if (!mostRecentWatering || (date && date > mostRecentWatering)) {
                mostRecentWatering = date
            }
        }
    }

    return mostRecentWatering
}