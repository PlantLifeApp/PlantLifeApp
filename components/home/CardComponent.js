import * as React from 'react';
import { Card, Text } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import { useTranslation } from "react-i18next"
import { searchMostRecentWatering } from '../../utils/searchWaterUtils.js';
import { formatDate } from '../../utils/dateUtils.js';
import { usePlants } from '../../context/plantsContext.js';
import { useImages } from '../../context/imageContext.js';

const CardComponent = ({ item, isTwoColumns }) => {

    const { t } = useTranslation()
    const { images } = useImages()

    const plantImage = images[item.id]
    //const { loadPlantDetails } = usePlants()
    return (
        <Card>
            {isTwoColumns ? (
                <View style={styles.container}>
                    <Image style={styles.image} source={{ uri: plantImage }} />
                    <Card.Content style={styles.content}>
                        <Text style={{ alignSelf: "center" }} variant="titleLarge" numberOfLines={1} ellipsizeMode="tail">{item.givenName}</Text>
                        <Text variant="bodyMedium" numberOfLines={1} ellipsizeMode="tail">{item.scientificName}</Text>
                        <Text variant="bodyMedium">{item.careHistory.length == 0 ? t("screens.home.noWateringHistory") : formatDate(searchMostRecentWatering(item.careHistory))}</Text>
                    </Card.Content>
                </View>
            ) : (
                <View style={styles.containerRow}>
                    <Image style={styles.imageRow} source={{ uri: plantImage }} />
                    <Card.Content style={styles.contentRow}>
                        <Text style={{ alignSelf: "center" }} variant="titleLarge" numberOfLines={2} ellipsizeMode="tail">{item.givenName}</Text>
                        <Text variant="bodyMedium" numberOfLines={2} ellipsizeMode="tail">{item.scientificName}</Text>
                        <Text variant="bodyMedium">{item.careHistory.length == 0 ? t("screens.home.noWateringHistory") : formatDate(searchMostRecentWatering(item.careHistory))}</Text>
                    </Card.Content>
                </View>
            )}
        </Card>
    );
};

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