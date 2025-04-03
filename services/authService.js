import { createUserWithEmailAndPassword, signInWithEmailAndPassword,
     deleteUser, EmailAuthProvider,
      reauthenticateWithCredential } from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { deleteAllPlants } from "./plantService";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Luo uusi käyttäjä Firebase Authenticationiin ja tallentaa käyttäjän tiedot Firestoreen.
 */
const registerUser = async (email, password, username) => {
    try {
        // Luo käyttäjä Firebase Authenticationiin
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, "users", user.uid)

        // Luo käyttäjän tiedot Firestoreen
        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date().toISOString(),
        });


        return user;
    } catch (error) {
        console.error("Rekisteröinti epäonnistui:", error.message);
        throw error;
    }
};

/**
 * Kirjaa käyttäjän sisään Firebase Authenticationilla.
 */
const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Kirjautuminen epäonnistui:", error.message);
        throw error;
    }
};

const deleteAccount = async (password) => {
    try {
        const user = auth.currentUser
        const userCredential = EmailAuthProvider.credential(user.email, password)

        await reauthenticateWithCredential(user, userCredential) // needs pw
        const userRef = doc(db, 'users',user.uid)  // firestore db
        await deleteDoc(userRef) // firestore db
        await deleteAllPlants(user.uid) // plantservice.js
        await deleteUser(user) //firebase Auth
        await AsyncStorage.clear() // token delete from async
        return 
    } catch (error) {
        console.error('Error ocurred: ', error)
        throw error
    }
}

export {
    registerUser,
    loginUser,
    deleteAccount
}