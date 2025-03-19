import React, { useState } from "react"
import { StyleSheet } from "react-native"
import { Surface, Text, TextInput, Button } from "react-native-paper"
import { registerUser } from "../services/authService"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next";

const RegisterScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    const navigation = useNavigation()
    const { t } = useTranslation()


    const handleRegister = async () => {
        try {
            await registerUser(email, password, username)
            alert("User created!")
        } catch (error) {
            alert("Error: " + error.message)
        }
    };

    return (
        <Surface style={styles.container}>
            <Text style={styles.title}>{t("screens.auth.registerHeader")}</Text>
            <TextInput style={styles.input} placeholder={t("screens.auth.username")} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder={t("screens.auth.email")} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder={t("screens.auth.password")} onChangeText={setPassword} secureTextEntry />
            <Button style={styles.mainButton} mode="contained" onPress={handleRegister}>{t("screens.auth.registerButton")}</Button>
            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
                {t("screens.auth.goToLogin")}
            </Text>
        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        alignItems: "center",
        padding: 20,
        height: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 32,
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
        marginTop: 32,
        marginBottom: 32
    }
});

export default RegisterScreen;
