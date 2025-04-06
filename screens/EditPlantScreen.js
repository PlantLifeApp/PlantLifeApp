import React, { useEffect, useState, useContext } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { Text, ActivityIndicator, Surface, Button } from "react-native-paper"
import { AuthContext } from "../context/authContext"
import { useTranslation } from "react-i18next"
import { usePlants } from "../context/plantsContext"
import { useTheme } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import { deletePlant, updatePlant } from "../services/plantService"
import DeletePlantModal from "../components/editPlant/DeletePlantModal"
import PlantKilledModal from "../components/editPlant/PlantKilledModal"
import EditPlantDetails from "../components/editPlant/EditPlantDetails"
import { Timestamp } from "firebase/firestore"

export default function EditPlantScreen({ route }) {
    const { t } = useTranslation()
    const theme = useTheme()
    const navigation = useNavigation()

    const { user } = useContext(AuthContext)
    const { plant } = route.params
    const plantId = plant.id
    const { updatePlantData } = usePlants()

    const [plantData, setPlantData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [graveyardModalVisible, setGraveyardModalVisible] = useState(false)

    const [editedPlant, setEditedPlant] = useState({
        givenName: plant.givenName,
        scientificName: plant.scientificName,
        plantType: plant.plantType,
    })

    useEffect(() => {
        if (user?.uid) {
            loadData()
        }
    }, [plantId, user])

    const loadData = async () => {
        setLoading(true)
        const data = await updatePlantData(plantId, false) // cached load
        setPlantData(data)
        setLoading(false)
    }

    const handleSave = async () => {
        try {
            await updatePlant(user.uid, plantId, editedPlant)
            const updated = await updatePlantData(plantId, true)
            setPlantData(updated)
            navigation.navigate("PlantScreen", { plantId })
        } catch (error) {
            console.error("Error updating plant:", error)
            Toast.show({
                type: "error",
                text1: t("screens.editPlant.errorSaving"),
                position: "bottom",
            })
        }
    }

    const handleKillPlant = async (causeOfDeath) => {
        try {
            await updatePlant(user.uid, plantId, {
                isDead: true,
                killedAt: Timestamp.now(),
                causeOfDeath: causeOfDeath,
            })

            await updatePlantData(plantId, true)
            setGraveyardModalVisible(false)
            navigation.navigate("HomeScreen")

            Toast.show({
                type: "success",
                text1: t("screens.editPlant.plantKilled"),
                position: "bottom",
            })
        } catch (error) {
            console.error("Error killing plant:", error)
            Toast.show({
                type: "error",
                text1: t("screens.editPlant.errorKilling"),
                position: "bottom",
            })
        }
    }

    const handleDeletePlant = async () => {
        try {
            setDeleteModalVisible(false)
            await deletePlant(user.uid, plantId)
            navigation.navigate("HomeScreen")
            Toast.show({
                type: "success",
                text1: t("screens.editPlant.successDeleting"),
                position: "bottom",
            })
        } catch (error) {
            console.error("Error deleting plant:", error)
            Toast.show({
                type: "error",
                text1: t("screens.editPlant.errorDeleting"),
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
        <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Surface style={styles.surface}>
                    <Text variant="bodyLarge">Editing {plantData?.plant?.givenName}</Text>
                </Surface>

                <EditPlantDetails plant={plantData.plant} onChange={setEditedPlant} />

                <View style={styles.singleButtonRow}>
                    <Button mode="contained" style={styles.button} onPress={handleSave}>
                        {t("common.save")}
                    </Button>
                </View>

                <View style={styles.doubleButtonRow}>
                    <Button style={styles.button} mode="contained" onPress={() => setGraveyardModalVisible(true)}>
                        {t("screens.editPlant.killedPlant")}
                    </Button>
                    <Button style={styles.button} mode="contained" onPress={() => setDeleteModalVisible(true)}>
                        {t("screens.editPlant.delete")}
                    </Button>
                </View>

                <DeletePlantModal
                    visible={deleteModalVisible}
                    onCancel={() => setDeleteModalVisible(false)}
                    onConfirm={handleDeletePlant}
                />
                <PlantKilledModal
                    visible={graveyardModalVisible}
                    onCancel={() => setGraveyardModalVisible(false)}
                    onConfirm={handleKillPlant}
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
    singleButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
        marginTop: 16,
    },
    doubleButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginTop: 8,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
})