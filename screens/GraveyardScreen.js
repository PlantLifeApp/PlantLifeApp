import React from "react"
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { Text } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { usePlants } from "../context/plantsContext"
import { useTranslation } from "react-i18next"
import GraveyardCard from "../components/graveyard/GraveyardCard"

export default function GraveyardScreen() {
    const { t } = useTranslation()
    const { deadPlants } = usePlants()
    const navigation = useNavigation()

    //console.log("Graveyard Screen deadPlants:", deadPlants)

    // sort dead plants by killedAt (most recent first)
    const sortedDeadPlants = [...deadPlants].sort((a, b) => {
        const aDate = a.killedAt?.toDate?.() ?? new Date(0)
        const bDate = b.killedAt?.toDate?.() ?? new Date(0)
        return bDate - aDate // descending order
    })

    return (
        <View style={styles.container}>
            {deadPlants.length === 0 ? (
                <>
                    <Text variant="headlineSmall" style={styles.title}>
                        {t("screens.graveyard.empty")} 👻
                    </Text>
                    <View style={styles.row}>
                        <Text style={styles.empty}>
                            {t("screens.graveyard.plantListEmptyDescription")}
                        </Text>
                    </View>
                </>
            ) : (
                <FlatList
                    data={sortedDeadPlants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate("DeadPlantScreen", { plant: item })}>
                            <GraveyardCard plant={item} />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        paddingTop: 32,
        paddingBottom: 16,
        alignSelf: "center",
    },
    empty: {
        padding: 16,
        textAlign: "center",
    },
    row: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    list: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
})