import { db } from "./firebaseConfig";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, serverTimestamp,
     deleteDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage"
import { calculateNextWatering, calculateNextFertilizing } from "../utils/dateUtils"
import { compressImage } from "../utils/compressImage";

// ADD PLANT
export const addPlant = async (givenName, scientificName, plantType, userId) => {
    try {
        const db = getFirestore();
        const plantRef = doc(collection(db, "users", userId, "plants"))
        const plantData = {
            givenName,
            scientificName,
            plantType,
            coverImageUrl: null,
            images: []
        }
        await setDoc(plantRef, plantData)
        console.log("Plant added successfully with ID:", plantRef.id)
        return plantRef.id
    } catch (error) {
        console.error("Error adding plant:", error)
    }
}

// UPLOAD IMAGE
export const uploadPlantImage = async (userId, plantId, imageUri, setAsCover = false) => {
    try {
        const storage = getStorage();
        const db = getFirestore();
        const compressedUri = await compressImage(imageUri);
        if (!compressedUri) throw new Error("Compressed image URI is undefined.");
        const imageRef = ref(storage, `plants/${userId}/${plantId}/${Date.now()}.jpg`);
        const response = await fetch(compressedUri);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        const plantRef = doc(db, "users", userId, "plants", plantId);
        await updateDoc(plantRef, {
            images: arrayUnion(downloadURL),
            ...(setAsCover && { coverImageUrl: downloadURL })
        });
        console.log("Image uploaded successfully:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
    }
}

// FETCH IMAGES
export const getUserPlantImages = async (userId) => {
    try {
        const db = getFirestore();
        const plantsCollection = collection(db, "users", userId, "plants");
        const querySnapshot = await getDocs(plantsCollection);
        let fetchedImages = {};
        querySnapshot.forEach((doc) => {
            const plantData = doc.data();
            if (plantData.images) {
                fetchedImages[doc.id] = plantData.images;
            }
        });
        return fetchedImages;
    } catch (error) {
        console.error("Error fetching images from Firestore: ", error);
        return {};
    }
}

// FETCH FULL DATA FOR ONE PLANT
export const fetchFullPlantData = async (userId, plantId) => {
    try {
        const plantRef = doc(db, "users", userId, "plants", plantId)
        const plantSnap = await getDoc(plantRef)
        let plantData = null
        if (plantSnap.exists()) {
            plantData = { id: plantSnap.id, ...plantSnap.data() }
        } else {
            console.error("No such plant found!")
        }

        const careHistoryRef = collection(db, "users", userId, "plants", plantId, "careHistory")
        const careHistorySnap = await getDocs(careHistoryRef)

        const careEntries = careHistorySnap.docs.map(doc => {
            const rawDate = doc.data().date?.seconds * 1000
            return {
                id: doc.id,
                date: rawDate ? new Date(rawDate) : null,
                type: doc.data().type,
            }
        }).filter(e => e.date)

        careEntries.sort((a, b) => b.date - a.date)

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
            plant: plantData,
            careHistory: sortedGroupedHistory,
            ungroupedHistory: careEntries,
            nextWatering,
            nextFertilizing
        }

    } catch (error) {
        console.error("Error fetching plant or care history:", error)
        throw error
    }
}

// ADD CARE EVENT
export const addCareEvent = async (userId, plantId, eventType) => {
    if (!userId || !plantId || !eventType) {
        throw new Error("Missing required parameters (userId, plantId, eventType).")
    }
    try {
        const careHistoryRef = doc(collection(db, "users", userId, "plants", plantId, "careHistory"))
        const eventData = {
            type: eventType,
            date: serverTimestamp(),
        }
        await setDoc(careHistoryRef, eventData)
        console.log(`Added ${eventType} event for plant ${plantId}`)
        return true
    } catch (error) {
        console.error(`Error adding ${eventType} event:`, error)
        throw error
    }
}

// DELETE PLANT
export const deletePlant = async (userId, plantId) => {
    if (!userId || !plantId) {
        throw new Error("Missing required parameters (userId, plantId).")
    }

    try {
        const storage = getStorage()
        const plantFolderRef = ref(storage, `plants/${userId}/${plantId}`)
        console.log('Deleting files from: ', plantFolderRef.fullPath)

        const fileList = await listAll(plantFolderRef)
        const deletePromises = fileList.items.map(async (itemRef) => {
            try {
              await deleteObject(itemRef)
              console.log(`Deleted: ${itemRef.fullPath}`)
            } catch (err) {
              console.error(`Failed to delete ${itemRef.fullPath}:`, err)
            }
          })
        await Promise.all(deletePromises)

        console.log(`Deleted ${fileList.items.length} images from Storage`)

        // Reference to the plant document
        const plantRef = doc(db, "users", userId, "plants", plantId)
        await deleteDoc(plantRef)
        console.log(`Deleted plant ${plantId}`)
        return true
    } catch (error) {
        console.error(`Error deleting plant ${plantId}:`, error)
        throw error
    }
}

export const deleteAllPlants = async(userId) => {
    if (!userId ) {
        throw new Error("Missing required parameters (userId).")
    }
    try{
        const plantsCollectionRef = collection(db, "users", userId, "plants")
        const plantsSnapshot = await getDocs(plantsCollectionRef)

        const deletePromises = plantsSnapshot.docs.map(async (plantDoc) => {
            const plantId = plantDoc.id

            // poista "careHistory" jokaselle kasville
            const careHistoryCollectionRef = collection(db, "users", userId, "plants", plantId, "careHistory")
            const careHistorySnapshot = await getDocs(careHistoryCollectionRef)

            const careDeletePromises = careHistorySnapshot.docs.map((careDoc) =>
                deleteDoc(doc(db, "users", userId, "plants", plantId, "careHistory", careDoc.id))
            )
            await Promise.all(careDeletePromises)

            // poista kasvin dokumentti
            await deletePlant(userId, plantId) // poistaa myös firebase storage tiedostot
        })
        await Promise.all(deletePromises)

        console.log(`Plants of ${userId} has been deleted`)
        return true
    } catch(error) {
        console.error('Error deleting plants: ', error)
        throw error
    }
}

export const updatePlant = async (userId, plantId, updatedData) => {
    try {
        const plantRef = doc(db, "users", userId, "plants", plantId)
        await updateDoc(plantRef, updatedData)
        console.log(`Updated plant ${plantId}`)
        return true
    } catch (error) {
        console.error(`Error updating plant ${plantId}:`, error)
        throw error
    }
}

// DELETE CARE EVENT
export const deleteCareEvent = async (userId, plantId, eventId) => {
    try {
        const careEventRef = doc(db, "users", userId, "plants", plantId, "careHistory", eventId)
        await deleteDoc(careEventRef)
        console.log(`Deleted event ${eventId} for plant ${plantId}`)
        return true
    } catch (error) {
        console.error(`Error deleting event ${eventId} for plant ${plantId}:`, error)
        throw error
    }
}

// UPDATE EVENT DATE
export const updateCareEventDate = async (userId, plantId, careId, newDate) => {
    try {
        const careEventRef = doc(db, "users", userId, "plants", plantId, "careHistory", careId)
        await updateDoc(careEventRef, {
            date: Timestamp.fromDate(newDate),
        })
        console.log(`Updated date of event ${careId} for plant ${plantId}`)
        return true
    } catch (error) {
        console.error(`Error updating date for event ${careId} of plant ${plantId}:`, error)
        throw error
    }
}