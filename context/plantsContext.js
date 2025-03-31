import React, { createContext, useState, useEffect, useContext } from "react"
import { onSnapshot, collection, getDocs, getDoc, doc } from "firebase/firestore"
import { AuthContext } from "./authContext"
import { fetchPlantData } from "../services/plantService"
import { db } from "../services/firebaseConfig"

const PlantsContext = createContext()

export const PlantsProvider = ({ children }) => {
    const { user } = useContext(AuthContext)

    const [plants, setPlants] = useState([])
    const [plantDetails, setPlantDetails] = useState({}) 


    // this full fetch is only done automatically once on app start (or user login)
    useEffect(() => {
        if (!user?.uid) return

        const plantsRef = collection(db, "users", user.uid, "plants")

        const unsubscribe = onSnapshot(plantsRef, async (querySnapshot) => {
            try {
                const plantDocs = querySnapshot.docs

                // Fetch careHistory for all plants in parallel

                const plantPromises = plantDocs.map(async (doc) => {
                    const baseData = { ...doc.data(), id: doc.id }

                    const careHistoryRef = collection(db, "users", user.uid, "plants", doc.id, "careHistory")
                    const careHistorySnap = await getDocs(careHistoryRef)

                    const careHistory = careHistorySnap.docs.map(careDoc => ({
                        id: careDoc.id,
                        ...careDoc.data(),
                    }))

                    return {
                        ...baseData,
                        careHistory,
                    }
                })

                const plantsWithCareHistory = await Promise.all(plantPromises) // wait for all promises to resolve
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