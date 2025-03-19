import React, { useState } from 'react'
import { StyleSheet, View, ToastAndroid } from 'react-native'   // ToastAndroid works only on Android
import { Button, Modal, Surface, Text, TextInput, Menu } from 'react-native-paper'
import { Picker } from 'react-native-web';
import { addPlant } from '../../services/plantService';

export default function AddPlantModal({ user, visible, onClose }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    const [plantType, setPlantType] = useState("");
    const [plantNickname, setPlantNickname] = useState("");
    const [scientificName, setScientificName] = useState("");


    const onCloseFunction = () => {
        // Reseting all values to default
        setMenuVisible(false);
        onClose();
        setPlantType("");
        setPlantNickname("");
        setScientificName("");
    }

    const handleAddPlant = () => {
        addPlant(plantNickname, scientificName, plantType, user);
        onCloseFunction();
        // Toimii vain androidilla
        //ToastAndroid.show("Plant added successfully!", ToastAndroid.SHORT);
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            style={styles.modalContainer}
        >
            <Surface style={styles.modalSurface}>
                <Text>Enter plant details:</Text>
                <View style={styles.modalView}>
                    <Text>Plant Nickname:</Text>
                    <TextInput style={styles.textInput} onChangeText={(text) => setPlantNickname(text)}></TextInput>
                </View>
                <View style={styles.modalView}>
                    <Text>Scientific Name</Text>
                    <TextInput style={styles.textInput} onChangeText={(text) => setScientificName(text)}></TextInput>

                </View>
                <View style={styles.modalView}>
                    <Text>Plant type</Text>
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={<Button onPress={openMenu} >{plantType == "" ? "Show Menu" : plantType}</Button>}>
                        <Menu.Item onPress={() => { setPlantType("cactus"); closeMenu(); }} title="cactus" />
                        <Menu.Item onPress={() => { setPlantType("succulent"); closeMenu(); }} title="succulent" />
                        <Menu.Item onPress={() => { setPlantType("general"); closeMenu(); }} title="general" />
                        <Menu.Item onPress={() => { setPlantType("utilitarian"); closeMenu(); }} title="utilitarian" />
                    </Menu>
                </View>
                <Button mode="contained" title="Add plant" onPress={handleAddPlant} >Add plant</Button>
                <Button mode="contained" title="Close" onPress={onCloseFunction} >Close</Button>
                <Button mode="contained" title="Add picture" onPress={() => { }} >Add picture</Button>

            </Surface>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
    },
    modalSurface: {
        width: '90%',
        height: '70%',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        elevation: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    textInput: {
        minWidth: 200,
    },
})