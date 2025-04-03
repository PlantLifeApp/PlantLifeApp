import React, { createContext, useState, useEffect, useContext } from "react"
import { onSnapshot, collection, getDocs, getDoc, doc } from "firebase/firestore"
import { AuthContext } from "./authContext"
import { fetchFullPlantData } from "../services/plantService"
import { db } from "../services/firebaseConfig"
import { calculateNextWatering, calculateNextFertilizing } from "../utils/dateUtils"

const PlantsContext = createContext()

export const PlantsProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [plants, setPlants] = useState([])
    const [plantDetails, setPlantDetails] = useState({})

    // initial snapshot + fetch on login/start
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

                    const careEntries = careHistory
                        .map(entry => ({
                            ...entry,
                            date: entry.date?.toDate?.() ?? null,
                        }))
                        .filter(e => e.date)
                        .sort((a, b) => b.date - a.date)

                    const groupedHistory = {}
                    careEntries.forEach(entry => {
                        const dateKey = entry.date.toISOString().split("T")[0]
                        if (!groupedHistory[dateKey]) {
                            groupedHistory[dateKey] = { date: entry.date, events: [] }
                        }
                        groupedHistory[dateKey].events.push(entry.type)
                    })

                    const sortedGroupedHistory = Object.values(groupedHistory)
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
                nextFertilizing: data.nextFertilizing,
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