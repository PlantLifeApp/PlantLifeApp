import React, { createContext, useState, useEffect, useContext } from "react"
import { onSnapshot, collection, getDocs, getDoc, doc } from "firebase/firestore"
import { AuthContext } from "./authContext"
import { fetchPlantData } from "../services/plantService"
import { db } from "../services/firebaseConfig"
import { calculateNextFertilizing, calculateNextWatering } from "../utils/dateUtils"

const PlantsContext = createContext()

export const PlantsProvider = ({ children }) => {
    const { user } = useContext(AuthContext)

    const [plants, setPlants] = useState([])
    const [plantDetails, setPlantDetails] = useState({})

    useEffect(() => {
        if (!user?.uid) return

        const plantsRef = collection(db, "users", user.uid, "plants")

        const unsubscribe = onSnapshot(plantsRef, async (querySnapshot) => {
            try {
                const plantDocs = querySnapshot.docs

                const plantPromises = plantDocs.map(async (doc) => {
                    const baseData = { ...doc.data(), id: doc.id }

                    const careHistoryRef = collection(db, "users", user.uid, "plants", doc.id, "careHistory")
                    const careHistorySnap = await getDocs(careHistoryRef)

                    const careHistory = careHistorySnap.docs.map(careDoc => ({
                        id: careDoc.id,
                        ...careDoc.data(),
                    }))

                    // convert to js dates + sort care entries to remove any that have invalid/null date
                    const careEntries = careHistory.map(entry => ({
                        ...entry,
                        date: entry.date?.toDate?.() ?? null,
                    })).filter(e => e.date)

                    careEntries.sort((a, b) => b.date - a.date)
                    // group by date bc that's what the util function expects
                    const groupedHistory = {}
                    careEntries.forEach(entry => {
                        const dateKey = entry.date.toISOString().split("T")[0]
                        if (!groupedHistory[dateKey]) {
                            groupedHistory[dateKey] = { date: entry.date, events: [] }
                        }
                        groupedHistory[dateKey].events.push(entry.type)
                    })

                    const sortedGroupedHistory = Object.values(groupedHistory)

                    // calculate predictions
                    const nextWatering = calculateNextWatering(sortedGroupedHistory)
                    const nextFertilizing = calculateNextFertilizing(sortedGroupedHistory)

                    return {
                        ...baseData,
                        careHistory,
                        nextWatering,
                        nextFertilizing,
                    }
                })

                const plantsWithCareHistory = await Promise.all(plantPromises)
                setPlants(plantsWithCareHistory)

            } catch (error) {
                console.error("Error fetching plant list with care history:", error)
            }
        })

        return () => unsubscribe()
    }, [user?.uid])

    // fetch full detail for a single plant, including grouped history + predictions
    // this is called manually after adding a new care event
    const loadPlantDetails = async (plantId, forceRefresh = false) => {
        if (!user?.uid || !plantId) return null

        // If we already have it and don't want to re-fetch
        if (!forceRefresh && plantDetails[plantId]) {
            return plantDetails[plantId]
        }

        try {
            const fullPlantData = await fetchPlantData(user.uid, plantId)

            setPlantDetails(prev => ({
                ...prev,
                [plantId]: fullPlantData
            }))

            return fullPlantData

        } catch (error) {
            console.error("Error loading plant details:", error)
            return null
        }
    }

    const refreshPlantInList = async (plantId) => {
        try {
            const plantDocRef = doc(db, "users", user.uid, "plants", plantId);
            const plantSnap = await getDoc(plantDocRef);

            const baseData = { ...plantSnap.data(), id: plantSnap.id }

            const careHistoryRef = collection(db, "users", user.uid, "plants", plantId, "careHistory")
            const careHistorySnap = await getDocs(careHistoryRef)

            const careHistory = careHistorySnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))

            const updatedPlant = { ...baseData, careHistory }

            setPlants(prev =>
                prev.map(p => p.id === plantId ? updatedPlant : p)
            )
        } catch (error) {
            console.error("Error refreshing plant in list:", error)
        }
    }

    return (
        <PlantsContext.Provider value={{
            plants,
            loadPlantDetails,
            refreshPlantInList,
            alivePlants: plants.filter(p => !p.isDead), // general falsy check
            deadPlants: plants.filter(p => p.isDead),   // only isDead=true
        }}>
            {children}
        </PlantsContext.Provider>
    )
}

export const usePlants = () => useContext(PlantsContext)