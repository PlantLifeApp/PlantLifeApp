import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, Surface, IconButton } from 'react-native-paper'
import { useTranslation } from "react-i18next"
import { formatDate } from '../../utils/dateUtils'
import PlantInfoModal from './PlantInfoModal'

const CarePredictions = ({ nextWatering, nextFertilizing }) => {
    const { t } = useTranslation()
    const [infoVisible, setInfoVisible] = useState(false)

    return (
        <Surface style={styles.detailsContainer}>
            <TouchableOpacity 
                onPress={() => setInfoVisible(true)} 
                style={styles.infoButton}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
                <IconButton icon="information-outline" size={20} />
            </TouchableOpacity>

            <Text variant="bodyMedium">{t("screens.plant.basedOnHistory")}</Text>
            <View style={{ height: 8 }} />

            <Text variant="bodyMedium">
                💧 {t("screens.plant.nextWateringEstimate")}:{" "}
            </Text>
            <Text variant="bodyMedium">
                {"      "}{nextWatering ? formatDate(nextWatering) : t("screens.plant.needMoreEvents")}
            </Text>

            <Text variant="bodyMedium">
                💥 {t("screens.plant.nextFertilizationEstimate")}:{" "}
            </Text>
            <Text variant="bodyMedium">
                {"      "}{nextFertilizing ? formatDate(nextFertilizing) : t("screens.plant.needMoreEvents")}
            </Text>

            <PlantInfoModal visible={infoVisible} onClose={() => setInfoVisible(false)} />
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
    infoButton: {
        margin: 4,
        position: 'absolute',
        right: 0,
        top: 0,
    }
})

export default CarePredictions