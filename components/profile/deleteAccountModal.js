import React, { useState } from 'react'
import { Portal, Dialog, Button, Text, TextInput } from 'react-native-paper'
import { useTranslation } from "react-i18next"

const DeleteAccountModal = ({ visible, onCancel, onConfirm }) => {
    const { t } = useTranslation()
    const [password, setPassword] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)

    const handlePasswordSubmit = () => {
        if (password && password.length >= 6) { 
            setShowConfirmation(true)
        }
    }

    const finalConfirmation = () => {
        setShowConfirmation(false)
        onConfirm(password)
        setPassword('')
    }

    const finalCancel = () => {
        setShowConfirmation(false)
    }

    return (
        <Portal>
            <Dialog visible={visible && !showConfirmation} onDismiss={onCancel}>
                <Dialog.Title>{t("screens.options.confirmDeleteTitle")}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{t("screens.options.confirmDelete")}</Text>
                    <TextInput 
                    placeholder={t("screens.options.passwordToDelete")}
                    value={password}
                    secureTextEntry= {true}
                    onChangeText={(text) => setPassword(text)}
                    style={{marginTop: 10}}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>{t("common.cancel")}</Button>
                    <Button 
                    onPress={handlePasswordSubmit}
                     textColor="red">
                        {t("common.delete")}
                    </Button>
                </Dialog.Actions>
            </Dialog>

            <Dialog visible={visible && showConfirmation} onDismiss={onCancel} >
                {/* <Dialog.Title>
                {t("screens.options.confirmDeleteTitle")}
                </Dialog.Title> */}
                <Dialog.Content>
                    <Text variant='headlineMedium'>{t("screens.options.confirmDelete")}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={finalCancel}> {t("common.cancel")}</Button>
                    <Button onPress={finalConfirmation} textColor='red'> {t("common.delete")} </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default DeleteAccountModal