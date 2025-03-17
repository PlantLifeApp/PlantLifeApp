import React, { useContext, useState, useEffect, use } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import { AuthContext } from "../context/authContext";
import AddPlantModal from "../components/AddPlantModal";
import { usePlants } from "../context/plantsContext";

const HomeScreen = () => {
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false)
    const { plants } = usePlants();

    return (
        <Surface style={styles.container}>
            <Text variant="headlineLarge">Welcome to PlantLife, {user?.email}!</Text>
            <Button icon="plus" title="Add plant" onPress={() => setModalVisible(true)} />

            <FlatList
                data={plants}
                renderItem={({ item }) => (
                    <Text>{item.givenName}</Text>
                )} />
            <AddPlantModal user={user} visible={modalVisible} onClose={() => setModalVisible(false)} />





        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
})

export default HomeScreen