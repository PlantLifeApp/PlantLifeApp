import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Surface, Text, TextInput, Button } from "react-native-paper";
import { loginUser } from "../services/authService";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            await loginUser(email, password);
        } catch (error) {
            alert("Virhe: " + error.message);
        }
    };

    return (
        <Surface style={styles.container}>
            <Text style={styles.title}>Kirjaudu sisään</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Sähköposti" 
                onChangeText={setEmail} 
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput 
                style={styles.input} 
                placeholder="Salasana" 
                onChangeText={setPassword} 
                secureTextEntry
            />
            <Button title="Kirjaudu" onPress={handleLogin} />
            <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
                Ei tiliä? Rekisteröidy tästä.
            </Text>
        </Surface>
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

export default LoginScreen;
