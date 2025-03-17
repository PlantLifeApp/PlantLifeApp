import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

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

export {
    registerUser,
    loginUser
}