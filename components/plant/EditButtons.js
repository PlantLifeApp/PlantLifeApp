import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { useTranslation } from "react-i18next"

const EditButtons = ({ onEditHistory, onEditPlant }) => {
    const { t } = useTranslation()

    return (
        <View style={styles.buttonContainer}>
            <View style={styles.singleButtonRow}>
                <Button 
                    mode='contained'
                    onPress={onEditHistory}
                    style={styles.button}
                >
                    {t("screens.plant.editHistory")}
                </Button>
            </View>
            <View style={styles.singleButtonRow}>
                <Button 
                    mode='contained'
                    onPress={onEditPlant}
                    style={styles.button}
                >
                    {t("screens.plant.editPlant")}
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
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
})

export default EditButtons