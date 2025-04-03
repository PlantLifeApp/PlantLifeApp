import React, { useContext, useEffect, useState } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { Text, ActivityIndicator, Surface } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { AuthContext } from "../context/authContext"
import { usePlants } from "../context/plantsContext"
import Toast from "react-native-toast-message"
import { deleteCareEvent, updateCareEventDate } from "../services/plantService"
import DeleteCareEventModal from "../components/editPlant/DeleteCareEventModal"
import EditCareHistoryDetails from "../components/editPlant/EditCareHistoryDetails"

export default function EditCareHistory({ route }) {
    const { plant } = route.params
    const plantId = plant.id
    const { user } = useContext(AuthContext)
    const { updatePlantData } = usePlants()
    const { t } = useTranslation()

    const [careHistory, setCareHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [selectedCareId, setSelectedCareId] = useState(null)

    useEffect(() => {
        if (user?.uid) {
            loadHistory()
        }
    }, [user, plantId])

    const loadHistory = async () => {
        try {
            setLoading(true)
            const data = await updatePlantData(plantId, true)
            if (!data || !data.ungroupedHistory) {
                console.log("No careHistory found for plant:", plantId)
                setCareHistory([])
            } else {
                setCareHistory(data.ungroupedHistory)
            }
        } catch (error) {
            console.error("Failed to load care history:", error)
            Toast.show({
                type: "error",
                text1: t("screens.editCareHistory.errorLoading"),
                position: "bottom",
            })
            setCareHistory([])
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (careId) => {
        setSelectedCareId(careId)
        setDeleteModalVisible(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteCareEvent(user.uid, plantId, selectedCareId)
            setDeleteModalVisible(false)

            // Update context and local state
            const updated = await updatePlantData(plantId, true)
            setCareHistory(updated?.ungroupedHistory ?? [])

            Toast.show({
                type: "success",
                text1: t("screens.editCareHistory.successDeleting"),
                position: "bottom",
            })
        } catch (error) {
            console.error("Error deleting care entry:", error)
            Toast.show({
                type: "error",
                text1: t("screens.editCareHistory.errorDeleting"),
                position: "bottom",
            })
        }
    }

    const handleEditDate = async (careId, newDate) => {
        try {
            await updateCareEventDate(user.uid, plantId, careId, newDate)

            const updated = await updatePlantData(plantId, true)
            setCareHistory(updated?.ungroupedHistory ?? [])

            Toast.show({
                type: "success",
                text1: t("screens.editCareHistory.successEditing"),
                position: "bottom",
            })
        } catch (error) {
            console.error("Error updating care date:", error)
            Toast.show({
                type: "error",
                text1: t("screens.editCareHistory.errorEditing"),
                position: "bottom",
            })
        }
    }

    return (
        <View style={styles.fullScreen}>
            <ScrollView contentContainerStyle={styles.container}>
                <Surface style={styles.surface}>
                    <Text variant="headlineSmall">
                        {plant?.givenName ? `${plant.givenName}` : ""}
                    </Text>
                </Surface>

                {loading ? (
                    <View style={styles.inlineSpinner}>
                        <ActivityIndicator animating size="medium" />
                    </View>
                ) : (
                    <EditCareHistoryDetails
                        careHistory={careHistory}
                        onDelete={handleDelete}
                        onEditDate={handleEditDate}
                    />
                )}

                <DeleteCareEventModal
                    visible={deleteModalVisible}
                    onCancel={() => setDeleteModalVisible(false)}
                    onConfirm={handleConfirmDelete}
                />
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
    inlineSpinner: {
        marginTop: 16,
        alignItems: "center",
    },
    surface: {
        padding: 16,
        width: "100%",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
})