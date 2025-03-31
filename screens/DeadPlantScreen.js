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

    let killedAt = null
    if (plant.killedAt && typeof plant.killedAt.toDate === "function") {
        killedAt = plant.killedAt.toDate()
    }

    const imageUrl = plant.coverImageUrl ?? null

    return (
        <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Surface style={styles.surface}>
                    <Text variant="headlineMedium">{plant.givenName}</Text>
                    <Text variant="bodyLarge" style={styles.italic}>
                        {plant.scientificName}
                    </Text>
                </Surface>

                <Surface style={styles.surface}>
                <Image style={styles.image} source={{ uri: imageUrl }} />

                <Text variant="bodyMedium" style={styles.killedText}>
                    ☠️ {t("screens.graveyard.killedOn")}: {killedAt ? formatDate(killedAt) : t("screens.graveyard.unknownDeath")}
                </Text>
                </Surface>

                <PlantDetails
                    plant={plant}
                    careHistory={plant.careHistory}
                    nextWatering={null}
                    nextFertilizing={null}
                />

                <CareHistory careHistory={plant.careHistory} />
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
        aspectRatio: 1, // maintains square shape
        borderRadius: 8,
        marginBottom: 16,
    },
    italic: {
        fontStyle: "italic",
    },

})