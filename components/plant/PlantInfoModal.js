import React from 'react'
import { Portal, Dialog, Button, Text } from 'react-native-paper'
import { useTranslation } from "react-i18next"

const PlantInfoModal = ({ visible, onClose }) => {
    const { t } = useTranslation()

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title>{t("screens.plant.infoTitle")}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">
                        {t("screens.plant.infoMessage")} 🪴
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose}>{t("common.ok")}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default PlantInfoModal