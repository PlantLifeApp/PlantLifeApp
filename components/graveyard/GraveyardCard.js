import React from "react"
import { View, Image, StyleSheet } from "react-native"
import { Card, Text } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { formatDate } from "../../utils/dateUtils"

const GraveyardCard = ({ plant }) => {
    const { t } = useTranslation()

    const plantImageUrl = plant.coverImageUrl ? plant.coverImageUrl : null

    // convert Timestamp to Date
    let killedAt = null
    if (plant.killedAt && typeof plant.killedAt.toDate === "function") {
        killedAt = plant.killedAt.toDate()
    }

    return (
        <Card style={styles.card}>
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: plantImageUrl }} />
                <Card.Content style={styles.content}>
                    <Text variant="titleLarge" style={styles.name} numberOfLines={1}>
                        {plant.givenName}
                    </Text>
                    <Text variant="bodyMedium" numberOfLines={1}>
                        {plant.scientificName}
                    </Text>
                    <Text variant="bodySmall" style={styles.deathDate}>
                        🪦 {killedAt ? formatDate(killedAt) : t("screens.graveyard.unknownDeath")}
                    </Text>
                </Card.Content>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 12,
        elevation: 3,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#eee",
    },
    content: {
        flex: 1,
    },
    name: {
        fontWeight: "bold",
    },
    deathDate: {
        marginTop: 8,
        fontStyle: "italic",
        color: "#666",
    },
})

export default GraveyardCard