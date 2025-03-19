import React, { useEffect, useState, useContext } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Text, ActivityIndicator, Surface, Button } from 'react-native-paper'
import { AuthContext } from '../context/authContext'
import { useTranslation } from "react-i18next"
import { fetchPlantData, addCareEvent } from '../services/plantService'
import PlantDetails from '../components/plant/PlantDetails'
import CareHistory from '../components/plant/CareHistory'
import Toast from 'react-native-toast-message'

const PlantScreen = ({ route }) => {

    const { plantId } = route.params
    const { user } = useContext(AuthContext)
    const { t } = useTranslation()

    const [plant, setPlant] = useState(null)
    const [careHistory, setCareHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadPlantData()
    }, [plantId, user])

    const loadPlantData = async () => {
        try {

            const { plant, careHistory } = await fetchPlantData(user.uid, plantId)
            setPlant(plant)
            setCareHistory(careHistory)

        } catch (error) {
            console.error("Error fetching plant data:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddCareEvent = async (eventType) => {
    
        setSaving(true)

        try {

            await addCareEvent(user.uid, plantId, eventType)
            await loadPlantData() // refresh data after adding event
    
            Toast.show({
                type: 'success',
                text1: `Successfully added ${eventType}!`,
                position: 'bottom',
                visibilityTime: 1000,
            })

        } catch (error) {
            console.error(`Error adding ${eventType} event:`, error)
            Toast.show({
                type: 'error',
                text1: `Failed to add ${eventType}. Please try again.`,
                position: 'bottom',
                visibilityTime: 2000
            })

        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        )
    }

    if (!plant) {
        return (
            <View style={styles.centered}>
                <Text variant="headlineMedium">{t("screens.plant.plantNotFound")}.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.surface}>
                <Text variant="headlineMedium">{plant.givenName}</Text>
                <Text variant="bodyLarge" style={{ fontStyle: "italic" }}>{plant.scientificName}</Text>
            </Surface>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={() => handleAddCareEvent("watering")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                >
                    Just Watered!
                </Button>
                <Button
                    mode="contained"
                    onPress={() => handleAddCareEvent("fertilizing")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                >
                    Just Fertilized!
                </Button>
            </View>

            <PlantDetails plant={plant} careHistory={careHistory}/>
            <CareHistory careHistory={careHistory} />
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    surface: {
        padding: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 8,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 8,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
})

export default PlantScreen