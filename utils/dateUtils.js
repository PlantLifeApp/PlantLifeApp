// format for ui display based on phone's language/region settings, 
// e.g. 12/31/2022 in USA but 31.12.2025 in Germany
export const formatDate = (date) => {
    if (!date) return ""
    const d = date instanceof Date ? date : new Date(date)
    return d.toLocaleDateString()
}

export const calculateNextWatering = (careHistory) => {

    // first filter out all watering events
    const wateringEvents = careHistory
        .filter(entry => entry.events.includes("watering"))
        .map(entry => entry.date)
        .sort((a, b) => b - a) // sort by date, newest first

    //console.log("All waterings:", wateringEvents)

    // at least two watering events are needed to calculate an estimate
    if (wateringEvents.length < 2) {
        //console.log("Need at least 2 watering events to calculate estimate")
        return null
    }

    // use up to 5 most recent watering events to avoid out-of-season statistics
    const relevantWaterings = wateringEvents.slice(0, 5)

    //console.log("Relevant waterings: ", relevantWaterings)

    // calculate intervals between consecutive waterings
    let intervals = []
    for (let i = 0; i < relevantWaterings.length - 1; i++) {
        const interval = (relevantWaterings[i] - relevantWaterings[i + 1]) / (1000 * 60 * 60 * 24) // convert ms to days
        intervals.push(interval)
    }

    //console.log("Relevant watering intervals: ", intervals)

    // calculate average interval
    const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length // the reduce method is used to sum up all values in the array, 0 is the initial value

    //console.log("Average watering interval: ", avgInterval)

    // predict next watering date based on last watering event
    const lastWateringDate = relevantWaterings[0]
    const predictedNextWateringDate = new Date(lastWateringDate)
    predictedNextWateringDate.setDate(predictedNextWateringDate.getDate() + avgInterval)

    //console.log("Predicted next watering date: ", predictedNextWateringDate)

    return predictedNextWateringDate

}

export const calculateNextFertilizing = (careHistory) => {

    const fertilizingEvents = careHistory
        .filter(entry => entry.events.includes("fertilizing"))
        .map(entry => {
            const date = new Date(entry.date)
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()) // remove time part to avoid daylight saving time issues
        })
        .filter(date => {
            const month = date.getMonth() + 1; // JS months are 0-based so +1
            return month >= 3 && month <= 9; // only keep March-September fertilizations
        })
        .sort((a, b) => b - a); // Sort by date, newest first

    // at least two events are needed to calculate
    if (fertilizingEvents.length < 2) {
        //console.log("Need at least 2 fertilizing events to calculate estimate")
        return null
    }

    // use up to 5 most recent fertilizing events to avoid out-of-season statistics
    const relevantFertilizings = fertilizingEvents.slice(0, 5)
    //console.log("Relevant fertilizing events: ", relevantFertilizings)

    // calculate intervals between consecutive fertilizing events
    let intervals = []
    for (let i = 0; i < relevantFertilizings.length - 1; i++) {
        const prevDate = new Date(relevantFertilizings[i + 1])
        const nextDate = new Date(relevantFertilizings[i])

        // skip winter months when calculating intervals
        let intervalDays = 0
        while (prevDate < nextDate) {
            prevDate.setDate(prevDate.getDate() + 1)
            const month = prevDate.getMonth() + 1
            if (month >= 3 && month <= 9) { // only count March-September
                intervalDays++;
            }
        }
        intervals.push(intervalDays);
    }

    //onsole.log("Relevant fertilizing intervals: ", intervals)

    // calculate average interval
    const avgInterval = Math.round(intervals.reduce((sum, val) => sum + val, 0) / intervals.length)
    //console.log("Average fertilizing interval, excluding winter: ", avgInterval)

    // predict next fertilizing
    const lastFertilizingDate = new Date(relevantFertilizings[0])
    const predictedNextFertilizingDate = new Date(lastFertilizingDate)

    // add average interval but skip winter months
    let daysAdded = 0
    while (daysAdded < avgInterval) {
        predictedNextFertilizingDate.setDate(predictedNextFertilizingDate.getDate() + 1)
        const month = predictedNextFertilizingDate.getMonth() + 1
        if (month >= 3 && month <= 9) {
            daysAdded++
        }
    }

    //console.log("Predicted next fertilizing date:", predictedNextFertilizingDate.toLocaleString())

    return predictedNextFertilizingDate

}