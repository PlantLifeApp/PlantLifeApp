import React, { useEffect, useState, useContext, useCallback } from "react"
import { View, ScrollView, StyleSheet, Image } from "react-native"
import { Text, ActivityIndicator, Surface, FAB } from "react-native-paper"
import { AuthContext } from "../context/authContext"
import { useTranslation } from "react-i18next"
import { usePlants } from "../context/plantsContext"
import PlantDetails from "../components/plant/PlantDetails"
import CareHistory from "../components/plant/CareHistory"
import Toast from "react-native-toast-message"
import { useTheme } from "react-native-paper"
import { addCareEvent } from "../services/plantService"
import { useFocusEffect } from "@react-navigation/native"
import CarePredictions from "../components/plant/CarePredictions"
import ItalicText from "../utils/italicText.js"
import { formatDate } from "../utils/dateUtils"
import PlantFAB from "../components/plant/PlantFAB.js"

// this screen is used to show the details of a plant
// it is navigated to from the HomeScreen component
// it shows the plant details, care history, and a FAB to add care events

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

    // load from cache when available
    useEffect(() => {
        const loadInitial = async () => {
            const data = await updatePlantData(plantId, false)
            setPlant(data)
            setLoading(false)
        }
        loadInitial()
    }, [plantId])

    // soft refresh when screen is focused
    // this is to ensure that the data is up to date when the user comes back to the screen
    useFocusEffect(
        useCallback(() => {
            const refresh = async () => {
                const updated = await updatePlantData(plantId, true)
                setPlant(updated)
            }
            refresh()
        }, [plantId])
    )

    // handle add care event action
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

    //console.log(plant?.plant)

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
                        {(plant.plant.coverImageUrl || plant.plant.createdAt || plant.plant.plantPrice != null) && (
                            <Surface style={styles.imageSurface}>
                                {plant.plant.coverImageUrl && (
                                    <Image
                                        source={{ uri: plant.plant.coverImageUrl }}
                                        style={styles.image}
                                    />
                                )}

                                {plant.plant.createdAt && (
                                    <Text variant="bodyMedium" style={styles.plantMetaText}>
                                        {`${t("screens.plant.createdAt")}: ${formatDate(plant.plant.createdAt.toDate?.() ?? plant.plant.createdAt)}`}
                                    </Text>
                                )}

                                {plant.plant.plantPrice != null && (
                                    <Text variant="bodyMedium" style={styles.plantMetaText}>
                                        {`${t("screens.plant.price")}: ${
                                            plant.plant.plantPrice === 0
                                                ? t("screens.plant.free")
                                                : `${plant.plant.plantPrice} €`
                                        }`}
                                    </Text>
                                )}
                            </Surface>
                        )}

                        <PlantDetails
                            plant={plant.plant}
                            careHistory={plant.careHistory}
                            showRelativeTime={true}
                        />
                        <CarePredictions
                            nextWatering={plant.nextWatering}
                            nextFertilizing={plant.nextFertilizing}
                        />
                        <CareHistory careHistory={plant.careHistory} />
                    </>
                )}

                {!loading && !plant && (
                    <View style={styles.centered}>
                        <Text variant="headlineMedium">{t("screens.plant.plantNotFound")}.</Text>
                    </View>
                )}
            </ScrollView>

            <PlantFAB onAddCareEvent={handleAddCareEvent} plant={plant?.plant} />
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
        marginTop: 8,
        marginBottom: 16,
        borderRadius: 8,
    },
    imageSurface: {
        padding: 16,
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
        borderRadius: 8,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 8,
        paddingBottom: 8,
    },
    plantMetaText: {
        textAlign: "center",
    },
})

export default PlantScreen