import React, { useState } from 'react'
import { Portal, Dialog, Button, Text, TextInput } from 'react-native-paper'
import { useTranslation } from "react-i18next"

const DeleteAccountModal = ({ visible, onCancel, onConfirm }) => {
    const { t } = useTranslation()
    const [password, setPassword] = useState('')

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onCancel}>
                <Dialog.Title>{t("screens.options.confirmDeleteTitle")}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{t("screens.options.confirmDelete")}</Text>
                    <TextInput 
                    placeholder='Enter password to delete' 
                    value={password}
                    secureTextEntry= {true}
                    onChangeText={(text) => setPassword(text)}
                    style={{marginTop: 10}}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>{t("common.cancel")}</Button>
                    <Button 
                    onPress={() => onConfirm(password)}
                     textColor="red">
                        {t("common.delete")}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default DeleteAccountModal