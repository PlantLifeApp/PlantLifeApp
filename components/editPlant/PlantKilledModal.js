import React from 'react'
import { Portal, Dialog, Button, Text } from 'react-native-paper'
import { useTranslation } from "react-i18next"

const PlantKilledModal = ({ visible, onCancel, onConfirm }) => {
    const { t } = useTranslation()

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>{t("screens.editPlant.confirmGraveyardTitle")}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{t("screens.editPlant.confirmGraveyard")}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>{t("common.cancel")}</Button>
                    <Button onPress={onConfirm} textColor="red">
                        {t("screens.editPlant.confirmGraveyardTitle")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default PlantKilledModal