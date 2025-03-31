import React from "react"
import { View, ScrollView, StyleSheet, Image } from "react-native"
import { Text, Surface } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { useTheme } from "react-native-paper"
import { formatDate } from "../utils/dateUtils"
import PlantDetails from "../components/plant/PlantDetails"
import CareHistory from "../components/plant/CareHistory"

export default function DeadPlantScreen({ route }) {
    
    const { plant } = route.params
    const { t } = useTranslation()
    const theme = useTheme()

    // normalize the care history to ensure dates are Date objects and events are arrays
    const normalizedCareHistory = plant.careHistory.map(entry => {
        const date = typeof entry.date?.toDate === "function"
            ? entry.date.toDate()
            : entry.date instanceof Date
            ? entry.date
            : null
        return {
            ...entry,
            date,
            events: Array.isArray(entry.events)
                ? entry.events
                : entry.type
                ? [entry.type]
                : [],
        }
    }).filter(entry => entry.date) // filter out anything without a valid date just in case

    // group care history by date
    const groupedByDate = {}
    normalizedCareHistory.forEach(entry => {
        const dateKey = entry.date.toISOString().split("T")[0]
        if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = { date: entry.date, events: [] }
        }
        groupedByDate[dateKey].events.push(...entry.events)
    })

    // convert grouped object to sorted array
    const groupedCareHistory = Object.values(groupedByDate).sort((a, b) => b.date - a.date)

    const killedAt = plant.killedAt?.toDate?.() ?? null

    return (
        <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Title */}
                <Surface style={styles.surface}>
                    <Text variant="headlineMedium">{plant.givenName}</Text>
                    <Text variant="bodyLarge" style={styles.italic}>
                        {plant.scientificName}
                    </Text>
                </Surface>

                <Surface style={styles.surface}>
                    <Image
                        style={styles.image}
                        source={{ uri: plant.coverImageUrl ?? null }}
                    />
                    <Text variant="bodyMedium" style={styles.killedText}>
                        ☠️ {t("screens.graveyard.killedOn")}:{" "}
                        {killedAt ? formatDate(killedAt) : t("screens.graveyard.unknownDeath")}
                    </Text>
                </Surface>

                <PlantDetails
                    plant={plant}
                    careHistory={groupedCareHistory}
                />
                <CareHistory careHistory={groupedCareHistory} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 16,
        alignItems: "center",
    },
    surface: {
        padding: 16,
        width: "100%",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: "#ddd",
    },
    italic: {
        fontStyle: "italic",
    },
    killedText: {
        marginTop: 8,
    },
})