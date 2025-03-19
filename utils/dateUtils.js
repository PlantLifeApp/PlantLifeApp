// format for ui display based on phone's language/region settings, 
// e.g. 12/31/2022 in USA but 31.12.2025 in Germany
export const formatDate = (date) => {
    return date.toLocaleDateString() 
}

export const calculateNextWatering = (careHistory) => {

    // first filter out all watering events
    const wateringEvents = careHistory
        .filter(entry => entry.events.includes("watering"))
        .map(entry => entry.date)
        .sort((a,b) => b-a) // sort by date, newest first

    console.log("All waterings:", wateringEvents)

    // at least two watering events are needed to calculate an estimate
    if (wateringEvents.length < 2) {
        console.log("Need at least 2 watering events to calculate estimate")
        return null
    }

    // use up to 5 most recent watering events to avoid out-of-season statistics
    const relevantWaterings = wateringEvents.slice(0,5)

    console.log("Relevant waterings: ", relevantWaterings)

    // calculate intervals between consecutive waterings
    let intervals = []
    for (let i = 0; i < relevantWaterings.length - 1; i++) {
        const interval = (relevantWaterings[i] - relevantWaterings[i + 1]) / (1000 * 60 * 60 * 24) // convert ms to days
        intervals.push(interval)
    }

    console.log("Relevant watering intervals: ", intervals)

    // calculate average interval
    const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length // the reduce method is used to sum up all values in the array, 0 is the initial value

    console.log("Average watering interval: ", avgInterval)

    // predict next watering date based on last watering event
    const lastWateringDate = relevantWaterings[0]
    const predictedNextWateringDate = new Date(lastWateringDate)
    predictedNextWateringDate.setDate(predictedNextWateringDate.getDate() + avgInterval)

    console.log("Predicted next watering date: ", predictedNextWateringDate)

    return predictedNextWateringDate

}