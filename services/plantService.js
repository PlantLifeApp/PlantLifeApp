import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Lisää uusi kasvi käyttäjän kasvilistaan Firestoressa.
 */
export const addPlant = async (userId, plantName, wateringInterval) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            plants: arrayUnion({
                id: Date.now().toString(),
                name: plantName,
                wateringInterval: wateringInterval,
                lastWatered: null
            })
        });
    } catch (error) {
        console.error("Kasvin lisääminen epäonnistui:", error.message);
        throw error;
    }
};
