import { db } from "./firebaseConfig";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, serverTimestamp, deleteDoc, updateDoc } from "firebase/firestore"
import { calculateNextWatering, calculateNextFertilizing } from "../utils/dateUtils"

export const addPlant = async (givenName, scientificName, plantType, user) => {

    //console.log(user)
    //const { user } = useContext(AuthContext)

    try {

        const db = getFirestore();

        // Reference to the user's "plants" subcollection
        const plantRef = doc(collection(db, "users", user.uid, "plants"))

        // Define plant data
        const plantData = {
            givenName: givenName,
            scientificName: scientificName,
            plantType: plantType,
        }

        // Add plant data to Firestore
        await setDoc(plantRef, plantData)

        console.log("Plant added successfully with ID:", plantRef.id)
        return plantRef.id // Return generated plant ID if needed

    } catch (error) {
        console.error("Error adding plant:", error)
    }
}

export const fetchPlantData = async (userId, plantId) => {

    try {

        // fetch plant document
        const plantRef = doc(db, "users", userId, "plants", plantId)
        const plantSnap = await getDoc(plantRef)
        let plantData = null // let = can be reassigned

        if (plantSnap.exists()) {
            plantData = { id: plantSnap.id, ...plantSnap.data() }
        } else {
            console.error("No such plant found!")
        }

        // fetch care history subcollection
        const careHistoryRef = collection(db, "users", userId, "plants", plantId, "careHistory")
        const careHistorySnap = await getDocs(careHistoryRef)

        const careEntries = careHistorySnap.docs.map(doc => {
            const rawDate = doc.data().date.seconds * 1000 // convert Firestore timestamp to milliseconds
            return {
                id: doc.id,
                date: new Date(rawDate), // keep as Date object for formatting later
                type: doc.data().type,
            }
        })

        // sort by date (newest first)
        careEntries.sort((a, b) => b.date - a.date)

        // group events by date
        const groupedHistory = {}
        careEntries.forEach(entry => {
            const dateKey = entry.date.toISOString().split("T")[0] // "YYYY-MM-DD"

            if (!groupedHistory[dateKey]) {
                groupedHistory[dateKey] = { date: entry.date, events: [] }
            }
            groupedHistory[dateKey].events.push(entry.type)
        })

        const sortedGroupedHistory = Object.values(groupedHistory)

        // calculate next predicted watering date
        const nextWatering = calculateNextWatering(sortedGroupedHistory)
        // calculate next predicted fertilizing date
        const nextFertilizing = calculateNextFertilizing(sortedGroupedHistory)

        return { plant: plantData, careHistory: sortedGroupedHistory, nextWatering: nextWatering, nextFertilizing: nextFertilizing }
        
    } catch (error) {
        console.error("Error fetching plant or care history:", error)
        throw error
    }
}

export const addCareEvent = async (userId, plantId, eventType) => {
    if (!userId || !plantId || !eventType) {
        throw new Error("Missing required parameters (userId, plantId, eventType).")
    }

    try {
        // Reference to the "careHistory" subcollection
        const careHistoryRef = doc(collection(db, "users", userId, "plants", plantId, "careHistory"))

        // Create care event data
        const eventData = {
            type: eventType,
            date: serverTimestamp(), // Firestore server timestamp
        }

        // Save the care event
        await setDoc(careHistoryRef, eventData)

        console.log(`Added ${eventType} event for plant ${plantId}`)
        return true // Return success flag

    } catch (error) {
        console.error(`Error adding ${eventType} event:`, error)
        throw error
    }
}

export const deletePlant = async(userId, plantId) => {
    if (!userId || !plantId) {
        throw new Error("Missing required parameters (userId, plantId).")
    }

    try {
        // Reference to the plant document
        const plantRef = doc(db, "users", userId, "plants", plantId)

        // Delete the plant
        await deleteDoc(plantRef)

        console.log(`Deleted plant ${plantId}`)
        return true // Return success flag

    } catch (error) {
        console.error(`Error deleting plant ${plantId}:`, error)
        throw error
    }
}

export const updatePlant = async (userId, plantId, updatedData) => {

    try {

        const plantRef = doc(db, "users", userId, "plants", plantId)
        await updateDoc(plantRef, updatedData)

        console.log(`Updated plant ${plantId}`)
        return true // Return success flag

    } catch (error) {
        console.error(`Error updating plant ${plantId}:`, error)
        throw error
    }
}