import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ImagesContext = createContext();

export const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem("plantImages")
        if (storedImages) {
          setImages(JSON.parse(storedImages))
        }
      } catch (error) {
        console.error("Error loading images from storage: ", error)
      }
    }
    loadImages()
  }, [])

  const addImage = async (plantId, uri) => {
    try {
      const updatedImages = { ...images, [plantId]: uri }
      setImages(updatedImages)
      console.log(updatedImages)
      await AsyncStorage.setItem("plantImages", JSON.stringify(updatedImages))
      //setImages((prevImages) => [...prevImages, uri]);
    } catch (error) {
      console.error("Error saving image: ", error)
    }
  };

  return (
    <ImagesContext.Provider value={{ images, addImage }}>
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
