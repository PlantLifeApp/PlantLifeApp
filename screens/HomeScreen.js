import React, { useContext, useState, useEffect, use } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text, Surface, IconButton } from "react-native-paper";
import { AuthContext } from "../context/authContext";
import AddPlantModal from "../components/home/AddPlantModal";
import { usePlants } from "../context/plantsContext";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false)
    const { plants } = usePlants();

    const navigation = useNavigation()

    return (
        <Surface style={styles.container}>
            <Text variant="headlineLarge">Welcome to PlantLife, {user?.email}!</Text>
            <IconButton icon="plus" size={50} onPress={() => setModalVisible(true)} />

            <FlatList
                data={plants}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("PlantScreen", { plantId: item.id })}
                    >
                        <Text style={styles.plantLink}>{item.givenName}</Text>
                    </TouchableOpacity>
                )}
            />

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