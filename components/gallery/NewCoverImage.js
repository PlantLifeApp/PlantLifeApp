import { View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { deleteImage, removeImageUriFromFirestore, updateCoverImage } from '../../services/plantService'
import { AuthContext } from '../../context/authContext'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import { Menu, useTheme } from 'react-native-paper'
import { useImages } from '../../context/imageContext'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

export default function NewCoverImage({ plantId, imageUri, menuVisible, setMenuVisible, anchor, onImageDeleted }) {

    const { user } = useContext(AuthContext)
    const { t } = useTranslation()
    const { removeImage } = useImages()
      const theme = useTheme()

    const [isCoverImage, setIsCoverImage] = useState(false)

    useEffect(() => {
        const checkCoverImage = async () => {
            try {
                if (!plantId || !imageUri || !user?.uid) return

                const db = getFirestore()
                const plantRef = doc(db, 'users', user.uid, 'plants', plantId)
                const snap = await getDoc(plantRef)
                const data = snap.data()
                const selectedUri = typeof imageUri === 'string' ? imageUri : imageUri?.uri

                setIsCoverImage(data?.coverImageUrl === selectedUri)
            } catch (error) {
                console.log('error check cover image: ', error)
                setIsCoverImage(false)
            }
        }
        checkCoverImage()
    }, [plantId, imageUri, user?.uid])


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


    const handleDeleteImage = async () => {
        try {
            await deleteImage(user.uid, plantId, imageUri) //storage
            await removeImageUriFromFirestore(user.uid, plantId, imageUri) // firestore
            await removeImage(plantId, imageUri) // asyncStorage

            if (onImageDeleted) {
                onImageDeleted(plantId, imageUri)
            }

            Toast.show({
                type: "success",
                text1: t("screens.gallery.imageDeleted"),
                position: 'bottom',
                visibilityTime: 2000,
            })
        }
        catch (error) {
            console.error('Error delete Image', error)
            Toast.show({
                type: 'error',
                text1: t("screens.gallery.imageDeleteError"),
                position: 'bottom',
                visibilityTime: 3000
            })
        } finally {
            setMenuVisible(false)
        }
    }

    return (
        <View >
            <Menu
            theme={theme.colors.primary}
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={anchor}
            >
                <Menu.Item
                    onPress={handleAddCoverImage}
                    disabled={isCoverImage}
                    title={t("screens.gallery.changeMenuTitle")}
                    leadingIcon='image'
                    rippleColor={theme.colors.onPrimary}
                />

                    <Menu.Item
                        disabled={isCoverImage}
                        onPress={handleDeleteImage}
                        title={t("screens.gallery.deleteMenuTitle")}
                        leadingIcon='trash-can'
                        rippleColor={theme.colors.error}
                    />




            </Menu>
        </View>
    )
}