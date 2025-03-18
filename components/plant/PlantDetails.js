import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, Surface } from 'react-native-paper'
import { formatDate } from '../../utils/dateUtils'

const PlantDetails = ({ plant, careHistory }) => {

    const lastWatering = careHistory.find(entry => entry.events.includes("watering"))
    const lastFertilization = careHistory.find(entry => entry.events.includes("fertilizing"))

    return (
        <Surface style={styles.detailsContainer}>
            <Text variant="bodyMedium">Type: {plant.plantType}</Text>
            <Text variant="bodyMedium">Last Watered: {lastWatering ? formatDate(lastWatering.date) : "No record"}</Text>
            <Text variant="bodyMedium">Last Fertilized: {lastFertilization ? formatDate(lastFertilization.date) : "No record"}</Text>
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