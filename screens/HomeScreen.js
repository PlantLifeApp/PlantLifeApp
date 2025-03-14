import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";
import { AuthContext } from "../context/authContext";

const HomeScreen = () => {
    const { user } = useContext(AuthContext);

    return (
        <Surface style={styles.container}>
            <Text variant="headlineLarge">Welcome to PlantLife, {user?.email}!</Text>
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
})

export default HomeScreen