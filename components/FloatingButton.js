import React, { useEffect, useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { FAB, Portal } from "react-native-paper"
import * as ImagePicker from 'expo-image-picker'
import { useImages } from "../context/imageContext";
import LANGUAGES from "../localization/languages";
import { useTranslation } from "react-i18next"


export default function FloatingButton() {

  const { addImage } = useImages() //openCamera, pickImage

  const [fabState, setFabState] = useState({ open: false }) // fab
  const onStateChange = ({ open }) => setFabState({ open }) // fab
  const { open } = fabState  // fab
  const { t, i18n } = useTranslation()

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(t('screens.fab.requestPermissionHeader'),t('screens.fab.requestMediaPermission')) // saw this alert ONCE when first tried the program( delete cache to see it? )
      }
    })()
  }, [])


  // Open camera
  const handleOpenCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (permission.status !== "granted") {
      Alert.alert(t('screens.fab.requestPermissionHeader'), t('screens.fab.requestCameraPermission'))
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['livePhotos'],
      // allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      addImage(result.assets[0].uri)
    }
  }

  // Open phone gallery to select picture
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      addImage(result.assets[0].uri)
    }
  }

 return (

    <View style={styles.container}>
      <Portal>
        <FAB.Group
          open={open}
          visible={true} // Varmista, että FAB on näkyvissä
          icon={open ? 'flower' : 'plus-circle-outline'}
          actions={[
            {
              icon: 'camera',
              label: t('screens.fab.camera'),
              onPress: handleOpenCamera
            },
            {
              icon: 'image',
              label: t('screens.fab.phoneGallery'),
              onPress: handlePickImage
            }
          ]}
          onStateChange={onStateChange} //FAB tarvii tätä
          style={styles.fabGroup}
        />
      </Portal>
    </View>

)
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'space-evenly',
  alignItems: 'center',
  padding: 20,
},
fabGroup: {
  position: 'absolute',
  bottom: 60,
  right: 16,
},
})