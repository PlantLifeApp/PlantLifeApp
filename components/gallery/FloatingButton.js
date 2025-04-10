import React, { useContext, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, View, TouchableOpacity, FlatList } from "react-native"
import { FAB, Portal, Modal, Text, Surface } from "react-native-paper"
import * as ImagePicker from 'expo-image-picker'
import { useImages } from "../../context/imageContext";
import { useTranslation } from "react-i18next"
import { usePlants } from "../../context/plantsContext";
import { uploadPlantImage } from "../../services/plantService"
import { AuthContext } from "../../context/authContext";
import { ThemeContext } from "../../context/themeContext";

export default function FloatingButton() {
  const { theme } = useContext(ThemeContext)
  const { addImage } = useImages()
  const { t } = useTranslation()
  const { plants } = usePlants()
  const { user } = useContext(AuthContext)

  const [fabOpen, setFabOpen] = useState(false) //FAB
  const [modalVisible, setModalVisible] = useState(false) // Choose plant modal
  const [selectedAction, setSelectedAction] = useState('') // "camera" / "gallery"

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(t('screens.fab.requestPermissionHeader'), t('screens.fab.requestMediaPermission'))
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
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    })

    setModalVisible(false)

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

    setModalVisible(false)

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      if (imageUri) {
        addImage(plantId, imageUri); // Lisää kuva valitulle plantId:lle
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
    if (selectedAction === 'camera') {
      handleOpenCamera(plantId)
    } else if (selectedAction === 'gallery') {
      handlePickImage(plantId)
    }
    setSelectedAction(null)
  }

  return (
    <>
      <FAB.Group
        open={fabOpen}
        visible={true}
        icon={fabOpen ? 'flower' : 'plus-circle-outline'}
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
        onStateChange={({ open }) => setFabOpen(open)}
        fabStyle={{
          backgroundColor: theme.colors.secondaryContainer,
          bottom: -32,
        }}
      />


      {/* Kasvien valintamodal --minne lisätään uusi kuva-- */}
      <Portal>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          style={styles.modalContainer}
        >
            <Surface style={styles.modalSurface}>
              <Text variant="bodyLarge" style={styles.modalTitle}>{t("screens.fab.choosePlantName")}</Text>
              <FlatList
                data={plants}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.plantItem, {backgroundColor: theme.colors.secondaryContainer}]}
                    onPress={() => handlePlantSelect(item.id)}
                  >
                    <Text variant="bodyMedium">{item.givenName}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text variant="bodyMedium" style={styles.closeButtonText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
            </Surface>
        </Modal>
      </Portal>
    </>
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
    justifyContent: "center",
    padding: 20,
    width: '100%',
    height: '100%',
  },
  modalSurface: {
    padding: 16,
    margin: 20,
    borderRadius: 10,
    elevation: 4,
    justifyContent: "center",
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center'
  },
  plantItem: {
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
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