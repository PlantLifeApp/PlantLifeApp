import React, { useContext, useEffect, useState } from "react"
import { Alert, StyleSheet, View, Text, Modal, TouchableOpacity, FlatList } from "react-native"
import { FAB, Portal } from "react-native-paper"
import * as ImagePicker from 'expo-image-picker'
import { useImages } from "../../context/imageContext";
import { useTranslation } from "react-i18next"
import { usePlants } from "../../context/plantsContext";
import { uploadPlantImage } from "../../services/plantService"
import { AuthContext } from "../../context/authContext";

export default function FloatingButton({ plantId }) {
  const { addImage } = useImages() //openCamera, pickImage
  const [fabState, setFabState] = useState({ open: false }) // fab
  const onStateChange = ({ open }) => setFabState({ open }) // fab
  const { open } = fabState  // fab
  const [modalVisible, setModalVisible] = useState(false)
  const { t } = useTranslation()
  const { plants } = usePlants()
  const { user } = useContext(AuthContext)
  const [selectedAction, setSelectedAction] = useState('') // to choose gallery / camera

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(t('screens.fab.requestPermissionHeader'), t('screens.fab.requestMediaPermission')) // saw this alert ONCE when first tried the program( delete cache to see it? )
      }
    })()
  }, [])

  // Open camera + plantId to save correct
  const handleOpenCamera = async (plantId) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (permission.status !== "granted") {
      Alert.alert(t('screens.fab.requestPermissionHeader'), t('screens.fab.requestCameraPermission'))
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['livePhotos'],
      // allowsEditing: true,
      quality: 1,
      allowsEditing: true,
      aspect: [4, 4],
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri
      await uploadImageToPlant(plantId, imageUri)
    }
  }

  // Open phone gallery to select picture + plantId to save correct
  const handlePickImage = async (plantId) => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      aspect: [4, 4],
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (imageUri) {
        addImage(plantId, imageUri); // Lisää kuva valitulle plantId:lle
        console.log
      } else {
        console.error("Floatingbutton: Image URI is undefined");
      }
    }
  }

  // add to Firebase Storage picture of the same plantId  
  const uploadImageToPlant = async (plantId, imageUri) => {
    try {
      const downloadUrl = await uploadPlantImage(user.uid, plantId, imageUri)
      if (!downloadUrl || typeof downloadUrl !== "string") {
        throw new Error("Invalid download URL: must be a string");
      }
      console.log("Floatingbutton:✅ Image uploaded successfully:", downloadUrl)
      addImage(plantId, downloadUrl)
    } catch (error) {
      console.error("Floatingbutton: Error uploading image:", error)
      Alert.alert("Error", "Failed to upload image. Please try again.")
    }
  }

  // opens modal if pressed camera or gallery
  const openPlantSelectionModal = (action) => {
    setSelectedAction(action)
    setModalVisible(true)

  }

  // Choose correct plant to add new picture
  const handlePlantSelect = (plantId) => {
    setModalVisible(false)
    if (selectedAction === 'camera') {
      handleOpenCamera(plantId)
    } else if (selectedAction === 'gallery') {
      handlePickImage(plantId)
    }
    setSelectedAction(null)
  }

  return (
    <View style={styles.container}>
      <Portal>
        <FAB.Group
          open={open}
          visible={true}
          icon={open ? 'flower' : 'plus-circle-outline'}
          actions={[
            {
              icon: 'camera',
              label: t('screens.fab.camera'),
              onPress: () => openPlantSelectionModal('camera'),
            },
            {
              icon: 'image',
              label: t('screens.fab.phoneGallery'),
              onPress: () => openPlantSelectionModal('gallery'),
            },
          ]}
          onStateChange={({ open }) => setFabState({ open })}
          style={styles.fabGroup}
        />
      </Portal>

      {/* Kasvien valintamodal --minne lisätään uusi kuva-- */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View >
            <Text style={styles.modalTitle}>{t("screens.fab.choosePlantName")}</Text>
            <FlatList
              data={plants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.plantItem}
                  onPress={() => handlePlantSelect(item.id)}
                >
                  <Text style={styles.plantName}>{item.givenName}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 300,
    height: '100%',
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    alignSelf: 'center'
  },
  plantItem: {
    padding: 15,
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
  },
  plantName: {
    fontSize: 16,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 100,
    alignSelf: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});