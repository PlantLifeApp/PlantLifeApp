import { db } from "./firebaseConfig";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/authContext"
import React, { useContext } from "react"

/**
 * Lisää uusi kasvi käyttäjän kasvilistaan Firestoressa.
 */
export const addPlant = async (givenName, scientificName, plantType, user) => {
    //console.log(user)
    //const { user } = useContext(AuthContext)
    try {
        const db = getFirestore();
        // Reference to the user's "plants" subcollection
        const plantRef = doc(collection(db, "users", user.uid, "plants"));

        // Define plant data
        const plantData = {
            givenName: givenName,
            scientificName: scientificName,
            plantType: plantType,
        };

        // Add plant data to Firestore
        await setDoc(plantRef, plantData);

        console.log("Plant added successfully with ID:", plantRef.id);
        return plantRef.id; // Return generated plant ID if needed
    } catch (error) {
        console.error("Error adding plant:", error);
    }
};

