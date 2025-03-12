import React from "react";
import { View, Text, Button } from "react-native";
import { auth } from "../services/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        await signOut(auth);
        navigation.replace("Login"); // Palaa kirjautumisnäkymään
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Tervetuloa sovellukseen!</Text>
            <Button title="Kirjaudu ulos" onPress={handleLogout} />
        </View>
    );
};

export default HomeScreen;
