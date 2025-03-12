import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen"; 
import { AuthContext } from "../context/authContext";
import { ActivityIndicator, View } from "react-native";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    const { user, loading } = useContext(AuthContext)

    if (loading) {
        return (
            <View style={{ flex:1, justifyContent: "center", alignItems: "center" }} >
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    // Jos käyttäjä on kirjautunut, näytetään vain HomeScreen
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                ) : (
                    // Muuten näytetään kirjautumisnäkymät
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AuthNavigator;
