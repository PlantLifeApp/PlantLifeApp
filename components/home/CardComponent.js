import * as React from 'react';
import { Card, Icon, Text } from 'react-native-paper';
import { View, Image, StyleSheet } from 'react-native';
import { useTranslation } from "react-i18next"
import { searchMostRecentWatering } from '../../utils/searchWaterUtils.js';
import { formatDate } from '../../utils/dateUtils.js';

const CardComponent = ({ item, isTwoColumns }) => {

    const { t } = useTranslation()

    const plantImageUrl = item.coverImageUrl
    return (
        <Card>
            {isTwoColumns ? (
                <View style={styles.container}>
                    <Image style={styles.image} source={{ uri: plantImageUrl }} />
                    <Card.Content style={styles.content}>
                        <Text style={{ alignSelf: "center" }} variant="titleMedium" numberOfLines={1} ellipsizeMode="tail">{item.givenName}</Text>
                        <Text style={{ alignSelf: "center" }} variant="bodySmall" numberOfLines={1} ellipsizeMode="tail">{item.scientificName}</Text>
                        <Text style={{ alignSelf: "center" }} variant="bodySmall">
                            <Icon source="water" size={15} color="blue" />
                            {item.careHistory.length == 0 ? t("screens.home.noWateringHistory") : formatDate(searchMostRecentWatering(item.careHistory))}
                        </Text>
                    </Card.Content>
                </View>
            ) : (
                <View style={styles.containerRow}>
                    <Image style={styles.imageRow} source={{ uri: plantImageUrl }} />
                    <Card.Content style={styles.contentRow}>
                        <Text style={{ alignSelf: "left", fontWeight: 'bold' }} variant="titleLarge" numberOfLines={2} ellipsizeMode="tail">{item.givenName}</Text>
                        <Text variant="bodyMedium" numberOfLines={2} ellipsizeMode="tail">{item.scientificName}</Text>
                        <Text variant="bodyMedium">
                            <Icon source="water" size={15} />
                            {item.careHistory.length == 0 ? t("screens.home.noWateringHistory") : formatDate(searchMostRecentWatering(item.careHistory))}
                        </Text>
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