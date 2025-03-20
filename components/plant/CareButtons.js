import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { useTranslation } from "react-i18next"

const CareButtons = ({ onAddCareEvent, saving }) => {
    const { t } = useTranslation()

    return (
        <View style={styles.buttonContainer}>
            <View style={styles.singleButtonRow}>
                <Button
                    mode="contained"
                    onPress={() => onAddCareEvent("watering")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                >
                    {t("screens.plant.justWatered")} 💦
                </Button>
            </View>
            <View style={styles.doubleButtonRow}>
                <Button
                    mode="contained"
                    onPress={() => onAddCareEvent("fertilizing")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                >
                    {t("screens.plant.justFertilized")}
                </Button>
                <Button
                    mode="contained"
                    onPress={() => onAddCareEvent("pruning")}
                    loading={saving}
                    disabled={saving}
                    style={styles.button}
                >
                    {t("screens.plant.justPruned")}
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    singleButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    doubleButtonRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
})

export default CareButtons