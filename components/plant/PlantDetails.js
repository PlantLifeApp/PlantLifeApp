import React, {useState} from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Surface, IconButton } from 'react-native-paper'
import { formatDate } from '../../utils/dateUtils'
import { useTranslation } from "react-i18next"
import { View } from 'react-native'
import ItalicText from '../../utils/italicText'

const PlantDetails = ({ plant, careHistory }) => {

    //console.log("nextWatering received in PlantDetails:", nextWatering);
    //console.log("Care history receivedin PlantDetails:", careHistory);

    const { t } = useTranslation()

    const lastWatering = careHistory.find(entry => entry.events.includes("watering"))
    const lastFertilization = careHistory.find(entry => entry.events.includes("fertilizing"))
    const lastPruning = careHistory.find(entry => entry.events.includes("pruning"))
    const lastRepotting = careHistory.find(entry => entry.events.includes("repotting"))

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
                    💧 {t("screens.plant.lastWatered")}: {formatDate(lastWatering.date)}
                </Text>
                ) : (
                <ItalicText variant="bodyMedium">
                    💧 {t("screens.plant.neverWatered")}
                </ItalicText>
            )}
            {lastFertilization ? (
                <Text variant="bodyMedium">
                    💥 {t("screens.plant.lastFertilized")}: {formatDate(lastFertilization.date)}
                </Text>
                ) : (
                <ItalicText variant="bodyMedium">
                    💥 {t("screens.plant.neverFertilized")}
                </ItalicText>
                )}

            {lastPruning ? (
                <Text variant="bodyMedium">
                    ✂️ {t("screens.plant.lastPruned")}: {formatDate(lastPruning.date)}
                </Text>
                ) : (
                <ItalicText variant="bodyMedium">
                    ✂️ {t("screens.plant.neverPruned")}
                </ItalicText>
                )}

            {lastRepotting ? (
                <Text variant="bodyMedium">
                    🪴 {t("screens.plant.lastRepotted")}: {formatDate(lastRepotting.date)}
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