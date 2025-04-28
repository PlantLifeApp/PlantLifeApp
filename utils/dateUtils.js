import AsyncStorage from "@react-native-async-storage/async-storage"

// format for ui display based on phone's language/region settings, 
// e.g. 12/31/2022 in USA but 31.12.2025 in Germany
export const formatDate = (date) => {
    if (!date) return ""
    const d = date instanceof Date ? date : new Date(date)
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString()
}

// format for relative time display, e.g. "in 2 days" or "yesterday"
// this is used in the PlantScreen to show the next watering and fertilizing dates
export const formatRelativeDate = (date, t) => {
    if (!date || typeof t !== "function") return ""

    const now = new Date()
    const target = date instanceof Date ? date : new Date(date)

    const diffInMs = target - now
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return t("relativeTime.today")
    if (diffInDays === -1) return t("relativeTime.yesterday")
    if (diffInDays === 1) return t("relativeTime.tomorrow")
    if (diffInDays < 0) return t("relativeTime.daysAgo", { count: Math.abs(diffInDays) })
    return t("relativeTime.inDays", { count: diffInDays })
}

// calculate next watering date based on care history
export const calculateNextWatering = (careHistory) => {

    // first filter out all watering events
    const wateringEvents = careHistory
        .filter(entry => entry.events.includes("watering"))
        .map(entry => entry.date)
        .sort((a, b) => b - a) // sort by date, newest first

    // at least two watering events are needed to calculate an estimate
    if (wateringEvents.length < 2) {
        //console.log("Need at least 2 watering events to calculate estimate")
        return null
    }

    // use up to 5 most recent watering events to avoid out-of-season statistics
    const relevantWaterings = wateringEvents.slice(0, 5)

    // calculate intervals between consecutive waterings
    let intervals = []
    for (let i = 0; i < relevantWaterings.length - 1; i++) {
        // convert ms to days
        const interval = (relevantWaterings[i] - relevantWaterings[i + 1]) / (1000 * 60 * 60 * 24)
        intervals.push(interval)
    }

    // calculate average interval
    const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length
    // the reduce method is used to sum up all values in the array, 0 is the initial value

    // predict next watering date based on last watering event
    const lastWateringDate = relevantWaterings[0]
    const predictedNextWateringDate = new Date(lastWateringDate)
    predictedNextWateringDate.setDate(predictedNextWateringDate.getDate() + avgInterval)

    return predictedNextWateringDate

}

// AsyncStorage key for winter months
const WINTER_MONTHS_KEY = 'winterMonths'

// get winter months from AsyncStorage
export const getWinterMonths = async () => {
    try {
        const value = await AsyncStorage.getItem(WINTER_MONTHS_KEY)
        //console.log("Winter months value from Async Storage:", value)
        return value ? JSON.parse(value) : { start: 11, end: 3 } // default nov through march
    } catch (e) {
        return {
            start: 11, end: 3
        }
    }
}

// set winter months in AsyncStorage
export const setWinterMonths = async (start, end) => {
    const value = JSON.stringify({ start, end })
    await AsyncStorage.setItem(WINTER_MONTHS_KEY, value)
}

// check if month is in winter months, take into account new year
const isWinterMonth = (month, winterStart, winterEnd) => {
    if (winterStart <= winterEnd) {
        return month >= winterStart && month <= winterEnd
    }
    else {
        return month >= winterStart || month <= winterEnd
    }
}

// calculate next fertilizing date based on care history
export const calculateNextFertilizing = async (careHistory) => {

    // find user's winter months
    const { start: winterStart, end: winterEnd } = await getWinterMonths()

    // first filter out all fertilizing events from care history
    const fertilizingEvents = careHistory
        .filter(entry => entry.events.includes("fertilizing"))
        .map(entry => {
            const date = new Date(entry.date)
            return new Date(date.getFullYear(), date.getMonth(), date.getDate()) // strip time
        })
        .filter(date => {
            const month = date.getMonth() + 1 // JS: 0 = Jan, 11 = Dec
            return !isWinterMonth(month, winterStart, winterEnd)
        })
        .sort((a, b) => b - a)

    // at least 2 fertilizing events are needed to calculate an estimate
    // use only the 5 most recent fertilizing events to avoid out-of-season statistics
    if (fertilizingEvents.length < 2) return null
    const relevantFertilizings = fertilizingEvents.slice(0, 5)

    // calculate intervals between consecutive fertilizing events
    let intervals = []
    for (let i = 0; i < relevantFertilizings.length - 1; i++) {
        const prevDate = new Date(relevantFertilizings[i + 1])
        const nextDate = new Date(relevantFertilizings[i])

        let intervalDays = 0
        while (prevDate < nextDate) {
            prevDate.setDate(prevDate.getDate() + 1)
            const month = prevDate.getMonth() + 1
            if (!isWinterMonth(month, winterStart, winterEnd)) {
                intervalDays++
            }
        }
        intervals.push(intervalDays)
    }

    const avgInterval = Math.round(intervals.reduce((sum, val) => sum + val, 0) / intervals.length)
    const lastFertilizingDate = new Date(relevantFertilizings[0])
    const predictedNextFertilizingDate = new Date(lastFertilizingDate)

    // add the average interval to the last fertilizing date
    let daysAdded = 0
    while (daysAdded < avgInterval) {
        predictedNextFertilizingDate.setDate(predictedNextFertilizingDate.getDate() + 1)
        const month = predictedNextFertilizingDate.getMonth() + 1
        if (!isWinterMonth(month, winterStart, winterEnd)) {
            daysAdded++
        }
    }

    return predictedNextFertilizingDate

}

export const getPreviousMonth = ({ date, setCurrentDate }) => {
    updateDate({ date, setCurrentDate, type: 'month', offset: -1 })
}

export const getNextMonth = ({ date, setCurrentDate }) => {
    updateDate({ date, setCurrentDate, type: 'month', offset: 1 })
}

export const getPreviousYear = ({ date, setCurrentDate }) => {
    updateDate({ date, setCurrentDate, type: 'year', offset: -1 })
}

export const getNextYear = ({ date, setCurrentDate }) => {
    updateDate({ date, setCurrentDate, type: 'year', offset: 1 })
}

// Shared helper
const updateDate = ({ date, setCurrentDate, type, offset }) => {
    const newDate = new Date(date)
    if (type === 'month') newDate.setMonth(date.getMonth() + offset)
    if (type === 'year') newDate.setFullYear(date.getFullYear() + offset)
    setCurrentDate(newDate)
}