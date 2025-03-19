import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Modal, Surface, Text, TextInput, Portal } from 'react-native-paper'
import { addPlant } from '../../services/plantService';
import { Dropdown } from 'react-native-paper-dropdown';

export default function AddPlantModal({ user, visible, onClose }) {
    const [plantType, setPlantType] = useState("");
    const [plantNickname, setPlantNickname] = useState("");
    const [scientificName, setScientificName] = useState("");

    const onCloseFunction = () => {
        // Reset all values to default
        onClose();
        setPlantType("");
        setPlantNickname("");
        setScientificName("");
    }

    const handleAddPlant = () => {
        addPlant(plantNickname, scientificName, plantType, user);
        onCloseFunction();
    }

    const TYPES = [
        { label: 'Cactus', value: 'cactus' },
        { label: 'Succulent', value: 'succulent' },
        { label: 'General', value: 'general' },
        { label: 'Utilitarian', value: 'utilitarian' }
    ]

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
                    <Text variant="bodyLarge" style={styles.title}>Enter plant details:</Text>

                    <View style={styles.inputContainer}>
                        <Text variant="bodyMedium">Plant Nickname:</Text>
                        <TextInput style={styles.textInput} onChangeText={(text) => setPlantNickname(text)}></TextInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text variant="bodyMedium">Scientific Name</Text>
                        <TextInput style={styles.textInput} onChangeText={(text) => setScientificName(text)}></TextInput>
                    </View>

                    <View style={styles.inputContainer}>
                        <Dropdown
                            placeholder='Select Type'
                            options={TYPES}
                            value={plantType}
                            onSelect={setPlantType}
                            style={styles.dropdown}
                        />
                    </View>
                    
                    <Button style={styles.button} mode="contained" onPress={handleAddPlant} >Add plant</Button>
                    <Button style={styles.button} mode="contained" onPress={onCloseFunction} >Close</Button>

                </Surface>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        //flexGrow: 1,
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
})