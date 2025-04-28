import React, { useState } from 'react'
import { Portal, Dialog, Button, Text, Menu } from 'react-native-paper'
import { useTranslation } from "react-i18next"

// this component is used to confirm the death of a plant
// it is used in the EditPlantScreen
// it is a modal that pops up when the user tries to mark a plant as dead

const PlantKilledModal = ({ visible, onCancel, onConfirm }) => {
    const { t } = useTranslation()
    const [menuVisible, setMenuVisible] = useState(false)
    const [causeOfDeath, setCauseOfDeath] = useState(null)

    const deathOptions = [
        "overwatering",
        "underwatering",
        "pests",
        "disease",
        "lightStress",
        "temperatureStress",
        "humidityStress",
        "unknown",
        "other",
    ]

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>{t("screens.editPlant.confirmGraveyardTitle")}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
                        {t("screens.editPlant.confirmGraveyard")}
                    </Text>

                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <Button mode="outlined" onPress={() => setMenuVisible(true)}>
                                {causeOfDeath
                                    ? t(`screens.editPlant.causesOfDeath.${causeOfDeath}`)
                                    : t("screens.editPlant.selectCause")}
                            </Button>
                        }
                    >
                        {deathOptions.map((cause) => (
                            <Menu.Item
                                key={cause}
                                onPress={() => {
                                    setCauseOfDeath(cause)
                                    setMenuVisible(false)
                                }}
                                title={t(`screens.editPlant.causesOfDeath.${cause}`)}
                            />
                        ))}
                    </Menu>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>{t("common.cancel")}</Button>
                    <Button
                        onPress={() => onConfirm(causeOfDeath)}
                        disabled={!causeOfDeath}
                        textColor="red"
                    >
                        {t("screens.editPlant.confirmGraveyardTitle")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default PlantKilledModal