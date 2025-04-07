import React, { useContext, useState, useMemo } from "react";
import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
import { IconButton } from "react-native-paper";
import { AuthContext } from "../context/authContext";
import AddPlantModal from "../components/home/AddPlantModal";
import { usePlants } from "../context/plantsContext";
import { useNavigation } from "@react-navigation/native";
import CardComponent from '../components/home/CardComponent';
import { ThemeContext } from "../context/themeContext";
import { searchMostRecentWatering } from '../utils/searchWaterUtils';
import ActionBar from "../components/home/ActionBar";
import QuickCareMenu from "../components/home/QuickCareMenu";

const HomeScreen = () => {
    const { theme } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);
    const { plants } = usePlants();
    const navigation = useNavigation();
    const { alivePlants } = usePlants();


    const [modalVisible, setModalVisible] = useState(false);
    const [isTwoColumns, setIsTwoColumns] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("alphabetical");
    const [selectedType, setSelectedType] = useState("all")
    const [careMenuVisible, setCareMenuVisible] = useState(false)
    const [selectedPlantId, setSelectedPlantId] = useState(null)
    const [isReversed, setIsReversed] = useState(false)

    const filteredPlants = useMemo(() => {
        const sorted = [...alivePlants]
            .filter((item) =>
                item.givenName.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (selectedType === "all" || item.plantType === selectedType)
            )
            .sort((a, b) => {
                if (sortOption === "alphabetical") {
                    return a.givenName.localeCompare(b.givenName);
                } else if (sortOption === "scientificName") {
                    return a.scientificName.localeCompare(b.scientificName)
                } else if (sortOption === "lastWatered") {
                    const dateA = a.careHistory.length > 0 ? searchMostRecentWatering(a.careHistory) : null;
                    const dateB = b.careHistory.length > 0 ? searchMostRecentWatering(b.careHistory) : null;

                    if (!dateA && !dateB) return 0;
                    if (!dateA) return 1;
                    if (!dateB) return -1;

                    return dateB - dateA;
                } else if (sortOption === "nextWatering") {
                    const dateA = a.nextWatering ? a.nextWatering : null
                    const dateB = b.nextWatering ? b.nextWatering : null

                    if (!dateA && !dateB) return 0;
                    if (!dateA) return 1;
                    if (!dateB) return -1;

                    return dateA - dateB
                } else if (sortOption === "newestPlant") {
                    const dateA = a.createdAt ? a.createdAt : null
                    const dateB = b.createdAt ? b.createdAt : null

                    if (!dateA && ! dateB) return 0
                    if (!dateA) return 1
                    if(!dateB) return -1
                }
                return 0;
            })
        return isReversed ? sorted.reverse() : sorted
    }, [alivePlants, plants, searchQuery, selectedType, sortOption, isReversed]);

    const handleOpenCareMenu = (plantId) => {
        setSelectedPlantId(plantId)
        setCareMenuVisible(true)
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ActionBar
                isTwoColumns={isTwoColumns}
                setIsTwoColumns={setIsTwoColumns}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortOption={sortOption}
                setSortOption={setSortOption}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                isReversed={isReversed}
                setIsReversed={setIsReversed}
            />

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
                        onLongPress={() => handleOpenCareMenu(item.id)}
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
            <QuickCareMenu plantId={selectedPlantId} menuVisible={careMenuVisible} setMenuVisible={setCareMenuVisible} />

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
    addPlantButtonContainer: {
        width: "100%",
        bottom: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 0,
    },
    addIcon: {
        borderRadius: 50,
        elevation: 5,
    },
});

export default HomeScreen;