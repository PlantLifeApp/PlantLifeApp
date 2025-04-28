import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTheme } from "react-native-paper"
import { useTranslation } from "react-i18next"

// Screens
import HomeScreen from "../screens/HomeScreen"
import PlantScreen from "../screens/PlantScreen"
import EditPlantScreen from "../screens/EditPlantScreen"
import EditCareHistory from "../screens/EditCareHistoryScreen"
import ProfileScreen from "../screens/ProfileScreen"
import GraveyardScreen from "../screens/GraveyardScreen"
import DeadPlantScreen from "../screens/DeadPlantScreen"
import GalleryScreen from "../screens/GalleryScreen"
import StatsScreen from "../screens/StatsScreen"

const Stack = createNativeStackNavigator()

// Stack Navigator for the Home tab
// this stack contains the HomeScreen, PlantScreen, EditPlantScreen, and EditCareHistoryScreen
export const HomeStackNavigator = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ title: t("tabs.home") }} 
      />
      <Stack.Screen 
        name="PlantScreen" 
        component={PlantScreen} 
        options={{ title: t("screens.plant.title") }} />
      <Stack.Screen
        name="EditPlant"
        component={EditPlantScreen}
        options={{
          title: t("screens.editPlant.title"),
          headerBackTitle: t("screens.plant.title"),
        }}
      />
      <Stack.Screen
        name="EditCareHistory"
        component={EditCareHistory}
        options={{
          title: t("screens.editCareHistory.title"),
          headerBackTitle: t("screens.plant.title"),
        }}
      />
    </Stack.Navigator>
  )
}

// Stack Navigator for the Options tab
// This stack navigator contains the ProfileScreen, GraveyardScreen, and DeadPlantScreen
export const OptionsStackNavigator = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ title: t("tabs.options") }} />
      <Stack.Screen 
        name="GraveyardScreen" 
        component={GraveyardScreen} 
        options={{ title: t("screens.graveyard.title") }} />
      <Stack.Screen
        name="DeadPlantScreen"
        component={DeadPlantScreen}
        options={{
          title: t("screens.graveyard.rip"),
          headerBackTitle: t("screens.graveyard.title"),
        }}
      />
    </Stack.Navigator>
  )
}

// Stack Navigator for the Gallery tab
// This stack navigator contains only the GalleryScreen
export const GalleryStackNavigator = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Stack.Screen 
        name="GalleryScreen" 
        component={GalleryScreen} 
        options={{ title: t("tabs.gallery") }} />
    </Stack.Navigator>
  )
}

// Stack Navigator for the Stats tab
// This stack contains only the StatsScreen
export const StatsStackNavigator = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
      }}
    >
      <Stack.Screen 
        name="StatsScreen" 
        component={StatsScreen} 
        options={{ title: t("tabs.stats") }} />
    </Stack.Navigator>
  )
}