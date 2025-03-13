import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthContext } from "../context/authContext";
import { ActivityIndicator, View } from "react-native";
import { Surface } from "react-native-paper"
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    const { user, loading } = useContext(AuthContext)

    if (loading) {
        return (
            <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                <ActivityIndicator size="large" color="#0000ff" />
            </Surface>
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator options={{ headerShown: false }} >
                {user ? (
                    // Jos käyttäjä on kirjautunut, näytetään vain HomeScreen
                    <Stack.Screen name="Main" component={TabNavigator} options={{headerShown: false}}/>
                ) : (
                    // Muuten näytetään kirjautumisnäkymät
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AuthNavigator;
