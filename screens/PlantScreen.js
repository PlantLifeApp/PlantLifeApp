import React, { useEffect, useState, useContext, useCallback } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { Text, ActivityIndicator, Surface } from "react-native-paper"
import { AuthContext } from "../context/authContext"
import { useTranslation } from "react-i18next"
import { usePlants } from "../context/plantsContext"
import CareButtons from "../components/plant/CareButtons"
import PlantDetails from "../components/plant/PlantDetails"
import CareHistory from "../components/plant/CareHistory"
import EditButtons from "../components/plant/EditButtons"
import Toast from "react-native-toast-message"
import { useTheme } from "react-native-paper"
import { addCareEvent } from "../services/plantService"
import { useFocusEffect } from "@react-navigation/native"
import CarePredictions from "../components/plant/CarePredictions"
import ItalicText from "../utils/italicText.js"

const PlantScreen = ({ route }) => {
    const { plantId, plantPreview } = route.params
    const { user } = useContext(AuthContext)
    const { updatePlantData } = usePlants()
    const { t } = useTranslation()
    const theme = useTheme()

    const [plant, setPlant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const displayName = plant?.plant.givenName || plantPreview?.givenName || ""
    const displayScientific = plant?.plant.scientificName || plantPreview?.scientificName || ""

    // Lataa alussa välimuistista
    useEffect(() => {
        const loadInitial = async () => {
            const data = await updatePlantData(plantId, false)
            setPlant(data)
            setLoading(false)
        }
        loadInitial()
    }, [plantId])

    // Päivitä taustalla kun palaa näytölle
    useFocusEffect(
        useCallback(() => {
            const refresh = async () => {
                const updated = await updatePlantData(plantId, true)
                setPlant(updated)
            }
            refresh()
        }, [plantId])
    )

    const handleAddCareEvent = async (eventType) => {
        setSaving(true)
        try {
            await addCareEvent(user.uid, plantId, eventType)

            const updatedData = await updatePlantData(plantId, true)
            setPlant(updatedData)

            Toast.show({
                type: "success",
                text1: t("screens.plant.successfullyAdded"),
                position: "bottom",
                visibilityTime: 2000,
            })
        } catch (error) {
            console.error(`Error adding ${eventType} event:`, error)
            Toast.show({
                type: "error",
                text1: t("screens.plant.errorAdding"),
                position: "bottom",
                visibilityTime: 2000,
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>

                <Surface style={styles.surface}>
                    <Text variant="headlineMedium">{displayName}</Text>
                    <ItalicText variant="bodyLarge">{displayScientific}</ItalicText>
                </Surface>

                {loading && (
                    <View style={styles.centered}>
                        <ActivityIndicator animating size="large" />
                    </View>
                )}

                {!loading && plant && (
                    <>
                        <CareButtons
                            onAddCareEvent={handleAddCareEvent}
                            saving={saving}
                        />
                        <PlantDetails
                            plant={plant.plant}
                            careHistory={plant.careHistory}
                        />
                        <CarePredictions
                            nextWatering={plant.nextWatering}
                            nextFertilizing={plant.nextFertilizing}
                        />
                        <CareHistory careHistory={plant.careHistory} />
                        <EditButtons plant={plant.plant} />
                    </>
                )}

                {!loading && !plant && (
                    <View style={styles.centered}>
                        <Text variant="headlineMedium">{t("screens.plant.plantNotFound")}.</Text>
                    </View>
                )}
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
    centered: {
        paddingTop: 24,
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
})

export default PlantScreen