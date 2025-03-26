import React, { useContext, useState, useMemo } from "react";
import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Menu, TextInput } from "react-native-paper";
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
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [isTwoColumns, setIsTwoColumns] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [sortOption, setSortOption] = useState("alphabetical");
    const [menuVisible, setMenuVisible] = useState(false);

    const { plants } = usePlants();
    const navigation = useNavigation();

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
                <IconButton
                    icon="magnify"
                    size={24}
                    style={styles.searchIcon}
                    onPress={() => setIsSearchVisible(!isSearchVisible)}
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

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Button onPress={() => setMenuVisible(true)}>
                            {t("common.sort")}
                        </Button>
                    }
                >
                    <Menu.Item onPress={() => { setSortOption("alphabetical"), setMenuVisible(false) }} title={t("common.alphabetical")} />
                    <Menu.Item onPress={() => { setSortOption("latestCare"), setMenuVisible(false) }} title={t("common.latestCare")} />
                </Menu>

                <IconButton
                    icon={isTwoColumns ? "view-grid" : "view-agenda"}
                    size={24}
                    onPress={() => setIsTwoColumns(!isTwoColumns)}
                />
            </View>

            <FlatList
                data={filteredPlants}
                keyExtractor={(item) => item.id}
                key={isTwoColumns ? 'two-columns' : 'one-column'}
                numColumns={isTwoColumns ? 2 : 1}
                columnWrapperStyle={isTwoColumns ? styles.row : null}
                style={{ width: "100%", paddingTop: 10 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={isTwoColumns ? styles.itemContainerSimple : styles.itemContainerComplex}
                        onPress={() => navigation.navigate("PlantScreen", {
                            plantId: item.id,
                            plantPreview: {
                              givenName: item.givenName,
                              scientificName: item.scientificName,
                            }
                          })
                        }
                    >
                        <CardComponent item={item} isTwoColumns={isTwoColumns} />
                    </TouchableOpacity>
                )}
            />

            <View style={styles.addPlantButtonContainer}>
                <IconButton
                    icon="plus"
                    size={24}
                    style={[styles.addIcon, { backgroundColor: theme.colors.primaryContainer }]}
                    onPress={() => setModalVisible(true)}
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
        margin: 10,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: '100%',
        paddingHorizontal: 16,
        marginVertical: 4,
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    itemContainerSimple: {
        flex: 1,
        padding: 10,
        maxWidth: '50%',
        alignSelf: 'stretch',
    },
    itemContainerComplex: {
        flex: 1,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    row: {
        flex: 1,
        justifyContent: "flex-start",
    },
    searchContainer: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        marginVertical: 10,
        width: "100%",
    },
    addPlantButtonContainer: {
        width: "100%",
        bottom: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 0,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchIcon: {
        borderRadius: 50,
        elevation: 5,
    },
    addIcon: {
        borderRadius: 50,
        elevation: 5,
    },
});

export default HomeScreen;