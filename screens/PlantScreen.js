import React, { useEffect, useState, useContext } from "react"
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
import { useCallback } from "react"

const PlantScreen = ({ route }) => {
    const { plantId } = route.params
    const { user } = useContext(AuthContext)
    const { loadPlantDetails, refreshPlantInList } = usePlants()
    const { t } = useTranslation()
    const theme = useTheme()

    const [plant, setPlant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            if (user?.uid) {
                const data = await loadPlantDetails(plantId)
                setPlant(data)
                setLoading(false)
            }
        }
        fetchInitialData()
    }, [plantId, user])

    // this hook will refresh the plant data when the screen is focused, no full reload spinner
    useFocusEffect(
        useCallback(() => {
            const refreshPlant = async () => {
                if (user?.uid) {
                    const updatedData = await loadPlantDetails(plantId, true)
                    setPlant(updatedData)
                }
            }
            refreshPlant()
        }, [plantId, user])
    )

    const handleAddCareEvent = async (eventType) => {
        setSaving(true)

        try {
            await addCareEvent(user.uid, plantId, eventType)
            const updatedData = await loadPlantDetails(plantId, true)
            setPlant(updatedData)
            await refreshPlantInList(plantId)

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
        <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}> 
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}> 
                <Surface style={styles.surface}> 
                    <Text variant="headlineMedium">{plant.plant.givenName}</Text>
                    <Text variant="bodyLarge" style={{ fontStyle: "italic" }}>{plant.plant.scientificName}</Text>
                </Surface>

                <CareButtons onAddCareEvent={handleAddCareEvent} saving={saving} />
                <PlantDetails plant={plant.plant} careHistory={plant.careHistory} nextWatering={plant.nextWatering} nextFertilizing={plant.nextFertilizing} />
                <CareHistory careHistory={plant.careHistory} />
                <EditButtons plant={plant.plant}/>
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
        flex: 1,
        justifyContent: "center",
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
