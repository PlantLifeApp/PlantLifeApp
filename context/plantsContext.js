import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFirestore, collection, getDocs, query, onSnapshot } from 'firebase/firestore';
import { AuthContext } from './authContext';

const db = getFirestore();

// Create the context
const PlantsContext = createContext();

// Create a provider component
export const PlantsProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const [plants, setPlants] = useState([]);

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const q = await query(collection(db, "users", user.uid, "plants"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const tempplants = [];
                    querySnapshot.forEach((doc) => {
                        //console.log("doc id is: " + doc.id)
                        tempplants.push({ ...doc.data(), id: doc.id });
                    });
                    setPlants(tempplants);
                    //console.log("All plants: " + plants);
                });
                return () => unsubscribe()
            } catch (error) {
                console.error("Error fetching plants:", error)
            };


        }
        fetchPlants();
    }, [])



    return (
        <PlantsContext.Provider value={{ plants }}>
            {children}
        </PlantsContext.Provider>
    );
};

// Custom hook to use the PlantsContext
export const usePlants = () => {
    return useContext(PlantsContext);
};