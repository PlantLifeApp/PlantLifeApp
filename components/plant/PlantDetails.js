import React, {useState} from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Surface, IconButton } from 'react-native-paper'
import { formatDate } from '../../utils/dateUtils'
import { useTranslation } from "react-i18next"
import { View } from 'react-native'
import PlantInfoModal from './PlantInfoModal'

const PlantDetails = ({ plant, careHistory, nextWatering, nextFertilizing }) => {

    console.log("nextWatering received in PlantDetails:", nextWatering);

    const { t } = useTranslation()
    const [infoVisible, setInfoVisible] = useState(false)

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

            <Text variant="bodyMedium">
                💧 {t("screens.plant.lastWatered")}: {lastWatering ? formatDate(lastWatering.date) : t("screens.plant.neverWatered")}
            </Text>
            <Text variant="bodyMedium">
                💥 {t("screens.plant.lastFertilized")}: {lastFertilization ? formatDate(lastFertilization.date) : t("screens.plant.neverFertilized")}
            </Text>
            <Text variant="bodyMedium">
                ✂️ {t("screens.plant.lastPruned")}: {lastPruning ? formatDate(lastPruning.date) : t("screens.plant.neverPruned")}
            </Text>
            <Text variant="bodyMedium">
                🪴 {t("screens.plant.lastRepotted")}: {lastRepotting ? formatDate(lastRepotting.date) : t("screens.plant.neverRepotted")}            </Text>
        
        </Surface>

        <Surface style={styles.detailsContainer}>

        <TouchableOpacity 
                onPress={() => setInfoVisible(true)} 
                style={styles.infoButton}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // expands invisible touchable area
            >
                <IconButton 
                    icon="information-outline" 
                    size={20}  
                />
            </TouchableOpacity>

            <Text variant="bodyMedium">{t("screens.plant.basedOnHistory")}</Text>
            <View style={{ height: 8 }} />
            <Text variant="bodyMedium">
                💧 {t("screens.plant.nextWateringEstimate")}:{" "}
            </Text>
            <Text variant="bodyMedium">{"      "}{nextWatering ? formatDate(nextWatering) : t("screens.plant.needMoreEvents")}</Text>
            <Text variant="bodyMedium">
                💥 {t("screens.plant.nextFertilizationEstimate")}:{" "}
            </Text>
            <Text variant="bodyMedium">{"      "}{nextFertilizing ? formatDate(nextFertilizing) : t("screens.plant.needMoreEvents")}</Text>

            <PlantInfoModal visible={infoVisible} onClose={() => setInfoVisible(false)} />

        </Surface>

</>
    )
}

const styles = StyleSheet.create({
    detailsContainer: {
        padding: 16,
        borderRadius: 8,
        width: '100%',
        marginBottom: 8,
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