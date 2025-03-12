import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../context/authContext";

export default function ProfileScreen() {
    const { user } = useContext(AuthContext)
    const auth = getAuth()

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>ProfileScreen / Asetukset?!</Text>
            <Text>Sähköposti: {user?.email}</Text>
            <Button title="Kirjaudu ulos" onPress={() => signOut(auth)} />
        </View>
    );
};