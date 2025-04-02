import React from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { Text, Surface } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { usePlants } from "../context/plantsContext"
import { useTranslation } from "react-i18next"
import { AuthContext } from "../context/authContext"
import CardComponent from "../components/home/CardComponent"

export default function GraveyardScreen() {
    
    const { t } = useTranslation()
    const { deadPlants } = usePlants()
    const navigation = useNavigation()

    console.log("Dead plants:", deadPlants)

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>
                Rest In Peace:
            </Text>

            {deadPlants.length === 0 ? (
                <Text style={styles.empty}>
                    {t("screens.graveyard.empty")}
                </Text>
            ) : (
                <FlatList
                    data={deadPlants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Surface style={styles.card}>
                            <CardComponent item={item} isTwoColumns={false} />
                        </Surface>
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
        height: "100%",
    },
    itemContainerSimple: {
        flex: 1,
        padding: 10,
        maxWidth: '50%',
        alignSelf: 'stretch',
    },
    itemContainerComplex: {
        flex: 1,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    row: {
        flex: 1,
        justifyContent: "flex-start",
    },
})