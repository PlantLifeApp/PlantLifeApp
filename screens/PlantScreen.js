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
    const [nextWatering, setNextWatering] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        loadPlantData()
    }, [plantId, user])

    const loadPlantData = async () => {
        try {

            const { plant, careHistory, nextWatering } = await fetchPlantData(user.uid, plantId)
            setPlant(plant)
            setCareHistory(careHistory)
            setNextWatering(nextWatering)

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
                text1: t("screens.plant.successfullyAdded"),
                position: 'bottom',
                visibilityTime: 2000,
            });

        } catch (error) {
            console.error(`Error adding ${eventType} event:`, error)
            Toast.show({
                type: 'error',
                text1: t("screens.plant.errorAdding"), 
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
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Surface style={styles.surface}>
                <Text variant="headlineMedium">{plant.givenName}</Text>
                <Text variant="bodyLarge" style={{ fontStyle: "italic" }}>{plant.scientificName}</Text>
            </Surface>

            <View style={styles.buttonContainer}>
                <View style={styles.singleButtonRow}>
                    <Button
                        mode="contained"
                        onPress={() => handleAddCareEvent("watering")}
                        loading={saving}
                        disabled={saving}
                        style={styles.button}
                    >
                        {t("screens.plant.justWatered")} 💦
                    </Button>
                </View>
                <View style={styles.doubleButtonRow}>
                    <Button
                        mode="contained"
                        onPress={() => handleAddCareEvent("fertilizing")}
                        loading={saving}
                        disabled={saving}
                        style={styles.button}
                    >
                        {t("screens.plant.justFertilized")}
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => {}}
                        loading={saving}
                        disabled={saving}
                        style={styles.button}
                    >
                        {t("screens.plant.justPruned")}
                    </Button>
                </View>
            </View>

            <PlantDetails plant={plant} careHistory={careHistory} nextWatering={nextWatering}/>
            <CareHistory careHistory={careHistory} />

            <View style={styles.singleButtonRow}>
                <Button 
                    mode='contained'
                    onPress={() => {}}
                    style={styles.button}
                >
                    {t("screens.plant.editHistory")}
                </Button>
            </View>
            
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
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    singleButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    doubleButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 4,
    },
})

export default PlantScreen