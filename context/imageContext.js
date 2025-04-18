import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./authContext";
import { getUserPlantImages } from "../services/plantService";

const ImagesContext = createContext();

export const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem("plantImages")
        if (storedImages) {
          setImages(JSON.parse(storedImages))
          // console.log("✅ Images loaded from AsyncStorage:", JSON.parse(storedImages));
        }
      } catch (error) {
        console.error("Error loading images from storage: ", error)
      }
    }
    loadImages()
  }, [])

  // Synkronoi kuvat Firestoresta AsyncStorageen sovelluksen käynnistyessä
  useEffect(() => {
    if (user?.uid) {
      syncImagesWithFirestore(user.uid);
    }
  }, [user]);

  const syncImagesWithFirestore = async (userId) => {
    try {
      const fetchedImages = await getUserPlantImages(userId);
      setImages(fetchedImages);
      await AsyncStorage.setItem("plantImages", JSON.stringify(fetchedImages));

    } catch (error) {
      console.error("Error syncing images from Firestore: ", error);
    }
  };

  const addImage = async (plantId, imageUrl, plantType, isDead = false) => {

    try {

      // Haetaan nykyiset kuvat AsyncStoragesta
      const storedImages = await AsyncStorage.getItem("plantImages");
      const images = storedImages ? JSON.parse(storedImages) : {};

      const newImageObject = {
        uri: imageUrl,
        plantId,
        plantType,
        isDead
      }

      // Päivitetään kasvin kuvalista
      const updatedImages = {
        ...images,
        [plantId]: [...(images[plantId] || []), newImageObject]
      };

      // Tallennetaan muutos
      setImages(updatedImages);
      await AsyncStorage.setItem("plantImages", JSON.stringify(updatedImages));

      //console.log("✅ Image saved to AsyncStorage:", updatedImages);
    } catch (error) {
      console.error("Error saving image: ", error)
    }
  };

  const removeImage = async (plantId, imageUri) => {
    try {
      const storageImages = await AsyncStorage.getItem('plantImages')
      const images = storageImages ? JSON.parse(storageImages) : {}

      if (!images[plantId]) return

      const updatedPlantImages = images[plantId].filter((imgObj) => {
        const uri = typeof imgObj === "string" ? imgObj : imgObj?.uri
        return uri !== imageUri
      })

      const updatedImages = {
        ...images,
        [plantId]: updatedPlantImages
      }

      if (updatedPlantImages.length === 0) {
        delete updatedImages[plantId]
      }

      await AsyncStorage.setItem("plantImages", JSON.stringify(updatedImages))
      setImages(updatedImages)
    }catch(error) {
      console.error('Error removing imgage:', error)
    }
  }

  return (
    <ImagesContext.Provider value={{ images, setImages, addImage, removeImage }}>
      {children}
    </ImagesContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImagesContext);
  if (!context) {
    throw new Error("useImages must be used within an ImagesProvider", error);
  }
  return context;
};
