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
            
            <TextInput 
                style={styles.input} 
                placeholder="Email address" 
                onChangeText={setEmail} 
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                onChangeText={setPassword} 
                secureTextEntry
            />
            <Button style={styles.mainButton} mode="contained" onPress={handleLogin}>Log In</Button>
            <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
                No account yet? Register here.
            </Text>
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        height: "100%",
        paddingTop: 100,
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

    mainButton: {
        alignSelf: "stretch",
        marginTop: 20,
        marginBottom: 20
    }
})

export default LoginScreen;
