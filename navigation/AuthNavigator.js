import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AuthContext } from "../context/authContext";
import { ActivityIndicator, Platform, View } from "react-native";
import { Surface } from "react-native-paper"
import TabNavigator from "./TabNavigator";
import { useTranslation } from "react-i18next";
import PlantScreen from "../screens/PlantScreen";
import { useTheme } from "react-native-paper";
import * as NavigationBar from "expo-navigation-bar"

const Stack = createNativeStackNavigator();


const AuthNavigator = () => {
    const { user, loading } = useContext(AuthContext)
    const { t } = useTranslation()
    const theme = useTheme()

        useEffect(() => {
            if (Platform.OS === 'android') {
                NavigationBar.setBackgroundColorAsync(theme.colors.primaryContainer)
                NavigationBar.setButtonStyleAsync(theme.dark ? 'light' : 'dark')
            }
        }, [theme])

        const navigationTheme = {
            ...NavigationDefaultTheme,
            colors: {
                ...NavigationDefaultTheme.colors, 
                background: theme.colors.background,
                card: theme.colors.surface,
            },
        };
    
    if (loading) {
        return (
            <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }} >
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </Surface>
        )
    }

    return (
        <NavigationContainer theme={navigationTheme}>
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
