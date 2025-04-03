import { FlatList, StyleSheet, Image } from "react-native";
import React, { useState, useCallback } from "react";
import { Text, Surface, Card, useTheme, TouchableRipple, Portal, Modal } from "react-native-paper";
import { useImages } from "../context/imageContext";
import FloatingButton from "../components/gallery/FloatingButton";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next"

export default function GalleryScreen() {
  const { images } = useImages()
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [fabVisible, setFabVisible] = useState(false)
  const { t } = useTranslation()
  const theme = useTheme()

  // Open picture 
  const handleImagePress = (item) => {

    setSelectedImage(item) // Avaa valittu kuva
    console.log("GalleryScreen: Selected image Uri:", item)
    setModalVisible(true)
  }

  // FAB "only" on this screen
  useFocusEffect(
    useCallback(() => {
      setFabVisible(true)
      return () => setFabVisible(false)
    }, [])
  )

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* List of pictures, 2colums, touchable pictures*/}
      <FlatList
        data={Object.values(images).flat()}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={() => <Text style={styles.noImagesText}>{t("screens.gallery.listEmpty")}</Text>}
        renderItem={({ item }) => (
          <TouchableRipple onPress={() => handleImagePress(item)}>
            <Card style={styles.card}>
              <Image source={{ uri: item }} style={styles.cardImage} />
            </Card>
          </TouchableRipple>
        )}
      />
      {/* Opens full picture*/}
      <Portal>
        <Modal visible={modalVisible} transparent={true} animationType='fade'>
            <TouchableRipple
              onPress={() => { setTimeout(() => setModalVisible(false), 100) }}
            >
              <Card style={styles.modalCard}>
                <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} />
              </Card>
            </TouchableRipple>
        </Modal>
      </Portal>
      {/* set fab*/}
      {fabVisible && <FloatingButton />}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  noImagesText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    elevation: 4,
    borderRadius: 10,
  },
  cardImage: {
    height: 150,
    borderRadius: 10,
    width: 150,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: '100%',
    padding: 4,
  },
  fullscreenImage: {
    width: "100%",
    height: 'auto',
    aspectRatio: 1,
    borderRadius: 10,
  },
});
