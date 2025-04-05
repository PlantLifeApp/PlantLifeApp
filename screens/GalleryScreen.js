import { FlatList, StyleSheet, Image, TouchableOpacity, View } from "react-native";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Text, Surface, Card, useTheme, Portal, Modal, Chip, Switch } from "react-native-paper";
import { useImages } from "../context/imageContext";
import FloatingButton from "../components/gallery/FloatingButton";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next"
import { usePlants } from "../context/plantsContext";


export default function GalleryScreen() {
  const { images } = useImages()
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [fabVisible, setFabVisible] = useState(false)
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPlantId, setSelectedPlantId] = useState('')
  const [isSwitchOn, setIsSwitchOn] = useState(false)

  const { alivePlants } = usePlants()

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
  // No empty gallery if pushed refesh button from "<Dropdown/>"
  useEffect(() => {
    if (!selectedType) {
      setSelectedType("all");
    }
  }, [selectedType]);

  const onToggleSwitch = () =>
    setIsSwitchOn(!isSwitchOn)


  const TYPES = [
    { label: t("common.all"), value: 'all' },
    { label: t("screens.plant.cactus"), value: 'cactus' },
    { label: t("screens.plant.succulent"), value: 'succulent' },
    { label: t("screens.plant.general"), value: 'general' },
    { label: t("screens.plant.utilitarian"), value: 'utilitarian' }
  ]

  const plantNames = useMemo(() => {
    return alivePlants.map((plant) => ({
      label: plant.givenName,
      value: plant.id
    }))
  }, [alivePlants])

  const filteredImages = useMemo(() => {
    return Object.entries(images)
      .filter(([plantId]) =>
        alivePlants.some((plant) => {
          const isMatch = plant.id === plantId;
          const typeMatch = selectedType === "all" || plant.plantType === selectedType;
          const plantMatch = !selectedPlantId || plant.id === selectedPlantId;
          return isMatch && typeMatch && plantMatch;
        })
      )
      .flatMap(([plantId, imageUrls]) => {
        const plant = alivePlants.find((plant) => plant.id === plantId);
        return imageUrls.map((imageObj) => {
          const uri = typeof imageObj === 'string' ? imageObj : imageObj.uri;
          return {
            uri,
            plantId,
            plantName: plant?.givenName || "Unknown Plant",
            plantType: plant?.plantType || "unknown",
          };
        })
      });
  }, [images, alivePlants, selectedType, selectedPlantId]);

  return (
    <Surface style={[styles.container, { backgroundColor: 'theme.colors.background' }]}>
      {/* List of pictures, 2colums, touchable pictures*/}
      <View style={styles.switchSearch}>
        <Text variant="labelMedium" >{t("screens.gallery.search")}</Text> 
      <Switch
        value={isSwitchOn}
        onValueChange={onToggleSwitch}
      />
      </View>

      <FlatList
        data={filteredImages}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={

          isSwitchOn && ( <View style={styles.chipContainer}>
          <Text style={styles.chipLabel}>{t("screens.gallery.plantName")}</Text>              
          <View
            style={styles.chipGroup} 
          >
            {plantNames.map((plant) => (
              <Chip
                key={plant.value}
                visible={true}
                selected={selectedPlantId === plant.value}
                onPress={() => setSelectedPlantId(plant.value === selectedPlantId ? "" : plant.value)} // empty name if pressed again
                style={styles.chip}
                disabled={selectedType !== 'all'}
              >
                {plant.label}
              </Chip>
            ))}
          </View>
          {/* Kasvityypin valinta ryhmä */}
          <Text style={styles.chipLabel}>{t("screens.gallery.plantType")}</Text>
          <View style={styles.chipGroup}>
            {TYPES.map((type) => ( 
              <Chip
                key={type.value}
                selected={selectedType === type.value}
                onPress={() => setSelectedType(type.value)}
                style={styles.chip}
                disabled={selectedPlantId !== ""}
              >
                {type.label}
              </Chip>
            ))}
          </View>
        </View>
          )
        }
        ListEmptyComponent={() => <Text style={styles.noImagesText}>{t("screens.gallery.listEmpty")}</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleImagePress(item)}>
            <Card style={styles.card}>
              <Image source={{ uri: item?.uri }} style={styles.cardImage} />
            </Card>
          </TouchableOpacity>
        )}
      />

      {/* Opens full picture*/}
      <Portal>
        <Modal visible={modalVisible} transparent={true} animationType='fade'>
          <TouchableOpacity
          activeOpacity={1}
            onPress={() => { setTimeout(() => setModalVisible(false)) }}
          >
            <Card style={styles.modalCard}>
              <Image source={selectedImage?.uri ? { uri: selectedImage?.uri } : null} 
              style={styles.fullscreenImage}
              onError={(error) => console.error('error image load galleryScreen', error.nativeEvent)}
              />
            </Card>
          </TouchableOpacity>
        </Modal>
      </Portal>
      {/* set fab*/}
      {!modalVisible && fabVisible && <FloatingButton />}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'stretch',
    justifyContent: "center",
  },
  row: {
    justifyContent: 'space-evenly',
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
  chipContainer: {
    marginBottom: 10,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  switchSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});
