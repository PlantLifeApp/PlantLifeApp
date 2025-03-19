import { View, Text, FlatList, Modal, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState, useCallback } from "react";
import { Surface, Card } from "react-native-paper";
import { useImages } from "../context/imageContext";
import FloatingButton from "../components/gallery/FloatingButton";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next"

export default function GalleryScreen() {
  const { images = [] } = useImages()
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [fabVisible, setFabVisible] = useState(false)
  const { t } = useTranslation()

  // Open picture 
  const handleImagePress = (uri) => {
    setSelectedImage(uri)
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
    <Surface style={styles.container}>
      {/* List of pictures, 2colums, touchable pictures*/}
      <FlatList
        data={images}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={() =><Text style={styles.noImagesText}>{t("screens.gallery.listEmpty")}</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImagePress(item)}>
            <Card style={styles.card}>
              <Card.Cover source={{ uri: item }} style={styles.cardImage} />
            </Card>
          </TouchableOpacity>
        )}
      />
  {/* Opens full picture*/ }
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Card>
              <Card.Cover source={{ uri: selectedImage }} style={styles.fullscreenImage} />
            </Card>
          </TouchableOpacity>
        </View>
      </Modal>

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
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
});
