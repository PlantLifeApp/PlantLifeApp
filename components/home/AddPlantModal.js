import React, { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Modal, Surface, Text, TextInput, Portal, Icon } from 'react-native-paper'
import { addPlant, uploadPlantImage } from '../../services/plantService';
import { Dropdown } from 'react-native-paper-dropdown';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker'
import { useImages } from '../../context/imageContext';

export default function AddPlantModal({ user, visible, onClose }) {
    const [plantType, setPlantType] = useState("");
    const [plantNickname, setPlantNickname] = useState("");
    const [scientificName, setScientificName] = useState("");
    const [plantImageUri, setPlantImageUri] = useState(null);

    const { t } = useTranslation()
    const { addImage } = useImages()

    const onCloseFunction = () => {
        // Reset all values to default
        onClose();
        setPlantType("");
        setPlantNickname("");
        setScientificName("");
        setPlantImageUri(null)
    }

    const handleAddPlant = async () => {
        const newPlantId =  await addPlant(plantNickname, scientificName, plantType, plantImageUri, user.uid);

        if (newPlantId && plantImageUri) {
            const imageUrl = await uploadPlantImage(user.uid, newPlantId, plantImageUri, true)  // Upload image to Firestorage

            if (imageUrl) {
                await addImage(newPlantId, imageUrl)    // Add image to asyncstorage
            }
        }

        onCloseFunction();
    }

    const TYPES = [
        { label: 'Cactus', value: 'cactus' },
        { label: 'Succulent', value: 'succulent' },
        { label: 'General', value: 'general' },
        { label: 'Utilitarian', value: 'utilitarian' }
    ]

    const handleOpenCamera = async () => {
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

        if (!result.canceled) {
            setPlantImageUri(result.assets[0].uri)
        }
    }

    return (
        <Portal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequsetClose={onClose}
                style={styles.modalContainer}
            >
                <Surface style={styles.modalSurface}>
                    <Text variant="bodyLarge" style={styles.title}>{t("screens.addPlant.title")}</Text>

                    <TouchableOpacity onPress={handleOpenCamera} style={styles.imagePicker}>
                        {plantImageUri ? (
                            <Image source={{ uri: plantImageUri }} style={styles.imagePreview} />
                        ) : (
                            <Icon source='camera' size={48} color='gray'/>
                        )}
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <Text variant="bodyMedium">{t("screens.addPlant.nickname")}</Text>
                        <TextInput style={styles.textInput} onChangeText={(text) => setPlantNickname(text)}></TextInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text variant="bodyMedium">{t("screens.addPlant.scientificName")}</Text>
                        <TextInput style={styles.textInput} onChangeText={(text) => setScientificName(text)}></TextInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Dropdown
                            placeholder={t("screens.addPlant.selectType")}
                            options={TYPES}
                            value={plantType}
                            onSelect={setPlantType}
                            style={styles.dropdown}
                        />
                    </View>

                    <Button style={styles.button} mode="contained" onPress={handleAddPlant} >{t("screens.addPlant.addButton")}</Button>
                    <Button style={styles.button} mode="contained" onPress={onCloseFunction} >{t("screens.addPlant.cancelButton")}</Button>

                </Surface>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: "center",
        padding: 20,
        width: '100%',
    },
    modalSurface: {
        padding: 16,
        margin: 20,
        borderRadius: 10,
        elevation: 4,
        justifyContent: "center",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textInput: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    button: {
        alignSelf: "stretch",
        marginBottom: 20,
    },
    dropdown: {
        width: '100%',
        paddingHorizontal: 10,
        height: 40,
    },
    imagePicker: {
        width: "100%",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
        borderRadius: 10,
        marginBottom: 20,
    },
    imagePreview: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    imagePlaceholder: {
        fontSize: 16,
        color: "gray",
    },
})