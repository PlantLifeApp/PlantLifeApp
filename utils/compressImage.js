import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (uri) => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress and convert to .jpeg
    );
    return result.uri;
  } catch (error) {
    console.error("Error compressing image:", error);
    return uri; // Return original image if error with compressing
  }
};
