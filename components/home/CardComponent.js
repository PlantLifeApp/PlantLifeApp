import React from 'react';
import { Card, Icon, Text } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import { useTranslation } from "react-i18next"
import { searchMostRecentWatering } from '../../utils/searchWaterUtils.js';
import { formatDate } from '../../utils/dateUtils.js';
import ItalicText from '../../utils/italicText.js';

const CardComponent = ({ item, isTwoColumns }) => {

    const { t } = useTranslation()

    let plantImageUrl

    if (!item.coverImageUrl || item.coverImageUrl.length <= 0) {
        if (item.plantType === "cactus") {
            plantImageUrl = require("../../assets/plants/cactus-preview.png")
        } else if (item.plantType === "general") {
            plantImageUrl = require("../../assets/plants/general-preview.png")
        } else if (item.plantType === "succulent") {
            plantImageUrl = require("../../assets/plants/succulent-preview.png")
        } else if (item.plantType === "utilitarian") {
            plantImageUrl = require("../../assets/plants/utilitarian-preview.png")
        }
    } else {
        plantImageUrl = { uri: item.coverImageUrl }
    }

    return (
        <Card>
            {isTwoColumns ? (   /* Two Columns, Grid View */
                <View style={styles.container}>
                    <Image style={styles.image} source={plantImageUrl} />
                    <Card.Content style={styles.content}>
                        <Text style={{ alignSelf: "center" }} variant="titleMedium" numberOfLines={1} ellipsizeMode="tail">{item.givenName}</Text>
                        <ItalicText style={{ alignSelf: "center" }} variant="bodySmall" numberOfLines={1} ellipsizeMode="tail">{item.scientificName}</ItalicText>
                        <View style={{ flexDirection: "row", alignItems: "center", alignSelf: 'center' }}>
                            <Icon source="water" size={15} />
                            <Text style={{ alignSelf: "center" }} variant="bodySmall">
                                {item.careHistory.length == 0 ? t("screens.home.noWateringHistory") : formatDate(searchMostRecentWatering(item.careHistory))}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", alignSelf: 'center' }}>
                            <Icon source="calendar" size={15} />
                            <Text style={{ alignSelf: "center" }} variant="bodySmall">
                                {item.nextWatering ? formatDate(item.nextWatering) : "--"}
                            </Text>
                        </View>
                    </Card.Content>
                </View>
            ) : (   /* One Column, List View*/
                <View style={styles.containerRow}>
                    <Image style={styles.imageRow} source={plantImageUrl} />
                    <Card.Content style={styles.contentRow}>
                        <Text style={{ alignSelf: "left", fontWeight: 'bold' }} variant="titleLarge" numberOfLines={2} ellipsizeMode="tail">{item.givenName}</Text>
                        <ItalicText variant="bodyMedium" numberOfLines={2} ellipsizeMode="tail">{item.scientificName}</ItalicText>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon source="water" size={15} />
                            <Text variant="bodySmall">
                                {item.careHistory.length == 0 ? t("screens.home.noWateringHistory") : t("screens.home.lastWatered") + " " + formatDate(searchMostRecentWatering(item.careHistory))}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon source="calendar" size={15} />
                            <Text style={{ alignSelf: "center" }} variant="bodySmall">
                                {item.nextWatering ? t("screens.home.nextWatering") + " " + formatDate(item.nextWatering) : t("screens.home.nextWatering") + " " + "--"}
                            </Text>
                        </View>
                    </Card.Content>
                </View>
            )}
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: "left",
        padding: 5,
    },
    containerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        alignSelf: 'center',
        height: 100,
        width: 100,
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 5,
    },
    imageRow: {
        margin: 5,
        height: 100,
        width: 100,
        borderRadius: 8,
        padding: 10,
    },
    content: {
        flex: 1,
        alignItems: 'flex-start',
    },
    contentRow: {
        flex: 1,
        marginLeft: 10,
        alignItems: 'flex-start',
    },
    textLeft: {
        textAlign: 'left',
        alignSelf: 'flex-start',

    },
});

export default CardComponent;