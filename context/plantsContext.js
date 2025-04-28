import React, { createContext, useState, useEffect, useContext } from "react"
import { onSnapshot, collection, getDocs, getDoc, doc } from "firebase/firestore"
import { AuthContext } from "./authContext"
import { fetchFullPlantData } from "../services/plantService"
import { db } from "../services/firebaseConfig"
import { calculateNextFertilizing, calculateNextWatering } from "../utils/dateUtils"

const PlantsContext = createContext()

// PlantsContext is used to provide the plant data to the app
// it fetches the plant data from the firestore database
// and provides functions to update the plant data

export const PlantsProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [plants, setPlants] = useState([])
    const [plantDetails, setPlantDetails] = useState({})

    // initial snapshot + fetch on login/start
    useEffect(() => {
        if (!user?.uid) return

        const plantsRef = collection(db, "users", user.uid, "plants")

        // listen to changes in the plants collection
        // this will update the plants state whenever there is a change in the collection
        // note that this will not listen to changes in subcollections
        const unsubscribe = onSnapshot(plantsRef, async (querySnapshot) => {
            try {
                const plantDocs = querySnapshot.docs

                const plantPromises = plantDocs.map(async (doc) => {
                    const baseData = { ...doc.data(), id: doc.id }

                    // fetch care history for each plant
                    const careHistoryRef = collection(db, "users", user.uid, "plants", doc.id, "careHistory")
                    const careHistorySnap = await getDocs(careHistoryRef)

                    const careHistory = careHistorySnap.docs.map(careDoc => ({
                        id: careDoc.id,
                        ...careDoc.data(),
                    })) // map care history to include id

                    // sort care history by date
                    // convert date to Date object if it's a timestamp
                    const careEntries = careHistory
                        .map(entry => ({
                            ...entry,
                            date: entry.date?.toDate?.() ?? null,
                        }))
                        .filter(e => e.date)
                        .sort((a, b) => b.date - a.date)

                    // group care history by date
                    // this is used to show the care history in a list
                    const groupedHistory = {}
                    careEntries.forEach(entry => {
                        const dateKey = entry.date.toISOString().split("T")[0]
                        if (!groupedHistory[dateKey]) {
                            groupedHistory[dateKey] = { date: entry.date, events: [] }
                        }
                        groupedHistory[dateKey].events.push(entry.type)
                    })

                    const sortedGroupedHistory = Object.values(groupedHistory)

                    // calculate next watering and fertilizing dates
                    const nextWatering = calculateNextWatering(sortedGroupedHistory)
                    const nextFertilizing = await calculateNextFertilizing(sortedGroupedHistory)

                    return {
                        ...baseData,
                        careHistory,
                        nextWatering,
                        nextFertilizing,
                    }
                })

                // wait for all plant promises to resolve
                // and set the plants state with the resolved data
                const plantsWithCareHistory = await Promise.all(plantPromises)
                setPlants(plantsWithCareHistory)

            } catch (error) {
                console.error("Error fetching plant list:", error)
            }
        })

        return () => unsubscribe()
    }, [user?.uid])

    // fetch and update both detail cache and list
    const updatePlantData = async (plantId, forceRefresh = false) => {
        if (!user?.uid || !plantId) return null

        if (!forceRefresh && plantDetails[plantId]) {
            return plantDetails[plantId]
        }

        try {
            const data = await fetchFullPlantData(user.uid, plantId)
            const updatedPlant = {
                ...data.plant,
                careHistory: data.ungroupedHistory.map(entry => ({
                    ...entry,
                    date: entry.date instanceof Date ? entry.date : entry.date.toDate?.() ?? null,
                })),
                nextWatering: data.nextWatering,
                nextFertilizing: await data.nextFertilizing,
            }

            // update full details cache
            setPlantDetails(prev => ({
                 ...prev,
                 [plantId]: data
            }))

            // update plant in main list
            setPlants(prev =>
                prev.map(p => p.id === plantId ? updatedPlant : p)
            )

            return data

        } catch (error) {
            console.error("Error updating plant data:", error)
            return null
        }
    }

    return (
        <PlantsContext.Provider value={{
            plants,
            updatePlantData,
            alivePlants: plants.filter(p => !p.isDead),
            deadPlants: plants.filter(p => p.isDead),
        }}>
            {children}
        </PlantsContext.Provider>
    )
}

export const usePlants = () => useContext(PlantsContext)