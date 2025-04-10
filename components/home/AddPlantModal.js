import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Modal, Surface, Text, TextInput, Portal, Icon } from 'react-native-paper'
import { addPlant, uploadPlantImage } from '../../services/plantService';
import { Dropdown } from 'react-native-paper-dropdown';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker'
import { useImages } from '../../context/imageContext';
import Toast from 'react-native-toast-message';

export default function AddPlantModal({ user, visible, onClose }) {
    const [plantType, setPlantType] = useState("");
    const [plantNickname, setPlantNickname] = useState("");
    const [scientificName, setScientificName] = useState("");
    const [plantPrice, setPlantPrice] = useState(null)
    const [plantImageUri, setPlantImageUri] = useState(null);
    const [plantNicknameError, setPlantNicknameError] = useState(false)
    const [plantTypeError, setPlantTypeError] = useState(false)

    const { t } = useTranslation()
    const { addImage } = useImages()

    const TYPES = [
        { label: t("screens.plant.cactus"), value: 'cactus' },
        { label: t("screens.plant.succulent"), value: 'succulent' },
        { label: t("screens.plant.general"), value: 'general' },
        { label: t("screens.plant.utilitarian"), value: 'utilitarian' }
    ]

    const onCloseFunction = () => {
        // Reset all values to default
        onClose()
        setPlantType("")
        setPlantNickname("")
        setScientificName("")
        setPlantPrice(null)
        setPlantImageUri(null)
        setPlantNicknameError(false)
        setPlantTypeError(false)
    }

    const handleAddPlant = async () => {

        if (!plantNickname) {
            setPlantNicknameError(true);
        } else {
            setPlantNicknameError(false);
        }

        if (!plantType) {
            setPlantTypeError(true);
        } else {
            setPlantTypeError(false);
        }
        if (!plantNickname || !plantType) {
            Toast.show({
                type: "error",
                text1: t("screens.addPlant.inputRequired"),
                position: "bottom",
                visibilityTime: 3000,
            })
            return;
        }

        // Format price to number if given by user. If price not numeric, then it must be null
        let formattedPrice = plantPrice 
            ? parseFloat(typeof plantPrice === "string" 
                ? plantPrice.replace(",", ".") 
                : plantPrice)
            : null

            if (isNaN(formattedPrice)) {
            formattedPrice = null
            }

        const newPlantId = await addPlant(plantNickname, scientificName, formattedPrice, plantType, user.uid);

        if (newPlantId && plantImageUri) {
            const imageUrl = await uploadPlantImage(user.uid, newPlantId, plantImageUri, true)  // Upload image to Firestorage

            if (imageUrl) {
                await addImage(newPlantId, imageUrl)    // Add image to asyncstorage
            }
        }

        Toast.show({
            type: "success",
            text1: t("screens.addPlant.addSuccess"),
            position: "bottom",
            visibilityTime: 3000,
        })
        onCloseFunction();
    }

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
                onRequestClose={onClose}
                style={styles.modalContainer}
            >
                <ScrollView>
                    <Surface style={styles.modalSurface}>
                        <Text variant="bodyLarge" style={styles.title}>{t("screens.addPlant.title")}</Text>

                        <TouchableOpacity onPress={handleOpenCamera} style={styles.imagePicker}>
                            {plantImageUri ? (
                                <Image source={{ uri: plantImageUri }} style={styles.imagePreview} />
                            ) : (
                                <Icon source='camera' size={48} color='gray' />
                            )}
                        </TouchableOpacity>

                        <Text variant="bodyMedium">{t("screens.addPlant.nickname")}*</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.textInput, plantNicknameError && styles.errorInput]}
                                onChangeText={(text) => {
                                    setPlantNickname(text)
                                    setPlantNicknameError(false)
                                }}
                            />
                        </View>

                        <Text variant="bodyMedium">{t("screens.addPlant.scientificName")}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => setScientificName(text)}
                            />
                        </View>

                        <Text variant="bodyMedium">{t("screens.addPlant.price")}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.textInput} keyboardType='decimal-pad' onChangeText={(text) => setPlantPrice(text)}></TextInput>
                        </View>

                        <Text variant="bodyMedium">{t("screens.addPlant.type")}*</Text>
                        <View style={[styles.inputContainer, plantTypeError && styles.errorInput]}>
                            <Dropdown
                                placeholder={t("screens.addPlant.selectType")}
                                options={TYPES}
                                value={plantType}
                                onSelect={(value) => {
                                    setPlantType(value)
                                    setPlantTypeError(false)
                                }}
                                style={styles.dropdown}
                            />
                        </View>

                        <Button style={styles.button} mode="contained" onPress={handleAddPlant} >{t("screens.addPlant.addButton")}</Button>
                        <Button style={styles.button} mode="contained" onPress={onCloseFunction} >{t("screens.addPlant.cancelButton")}</Button>

                    </Surface>
                </ScrollView>
            </Modal>
        </Portal >
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
        flex: 1,
        width: "100%",
        //height: 40,
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
    errorInput: {
        borderColor: 'red',
        borderWidth: 1,
    }
})