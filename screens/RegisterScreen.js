import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { registerUser } from "../services/authService";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const navigation = useNavigation();


    const handleRegister = async () => {
        try {
            await registerUser(email, password, username);
            alert("Käyttäjä rekisteröity!");
            navigation.replace("Login")
        } catch (error) {
            alert("Virhe: " + error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rekisteröidy</Text>
            <TextInput style={styles.input} placeholder="Käyttäjänimi" onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Sähköposti" onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Salasana" onChangeText={setPassword} secureTextEntry />
            <Button title="Rekisteröidy" onPress={handleRegister} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    link: {
        marginTop: 10,
        color: "blue",
        textDecorationLine: "underline",
    },
});

export default RegisterScreen;
