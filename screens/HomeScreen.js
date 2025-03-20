import React, { useContext, useState, useEffect, useMemo } from "react";
import { StyleSheet, FlatList, TouchableOpacity, View, TextInput } from "react-native";
import { Text, Button, Switch, IconButton, Menu } from "react-native-paper";
import { AuthContext } from "../context/authContext";
import AddPlantModal from "../components/home/AddPlantModal";
import { usePlants } from "../context/plantsContext";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import CardComponent from '../components/home/CardComponent';
import { ThemeContext } from "../context/themeContext";
import { searchMostRecentWatering } from '../utils/searchWaterUtils';
import { formatDate } from '../utils/dateUtils';

const HomeScreen = () => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [isTwoColumns, setIsTwoColumns] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [sortOption, setSortOption] = useState("alphabetical");
    const [menuVisible, setMenuVisible] = useState(false);

    const { plants } = usePlants();
    const navigation = useNavigation();

    /*
    const loaddata = async (id) => {
        const returndata = await loadPlantDetails(id);
        return returndata;
    };
    */

    const filteredPlants = useMemo(() => {
        return plants
            .filter((item) =>
                item.givenName.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                if (sortOption === "alphabetical") {
                    return a.givenName.localeCompare(b.givenName);
                } else if (sortOption === "latestCare") {
                    const dateA = a.careHistory.length > 0 ? new Date(formatDate(searchMostRecentWatering(a.careHistory))) : new Date(0);
                    const dateB = b.careHistory.length > 0 ? new Date(formatDate(searchMostRecentWatering(b.careHistory))) : new Date(0);
                    return dateB - dateA;
                }
                return 0;
            });
    }, [plants, searchQuery, sortOption]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.switchContainer}>
                <Text>Two Columns</Text>
                <Switch
                    value={isTwoColumns}
                    onValueChange={() => setIsTwoColumns(!isTwoColumns)}
                />
                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button onPress={() => setMenuVisible(true)}>
                            Sort By
                        </Button>
                    }
                >
                    <Menu.Item onPress={() => { setSortOption("alphabetical"), setMenuVisible(false) }} title="Alphabetical" />
                    <Menu.Item onPress={() => { setSortOption("latestCare"), setMenuVisible(false) }} title="Latest Care" />
                </Menu>
            </View>
            <FlatList
                data={filteredPlants}
                keyExtractor={(item) => item.id}
                key={isTwoColumns ? 'two-columns' : 'one-column'}
                numColumns={isTwoColumns ? 2 : 1}
                columnWrapperStyle={isTwoColumns ? styles.row : null}
                style={{ width: "96%" }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={isTwoColumns ? styles.itemContainerSimple : styles.itemContainerComplex}
                        onPress={() => navigation.navigate("PlantScreen", { plantId: item.id })}
                    >
                        <CardComponent item={item} isTwoColumns={isTwoColumns} />
                    </TouchableOpacity>
                )}
            />

            <View style={styles.searchBar}>
                <IconButton
                    icon="plus"
                    size={24}
                    style={styles.addIcon}
                    onPress={() => setModalVisible(true)}
                />
                {isSearchVisible && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder=""
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                )}
                <IconButton
                    icon="magnify"
                    size={24}
                    style={styles.searchIcon}
                    onPress={() => setIsSearchVisible(!isSearchVisible)}
                />
            </View>

            <AddPlantModal user={user} visible={modalVisible} onClose={() => setModalVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "96%",
        marginVertical: 10,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    surface: {
        padding: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 8,
        borderRadius: 8,
    },
    itemContainerSimple: {
        width: "48%",
        marginBottom: 16,
    },
    itemContainerComplex: {
        width: "100%",
        marginBottom: 16,
    },
    row: {
        flex: 1,
        justifyContent: "space-between",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        width: "60%",
    },
    searchBar: {
        width: "100%",
        bottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "space-between",
        height: 0,
    },
    searchInput: {
        flex: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
    },
    searchIcon: {
        backgroundColor: "#fff",
        borderRadius: 50,
        elevation: 5,
    },
    addIcon: {
        backgroundColor: "#fff",
        borderRadius: 50,
        elevation: 5,
    },
});

export default HomeScreen;