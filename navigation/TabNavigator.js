import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "react-native-paper"
import { useTranslation } from "react-i18next"

import { PlantsProvider } from "../context/plantsContext"
import { ImagesProvider } from "../context/imageContext"

import {
  HomeStackNavigator,
  OptionsStackNavigator,
  GalleryStackNavigator,
  StatsStackNavigator,
} from "./StackNavigators"

const Tab = createBottomTabNavigator()

// Tab Navigator for the main app
// this navigator contains the Home, Gallery, Stats, and Options tabs
// each tab has its own stack navigator

export default function TabNavigator() {

  const paperTheme = useTheme()
  const { t } = useTranslation()

  return (
    <PlantsProvider>
      <ImagesProvider>

        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            headerStyle: { backgroundColor: paperTheme.colors.surface },
            headerTintColor: paperTheme.colors.onSurface,
            tabBarStyle: { backgroundColor: paperTheme.colors.surface },
            tabBarActiveTintColor: paperTheme.colors.primary,
            tabBarInactiveTintColor: paperTheme.colors.onSurfaceVariant,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStackNavigator}
            options={{
              title: t("tabs.home"),
              tabBarLabel: t("tabs.home"),
              tabBarIcon: ({ color, size }) => <Ionicons name="leaf-outline" color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="Gallery"
            component={GalleryStackNavigator}
            options={{
              title: t("tabs.gallery"),
              tabBarLabel: t("tabs.gallery"),
              tabBarIcon: ({ color, size }) => <Ionicons name="images-outline" color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="Stats"
            component={StatsStackNavigator}
            options={{
              title: t("tabs.stats"),
              tabBarLabel: t("tabs.stats"),
              tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="Options"
            component={OptionsStackNavigator}
            options={{
              title: t("tabs.options"),
              tabBarLabel: t("tabs.options"),
              tabBarIcon: ({ color, size }) => <Ionicons name="options-outline" color={color} size={size} />,
            }}
          />
        </Tab.Navigator>

      </ImagesProvider>
    </PlantsProvider>
  )
}