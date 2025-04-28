import React from "react"
import { Portal, Dialog, Button, Text } from "react-native-paper"
import { useTranslation } from "react-i18next"

// this component is used to confirm the deletion of a care event
// it is used in the EditCareHistoryScreen

const DeleteCareEventModal = ({ visible, onCancel, onConfirm }) => {
    const { t } = useTranslation()

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>{t("screens.editCareHistory.confirmDeleteTitle")}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">
                        {t("screens.editCareHistory.confirmDeleteMessage")}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>{t("common.cancel")}</Button>
                    <Button onPress={onConfirm} textColor="red">
                        {t("common.delete")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default DeleteCareEventModal
