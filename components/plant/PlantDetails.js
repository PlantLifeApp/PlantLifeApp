import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, Surface } from 'react-native-paper'
import { formatDate } from '../../utils/dateUtils'
import { useTranslation } from "react-i18next"
import { View } from 'react-native'

const PlantDetails = ({ plant, careHistory, nextWatering, nextFertilizing }) => {

    console.log("nextWatering received in PlantDetails:", nextWatering);

    const { t } = useTranslation()

    const lastWatering = careHistory.find(entry => entry.events.includes("watering"))
    const lastFertilization = careHistory.find(entry => entry.events.includes("fertilizing"))
    const lastPruning = careHistory.find(entry => entry.events.includes("pruning"))

    const getPlantEmoji = (plantType) => {
        switch (plantType) {
            case "succulent": return "🌵"
            case "cactus": return "🌵"
            case "general": return "🪴"
            case "utilitarian": return "🥗"
        }
    }

    return (
        <Surface style={styles.detailsContainer}>
            <Text variant="bodyLarge">
                {t("screens.plant.type")}: {t(`screens.plant.${plant.plantType}`)} {getPlantEmoji(plant.plantType)}
            </Text>
            <View style={{ height: 8 }} />
            <Text variant="bodyMedium">
                💧 {t("screens.plant.lastWatered")}: {lastWatering ? formatDate(lastWatering.date) : t("screens.plant.noWaterings")}
            </Text>
            <Text variant="bodyMedium">
                💥 {t("screens.plant.lastFertilized")}: {lastFertilization ? formatDate(lastFertilization.date) : t("screens.plant.noFertilizations")}
            </Text>
            <Text variant="bodyMedium">
                ✂️ {t("screens.plant.lastPruned")}: {lastPruning ? formatDate(lastPruning.date) : t("screens.plant.noPrunings")}
            </Text>
            <View style={{ height: 8 }} />
            <Text variant="bodyLarge">{t("screens.plant.basedOnHistory")}</Text>
            <View style={{ height: 8 }} />
            <Text variant="bodyMedium">
                💧 {t("screens.plant.nextWateringEstimate")}:{" "}
            </Text>
            <Text variant="bodyLarge">{"     "}{nextWatering ? formatDate(nextWatering) : t("screens.plant.needMoreEvents")}</Text>
            <Text variant="bodyMedium">
                💥 {t("screens.plant.nextFertilizationEstimate")}:{" "}
            </Text>
            <Text variant="bodyLarge">{"     "}{nextFertilizing ? formatDate(nextFertilizing) : t("screens.plant.needMoreEvents")}</Text>
        </Surface>
    )
}

const styles = StyleSheet.create({
    detailsContainer: {
        padding: 16,
        borderRadius: 8,
        width: '100%',
        marginBottom: 8,
    },
})

export default PlantDetails