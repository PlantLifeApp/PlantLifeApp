import { View } from 'react-native'
import React, { useContext } from 'react'
import { updateCoverImage } from '../../services/plantService'
import { AuthContext } from '../../context/authContext'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Menu } from 'react-native-paper'

export default function NewCoverImage({ plantId, imageUri, menuVisible, setMenuVisible, anchor }) {

    const { user } = useContext(AuthContext)
    const { t } = useTranslation()


    const handleAddCoverImage = async () => {
        try {

            const url = typeof imageUri === 'string' ? imageUri : imageUri?.uri

            await updateCoverImage(user.uid, plantId, url)

            Toast.show({
                type: "success",
                text1: t("screens.gallery.successAdd"),
                position: 'bottom',
                visibilityTime: 2000,
            })
        }
        catch (error) {
            console.error('Error set cover Image', error)
            Toast.show({
                type: 'error',
                text1: t("screens.gallery.errorAdd"),
                position: 'bottom',
                visibilityTime: 2000
            })
        } finally {
            setMenuVisible(false)
        }
    }
    return (
        <View >
            <Menu 
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={anchor}
            >
                <Menu.Item
                    onPress={handleAddCoverImage}
                    title={t("screens.gallery.changeMenuTitle")}
                    leadingIcon='image'
                />
                <Menu.Item
                    onPress={''}
                    title={'delete tähän?'}
                    leadingIcon='trash-can'
                />


            </Menu>
        </View>
    )
}