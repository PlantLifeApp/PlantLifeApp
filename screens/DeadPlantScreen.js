import React, { useState } from "react"
import { View, ScrollView, StyleSheet, Image } from "react-native"
import { Text, Surface, FAB } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { useTheme } from "react-native-paper"
import { formatDate } from "../utils/dateUtils"
import PlantDetails from "../components/plant/PlantDetails"
import CareHistory from "../components/plant/CareHistory"
import ItalicText from "../utils/italicText"
import { deletePlant } from "../services/plantService"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
import DeletePlantModal from "../components/editPlant/DeletePlantModal"
import { AuthContext } from "../context/authContext"
import { useContext } from "react"

// the dead plant screen is used to show the details of a dead plant
// it is navigated to from the graveyard screen
// it shows the plant details, care history, and a delete button
// it is a modified version of the PlantScreen component

export default function DeadPlantScreen({ route }) {

    const { plant } = route.params
    const { t } = useTranslation()
    const { user } = useContext(AuthContext)
    const theme = useTheme()
    const navigation = useNavigation()

    const [fabOpen, setFabOpen] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)

    const handleDelete = async () => {
        setDeleteModalVisible(false)
        try {
            await deletePlant(user.uid, plant.id)
            Toast.show({
                type: "success",
                text1: t("screens.graveyard.deleted"),
                position: "bottom",
            })
            navigation.goBack()
        } catch (error) {
            console.error("Failed to delete plant:", error)
            Toast.show({
                type: "error",
                text1: t("screens.graveyard.deleteFailed"),
                position: "bottom",
            })
        }
    }

    // normalize the care history to ensure dates are Date objects and events are arrays
    const normalizedCareHistory = plant.careHistory.map(entry => {
        const date = typeof entry.date?.toDate === "function"
            ? entry.date.toDate()
            : entry.date instanceof Date
            ? entry.date
            : null
        return {
            ...entry,
            date,
            events: Array.isArray(entry.events)
                ? entry.events
                : entry.type
                ? [entry.type]
                : [],
        }
    }).filter(entry => entry.date) // filter out anything without a valid date just in case

    // group care history by date
    const groupedByDate = {}
    normalizedCareHistory.forEach(entry => {
        const dateKey = entry.date.toISOString().split("T")[0]
        if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = { date: entry.date, events: [] }
        }
        groupedByDate[dateKey].events.push(...entry.events)
    })

    // convert grouped object to sorted array
    const groupedCareHistory = Object.values(groupedByDate).sort((a, b) => b.date - a.date)

    const killedAt = plant.killedAt?.toDate?.() ?? null
    const createdAt = plant.createdAt?.toDate?.() ?? null
    const causeOfDeathKey = plant.causeOfDeath ?? "unknown"
    
    // format lifespan string
    // if both createdAt and killedAt are null, show "?"
    const lifespan =
    createdAt || killedAt
        ? `${createdAt ? formatDate(createdAt) : "?"} — ${killedAt ? formatDate(killedAt) : "?"}`
        : null

    return (
        <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.container}>

                <Surface style={[styles.surface, { marginTop: 16 }]}>
                    <Text variant="headlineMedium">{plant.givenName}</Text>
                    <ItalicText variant="bodyLarge">{plant.scientificName}</ItalicText>
                </Surface>

                {plant.coverImageUrl ? (
                    <Surface style={styles.surface}>
                        <Image
                            style={styles.image}
                            source={{ uri: plant.coverImageUrl }}
                        />
                        <Text variant="bodyMedium" style={styles.killedText}>
                            {lifespan ? `${lifespan}\n` : ""}
                            {t("screens.graveyard.causeOfDeath")}: {t(`screens.graveyard.causesOfDeath.${causeOfDeathKey}`)}
                            {plant.plantPrice != null ? `\n${t("screens.graveyard.plantPrice")}: ${plant.plantPrice.toFixed(2)}` : ""}
                        </Text>
                    </Surface>
                ) : (
                    <Surface style={styles.surface}>
                        <Text variant="bodyMedium" style={styles.killedText}>
                            {lifespan ? `${lifespan}\n` : ""}
                            {t("screens.graveyard.causeOfDeath")}: {t(`screens.graveyard.causesOfDeath.${causeOfDeathKey}`)}
                            {plant.plantPrice != null ? `\n${t("screens.graveyard.plantPrice")}: ${plant.plantPrice.toFixed(2)}` : ""}
                        </Text>
                    </Surface>
                )}

                <PlantDetails
                    plant={plant}
                    careHistory={groupedCareHistory}
                    showRelativeTime={false}
                />
                <CareHistory careHistory={groupedCareHistory} />

            </ScrollView>

            <FAB.Group
                open={fabOpen}
                visible={true}
                icon={fabOpen ? "close" : "delete-empty"}
                onStateChange={({ open }) => setFabOpen(open)}
                fabStyle={{
                    backgroundColor: theme.colors.errorContainer,
                    bottom: -32,
                }}
                actions={[
                    {
                        icon: "delete-forever",
                        label: t("screens.graveyard.deletePermanently"),
                        style: { backgroundColor: theme.colors.error },
                        onPress: () => setDeleteModalVisible(true),
                    },
                ]}
            />

            <DeletePlantModal
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onConfirm={handleDelete}
            />

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
    surface: {
        padding: 16,
        width: "100%",
        alignItems: "center",
        //marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 16,
    },
    killedText: {
        textAlign: "center",
        //marginTop: 8,
    },
})