import React, { useEffect, useState, useContext } from "react"
import { View, ScrollView, StyleSheet, Alert } from "react-native"
import { Text, ActivityIndicator, Surface, Button } from "react-native-paper"
import { AuthContext } from "../context/authContext"
import { useTranslation } from "react-i18next"
import { usePlants } from "../context/plantsContext"
import { useTheme } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import { deletePlant } from "../services/plantService"
import DeleteConfirmationModal from "../components/editPlant/DeleteConfirmationModal"

export default function EditPlant({ route }) {

    //console.log(route)
    
    const { t } = useTranslation()
    const theme = useTheme()
    const navigation = useNavigation()

    const { user } = useContext(AuthContext)
    const { plant } = route.params
    const plantId = plant.id
    const { loadPlantDetails, refreshPlantInList } = usePlants()

    const [plantData, setPlantData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)

    const [givenName, setGivenName] = useState("")
    const [scientificName, setScientificName] = useState("")
    const [plantType, setPlantType] = useState("") 

    useEffect(() => {
        if (user?.uid) {
            loadData()
        }
    }, [plantId, user])

    const loadData = async() => {
        setLoading(true)
        const data = await loadPlantDetails(plantId)
        setPlantData(data)
        setLoading(false)
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        )
    }

    return <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.container}>
            
            <Surface style={styles.surface}>
                <Text>Editing your plant: {plantData.plant.givenName}</Text>
            </Surface>

            <View style={styles.singleButtonRow}>
                <Button
                    style={styles.button}
                    mode="contained"
                    onPress={() => setDeleteModalVisible(true)}
                >
                    {t("screens.editPlant.delete")}
                </Button>
            </View>

            <DeleteConfirmationModal
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onConfirm={async () => {
                    try {

                        setDeleteModalVisible(false)
                        await deletePlant(user.uid, plantId)
                        navigation.navigate("HomeScreen")

                    } catch (error) {
                        console.error("Error deleting plant:", error)
                        Toast.show({
                            type: "error",
                            text1: t("screens.editPlant.errorDeleting"),
                            position: "bottom",
                        })
                    }
                }}
            />

        </ScrollView>
    </View>

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
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
})