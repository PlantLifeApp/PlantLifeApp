import React, { useContext } from "react"
import HomeScreen from "../screens/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { ThemeContext } from "../context/themeContext"
import { useTheme } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { PlantsProvider } from "../context/plantsContext"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import PlantScreen from "../screens/PlantScreen"
import GalleryScreen from "../screens/GalleryScreen"
import EditPlant from "../screens/EditPlant"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator()


const HomeStackNavigator = () => {
    const paperTheme = useTheme(); // Get theme colors
    const {t} = useTranslation()
    
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: paperTheme.colors.surface }, // set header background
                headerTintColor: paperTheme.colors.onSurface, // set header text color
            }}
        >
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: t("tabs.home") }} />
            <Stack.Screen name="PlantScreen" component={PlantScreen} options={{ title: t("screens.plant.title") }} />
            <Stack.Screen name="EditPlant" component={EditPlant} options={{ title: t("screens.editPlant.title") }} />
        </Stack.Navigator>
    );
};

export default function TabNavigator() {
    //const { theme } = useContext(ThemeContext) // get the custom theme
    const paperTheme = useTheme() // get theme colors
    const { t } = useTranslation() // Localization usage

    return (
        <PlantsProvider>
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
                    component={HomeStackNavigator}
                    options={{
                        title: t("tabs.home"),
                        tabBarLabel: t("tabs.home"),
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" color={color} size={size} />
                        ),
                    headerShown: false // this hides extra header
                    }}
                />
                   <Tab.Screen
                    name="Gallery"
                    component={GalleryScreen}
                    options={{
                        title: t("tabs.gallery"),
                        tabBarLabel: t("tabs.gallery"),
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="image-outline" color={color} size={size} />
                        ),
                    }}
                />

                <Tab.Screen
                    name="Options"
                    component={ProfileScreen}
                    options={{
                        title: t("tabs.options"),
                        tabBarLabel: t("tabs.options"),
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="cog" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </PlantsProvider>
    );
}