import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthContext } from "../context/authContext";
import { ActivityIndicator, View } from "react-native";
import { Surface } from "react-native-paper"
import TabNavigator from "./TabNavigator";
import { useTranslation } from "react-i18next";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    const { user, loading } = useContext(AuthContext)
    const { t } = useTranslation()

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
                    <Stack.Screen name="Main" component={TabNavigator} options={{headerShown: false}}/>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{title: t("screens.auth.loginTitle")}} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{title: t("screens.auth.registerTitle")}} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AuthNavigator;
