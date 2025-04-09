import React from "react"
import { Portal, Dialog, Button, Text } from "react-native-paper"
import { View } from "react-native"
import { useTranslation } from "react-i18next"
import { Dropdown } from "react-native-paper-dropdown"

const WinterModal = ({ visible, onClose, winterStart, winterEnd, setWinterStart, setWinterEnd, onSave, monthOptions }) => {
    const { t } = useTranslation()

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title>{t("screens.options.editCustomMonths")}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{t("screens.options.selectStartEnd")}</Text>

                    <View style={{ marginTop: 12 }}>
                        <Dropdown
                            placeholder={t("screens.options.winterStart")}
                            options={monthOptions}
                            value={winterStart}
                            onSelect={setWinterStart}
                        />
                    </View>

                    <View style={{ marginTop: 12 }}>
                        <Dropdown
                            placeholder={t("screens.options.winterEnd")}
                            options={monthOptions}
                            value={winterEnd}
                            onSelect={setWinterEnd}
                        />
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose}>{t("common.cancel")}</Button>
                    <Button onPress={onSave}>{t("screens.options.saveWinterMonths")}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default WinterModal