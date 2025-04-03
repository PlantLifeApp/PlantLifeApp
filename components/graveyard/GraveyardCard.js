import React from "react"
import { View, Image, StyleSheet } from "react-native"
import { Card, Text } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { formatDate } from "../../utils/dateUtils"
import ItalicText from "../../utils/italicText"

const GraveyardCard = ({ plant }) => {
    const { t } = useTranslation()

    let plantImageUrl

    if (!plant.coverImageUrl || plant.coverImageUrl.length <= 0) {
        if (plant.plantType === "cactus") {
            plantImageUrl = require("../../assets/plants/cactus-preview.png")
        } else if (plant.plantType === "general") {
            plantImageUrl = require("../../assets/plants/general-preview.png")
        } else if (plant.plantType === "succulent") {
            plantImageUrl = require("../../assets/plants/succulent-preview.png")
        } else if (plant.plantType === "utilitarian") {
            plantImageUrl = require("../../assets/plants/utilitarian-preview.png")
        }
    } else {
        plantImageUrl = { uri: plant.coverImageUrl }
    }

    // convert Timestamp to Date
    let killedAt = null
    if (plant.killedAt && typeof plant.killedAt.toDate === "function") {
        killedAt = plant.killedAt.toDate()
    }

    return (
        <Card style={styles.card}>
            <View style={styles.container}>
                <Image style={styles.image} source={plantImageUrl} />
                <Card.Content style={styles.content}>
                    <Text variant="titleLarge" style={styles.name} numberOfLines={1}>
                        {plant.givenName}
                    </Text>
                    <ItalicText variant="bodyLarge" numberOfLines={2}>
                        {plant.scientificName}
                    </ItalicText>
                    <Text variant="bodyMedium" style={styles.deathDate}>
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
    },
    content: {
        flex: 1,
    },
    name: {
        fontWeight: "bold",
    },
    deathDate: {
        marginTop: 8,
    },
})

export default GraveyardCard