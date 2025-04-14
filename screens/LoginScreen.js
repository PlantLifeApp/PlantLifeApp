import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Surface, Text, TextInput, Button } from "react-native-paper";
import { loginUser } from "../services/authService";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();
    const { t } = useTranslation()

    const handleLogin = async () => {
        try {
            await loginUser(email, password);
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    return (
        <Surface style={styles.container}>
            
            <TextInput 
                style={styles.input} 
                placeholder={t("screens.auth.email")} 
                onChangeText={setEmail} 
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType='done'
            />
            <TextInput 
                style={styles.input} 
                placeholder={t("screens.auth.password")} 
                onChangeText={setPassword} 
                secureTextEntry
                returnKeyType='done'
            />
            <Button style={styles.mainButton} mode="contained" onPress={handleLogin}>{t("screens.auth.loginButton")}</Button>
            <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
                {t("screens.auth.goToRegister")}
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
        textDecorationLine: "underline",
    },

    mainButton: {
        alignSelf: "stretch",
        marginTop: 20,
        marginBottom: 20
    }
})

export default LoginScreen;
