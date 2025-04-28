import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, Surface } from 'react-native-paper'
import { formatDate, formatRelativeDate } from '../../utils/dateUtils'
import { useTranslation } from "react-i18next"
import { View } from 'react-native'
import ItalicText from '../../utils/italicText'

const PlantDetails = ({ plant, careHistory, showRelativeTime = false }) => {

    const { t } = useTranslation()

    // care history is already sorted by date in descending order
    // so we can just take the first entry for each type of care
    const lastWatering = careHistory.find(entry => entry.events.includes("watering"))
    const lastFertilization = careHistory.find(entry => entry.events.includes("fertilizing"))
    const lastPruning = careHistory.find(entry => entry.events.includes("pruning"))
    const lastRepotting = careHistory.find(entry => entry.events.includes("repotting"))

    // check if the date is recent (within the last 7 days)
    // this is used to show the date in relative format
    const isRecent = (date) => {
        const now = new Date()
        const d = date instanceof Date ? date : new Date(date)
        return (now - d) < 7 * 24 * 60 * 60 * 1000
    }

    // format the date based on the showRelativeTime prop
    // if showRelativeTime is true and the date is recent, show the relative date
    const formatSmart = (date) => {
        return showRelativeTime && isRecent(date)
            ? formatRelativeDate(date, t)
            : formatDate(date)
    }

    // get the emoji for the plant type
    const getPlantEmoji = (plantType) => {
        switch (plantType) {
            case "succulent": return "🌵"
            case "cactus": return "🌵"
            case "general": return "🪴"
            case "utilitarian": return "🥗"
        }
    }

    return (
        <>

        <Surface style={styles.detailsContainer}>

            <Text variant="bodyLarge">
                {t("screens.plant.type")}: {t(`screens.plant.${plant.plantType}`)} {getPlantEmoji(plant.plantType)}
            </Text>

            <View style={{ height: 8 }} />

            {lastWatering ? (
                <Text variant="bodyMedium">
                    💧 {t("screens.plant.lastWatered")}: {formatSmart(lastWatering.date)}
                </Text>
                ) : (
                <ItalicText variant="bodyMedium">
                    💧 {t("screens.plant.neverWatered")}
                </ItalicText>
            )}
            {lastFertilization ? (
                <Text variant="bodyMedium">
                    💥 {t("screens.plant.lastFertilized")}: {formatSmart(lastFertilization.date)}
                </Text>
                ) : (
                <ItalicText variant="bodyMedium">
                    💥 {t("screens.plant.neverFertilized")}
                </ItalicText>
                )}

            {lastPruning ? (
                <Text variant="bodyMedium">
                    ✂️ {t("screens.plant.lastPruned")}: {formatSmart(lastPruning.date)}
                </Text>
                ) : (
                <ItalicText variant="bodyMedium">
                    ✂️ {t("screens.plant.neverPruned")}
                </ItalicText>
                )}

            {lastRepotting ? (
                <Text variant="bodyMedium">
                    🪴 {t("screens.plant.lastRepotted")}: {formatSmart(lastRepotting.date)}
                </Text>
                ) : (
                <ItalicText variant="bodyMedium">
                    🪴 {t("screens.plant.neverRepotted")}
                </ItalicText>
                )}
        
        </Surface>

</>
    )
}

const styles = StyleSheet.create({
    detailsContainer: {
        padding: 16,
        borderRadius: 8,
        width: '100%',
        marginBottom: 16,
    },

    touchableArea: {
        width: 40,
        height: 40, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoButton: {
        margin: 4,
        position: 'absolute',
        right: 0,
        top: 0,
    }
})

export default PlantDetails