import React, { useContext } from "react"
import HomeScreen from "../screens/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { ThemeContext } from "../context/themeContext"
import { useTheme } from "react-native-paper"

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const { theme } = useContext(ThemeContext) // get the custom theme
    const paperTheme = useTheme() // get theme colors

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: paperTheme.colors.surface }, // set header background
                headerTintColor: paperTheme.colors.onSurface, // set header text color
                tabBarStyle: { backgroundColor: paperTheme.colors.surface }, // set tab bar background
                tabBarActiveTintColor: paperTheme.colors.primary, // active tab color
                tabBarInactiveTintColor: paperTheme.colors.onSurfaceVariant, // inactive tab color
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Options"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cog" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}