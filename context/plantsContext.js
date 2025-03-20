import React, { createContext, useState, useEffect, useContext } from "react"
import { onSnapshot, collection } from "firebase/firestore"
import { AuthContext } from "./authContext"
import { fetchPlantData } from "../services/plantService"
import { db } from "../services/firebaseConfig"

// Create the context
const PlantsContext = createContext()

// Create a provider component
export const PlantsProvider = ({ children }) => {
    const { user } = useContext(AuthContext)
    const [plants, setPlants] = useState([])
    const [plantDetails, setPlantDetails] = useState({}) // Store detailed data per plant

    useEffect(() => {
        if (!user) return

        const q = collection(db, "users", user.uid, "plants")
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempPlants = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
            setPlants(tempPlants)
        })

        return () => unsubscribe()
    }, [user])

    // function to fetch and cache individual plant details, to avoid unnecessary re-fetching
    const loadPlantDetails = async (plantId, forceRefresh = false) => {

        if (!user) return
    
        try {
            const plantData = await fetchPlantData(user.uid, plantId)
    
            // Force UI update by ensuring state always changes
            setPlantDetails(prevDetails => ({
                ...prevDetails,
                [plantId]: plantData // Update with fresh data
            }))
    
            return plantData
        } catch (error) {
            console.error("Error loading plant details:", error)
            return null
        }
    }

    return (
        <PlantsContext.Provider value={{ plants, loadPlantDetails }}>
            {children}
        </PlantsContext.Provider>
    )
}

// Custom hook to use the PlantsContext
export const usePlants = () => {
    return useContext(PlantsContext)
}