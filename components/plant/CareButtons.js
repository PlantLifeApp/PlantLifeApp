import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { useTranslation } from "react-i18next"

// this component is used to show care buttons for a plant
// it is currently not used in the app

const CareButtons = ({ onAddCareEvent, saving }) => {
    const { t } = useTranslation()

    return (
        <View style={styles.buttonContainer}>
            <View style={styles.row}>
                <Button
                    mode="contained"
                    compact
                    onPress={() => onAddCareEvent("watering")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                    labelStyle={styles.label}
                >
                    {t("screens.plant.wateredShort")} 💦
                </Button>
                <Button
                    mode="contained"
                    compact
                    onPress={() => onAddCareEvent("fertilizing")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                    labelStyle={styles.label}
                >
                    💥 {t("screens.plant.fertilizedShort")}
                </Button>
            </View>
            <View style={styles.row}>
                <Button
                    mode="contained"
                    compact
                    onPress={() => onAddCareEvent("pruning")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                    labelStyle={styles.label}
                >
                    {t("screens.plant.prunedShort")} ✂️
                </Button>
                <Button
                    mode="contained"
                    compact
                    onPress={() => onAddCareEvent("repotting")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                    labelStyle={styles.label}
                >
                    🪴 {t("screens.plant.repottedShort")}
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        marginTop: 8,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
    },
})

export default CareButtons