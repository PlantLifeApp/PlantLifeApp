import React, { createContext, useState, useContext } from "react";

const ImagesContext = createContext();

export const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  const addImage = (uri) => {
    setImages((prevImages) => [...prevImages, uri]);
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
