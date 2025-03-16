import React, { useEffect, useState } from "react"
import { Alert, Image, StyleSheet, View } from "react-native"
import { FAB, Portal } from "react-native-paper"
import * as ImagePicker from 'expo-image-picker'



export default function FloatingButton() {

  const [image, setImage] = useState(null); // kuvan näyttämiseen

  const [fabState, setFabState] = useState({ open: false })
  const onStateChange = ({ open }) => setFabState({ open })
  const { open } = fabState 

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission is needed','Allow access to photos')
      }
    })()
  }, [])

    // take picture from your phone
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (permission.status !== 'granted') {
      Alert.alert('Permission is needed', 'Allow acces to camera') // saw this alert ONCE when first tried the program( delete cache to see it? )
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['livePhotos'],
    })
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  // Pick image from phone gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images']
    })
    console.log(result)

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

 //----------- RETURNISTA POISTAA PORTAL ----------
 //----------- KUN EI ENÄÄN TARVITSE --------
 // ---------- Ainakin yhden ohjeen mukaan ei tarvi Portal. View myös ?
 return (

    <View style={styles.container}>
      {
      image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> // TESTAUS tuleeko kuva
      } 
      <Portal>
        <FAB.Group
          open={open}
          visible={true} // Varmista, että FAB on näkyvissä
          icon={open ? 'flower' : 'plus-circle-outline'}
          actions={[
            {
              icon: 'camera',
              label: 'Camera',
              onPress: openCamera
            },
            {
              icon: 'image',
              label: 'Gallery',
              onPress: pickImage
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