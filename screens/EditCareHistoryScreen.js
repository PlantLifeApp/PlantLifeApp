import React, { useContext, useEffect, useState } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { Text, ActivityIndicator, Surface, IconButton } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { AuthContext } from "../context/authContext"
import { usePlants } from "../context/plantsContext"
import Toast from "react-native-toast-message"
import { deleteCareEvent } from "../services/plantService"
import DeleteCareEventModal from "../components/editPlant/DeleteCareEventModal"
import EditCareHistoryDetails from "../components/editPlant/EditCareHistoryDetails"

export default function EditCareHistory({ route }) {
    const { plant } = route.params
    const plantId = plant.id
    const { user } = useContext(AuthContext)
    const { loadPlantDetails } = usePlants()
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
            const data = await loadPlantDetails(plantId, true)

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

            // optimistically update local state to avoid waiting for server response and re-fetching
            setCareHistory(prev => prev.filter(entry => entry.id !== selectedCareId))

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

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        )
    }

    return (
        <View style={[styles.fullScreen]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Surface style={styles.surface}>
                    <Text variant="bodyLarge">{t("screens.editCareHistory.title")}</Text>
                </Surface>

                <EditCareHistoryDetails
                    careHistory={careHistory}
                    onDelete={handleDelete}
                />

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
    surface: {
        padding: 16,
        width: "100%",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    itemSurface: {
        padding: 8,
        width: "100%",
        borderRadius: 8,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
})