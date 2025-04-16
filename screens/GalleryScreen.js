import { FlatList, StyleSheet, Image, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Text, Surface, Card, useTheme, Portal, Modal, Chip, Switch, Button } from "react-native-paper";
import { useImages } from "../context/imageContext";
import FloatingButton from "../components/gallery/FloatingButton";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next"
import { usePlants } from "../context/plantsContext";
import NewCoverImage from "../components/gallery/NewCoverImage";
import * as Haptics from "expo-haptics"


import { useRoute } from "@react-navigation/native"

export default function GalleryScreen() {

  const route = useRoute()
  const { preselectedPlantID } = route.params || {}

  const { images } = useImages()
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [fabVisible, setFabVisible] = useState(false)
  const { t } = useTranslation()
  const theme = useTheme()
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPlantId, setSelectedPlantId] = useState('')
  const [isSwitchOn, setIsSwitchOn] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedPlantIdCover, setSelectedPlantIdCover] = useState('')
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const imageRefs = useRef({});
  const [deadSwitch, setDeadSwitch] = useState(false)

  const { alivePlants, deadPlants } = usePlants()

  useEffect(() => {
    if (preselectedPlantID) {
      setSelectedPlantId(preselectedPlantID)
      setIsSwitchOn(false)
    }
  }, [preselectedPlantID])

  // Open picture 
  const handleImagePress = (item) => {

    setSelectedImage(item) // Avaa valittu kuva
    //console.log("GalleryScreen: Selected image Uri:", item)
    setModalVisible(true)
  }
  const handleLongPress = (plantId, imageUri, index) => {
    const ref = imageRefs.current[index];
    if (ref) {
      ref.measureInWindow((x, y, width, height) => {
        setMenuAnchor({ x, y });
        setSelectedPlantIdCover(plantId);
        setSelectedImage(imageUri);
        setMenuVisible(true);
      });
    }
  };
  // const handleLongPress = (plantId, imageUri) => {
  //   setSelectedPlantIdCover(plantId)
  //   setSelectedImage({ uri: imageUri })
  //   setMenuVisible(true)
  //   // console.log('Täää ny perkl, ', selectedImage)
  // }

  // FAB "only" on this screen
  useFocusEffect(
    useCallback(() => {
      setFabVisible(true)
      return () => setFabVisible(false)
    }, [])
  )

  const onToggleSwitch = () =>
    setIsSwitchOn(!isSwitchOn)

  const onDeadButtonPress = () => {
    setSelectedPlantId('')
    setDeadSwitch(prev => !prev)
  }


  const TYPES = [
    { label: t("common.all"), value: 'all' },
    { label: t("screens.plant.cactus"), value: 'cactus' },
    { label: t("screens.plant.succulent"), value: 'succulent' },
    { label: t("screens.plant.general"), value: 'general' },
    { label: t("screens.plant.utilitarian"), value: 'utilitarian' }
  ]

  const selectedPlants = deadSwitch ? deadPlants : alivePlants


  const plantNames = useMemo(() => {
    return selectedPlants
      .map((plant) => ({
        label: plant.givenName,
        value: plant.id
      }))
      .sort((a, b) => a.label.localeCompare(b.label)) //Chip sort by name
  }, [selectedPlants])

  const filteredImages = useMemo(() => {
    return Object.entries(images)
      .filter(([plantId]) =>
        selectedPlants.some((plant) => {
          const isMatch = plant.id === plantId;
          const typeMatch = selectedType === "all" || plant.plantType === selectedType;
          const plantMatch = !selectedPlantId || plant.id === selectedPlantId;
          return isMatch && typeMatch && plantMatch;
        })
      )
      .flatMap(([plantId, imageUrls]) => {
        const plant = selectedPlants.find((plant) => plant.id === plantId);
        return imageUrls.map((imageObj) => {
          const uri = typeof imageObj === 'string' ? imageObj : imageObj.uri;
          return {
            uri,
            plantId,
            plantName: plant?.givenName || "Unknown Plant",
            plantType: plant?.plantType || "unknown",
          };
        });
      })
      .sort((a, b) => a.plantName.localeCompare(b.plantName)); //flatlist sort by name
  }, [images, alivePlants, deadPlants, selectedType, selectedPlantId, selectedPlants]);



  return (
    <Surface style={[styles.container, { backgroundColor: 'theme.colors.background' }]}>
      {/* List of pictures, 2colums, touchable pictures*/}
      <View style={styles.switchSearch}>
        <View style={styles.deadSwitchContainer}>
          {isSwitchOn && (
            <Chip
              icon={deadSwitch ? 'flower-outline' : 'skull'}
              onPress={onDeadButtonPress}
              mode='outlined'
            >
              {deadSwitch ? t("screens.gallery.toAlivePlant") : t("screens.gallery.toGraveYard")}
            </Chip>)}
        </View>
        <View style={styles.switchRightContainer}>
          <Text variant="labelMedium" >{t("screens.gallery.search")}</Text>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
          />
        </View>
      </View>

      <FlatList
        data={filteredImages}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={

          isSwitchOn && (<View style={styles.chipContainer}>
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
        renderItem={({ item, index }) => (
          <TouchableOpacity
            ref={(ref) => (imageRefs.current[index] = ref)}
            onPress={() => handleImagePress(item)}
            onLongPress={() => {
              handleLongPress(item.plantId, item.uri, index)
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            }}
          >
            <Card style={styles.card}>
              <Image source={{ uri: item?.uri }} style={styles.cardImage} />
            </Card>
          </TouchableOpacity>
        )}
      />
      {/* setNewCoverImage valikko */}
      <NewCoverImage
        plantId={selectedPlantIdCover}
        imageUri={selectedImage}
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        anchor={menuAnchor}
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
      {!modalVisible && fabVisible &&
        <FloatingButton {...{ deadSwitch, setDeadSwitch }} />}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 2,
    paddingRight: 2,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: "center",
    height: '100%',
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
    height: 175,
    borderRadius: 10,
    width: 175,

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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deadSwitchContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  switchRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
}
);
