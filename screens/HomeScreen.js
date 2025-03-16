import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { AuthContext } from "../context/authContext";
import FloatingButton from "../components/FloatingButton.js"

const HomeScreen = () => {
    const { user } = useContext(AuthContext) // Tämä ei ole vielä lopullinen tapa tuoda dataa käyttäjästä fronttiin. Vaatii selvitystä

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex:1, justifyContent: "center", alignItems: "center"}}>
                <Text>Tervetuloa sovellukseen {user?.email}!</Text>
            </View>
            <FloatingButton/>
        </View>
    );
};

export default HomeScreen;
