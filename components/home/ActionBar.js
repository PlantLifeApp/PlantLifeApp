import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Dropdown } from "react-native-paper-dropdown";

export default function ActionBar({ isTwoColumns, isReversed, setIsReversed, setIsTwoColumns, searchQuery, setSearchQuery, sortOption, setSortOption, selectedType, setSelectedType }) {
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [typeMenuVisible, setTypeMenuVisible] = useState(false)

    const { t } = useTranslation();

    const TYPES = [
        { label: t("common.all"), value: 'all' },
        { label: t("screens.plant.cactus"), value: 'cactus' },
        { label: t("screens.plant.succulent"), value: 'succulent' },
        { label: t("screens.plant.general"), value: 'general' },
        { label: t("screens.plant.utilitarian"), value: 'utilitarian' }
    ]
    const SORTOPTIONS = [
        { label: t("common.alphabetical"), value: 'alphabetical' },
        { label: t("common.newestPlant"), value: 'newestPlant'},
        { label: t("common.scientificName"), value: 'scientificName' },
        { label: t("common.lastWatered"), value: 'lastWatered' },
        { label: t("common.nextWatering"), value: 'nextWatering' }
    ]

    return (
        <>
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

                <IconButton
                    icon={isTwoColumns ? "view-grid" : "view-agenda"}
                    size={24}
                    onPress={() => setIsTwoColumns(!isTwoColumns)}
                />

                <IconButton icon="menu" size={30} onPress={() => setTypeMenuVisible(!typeMenuVisible)} />
            </View>

            {typeMenuVisible &&
                <View style={styles.sortContainer}>

                    <IconButton
                        icon={isReversed ? "sort-reverse-variant" : "sort-variant"}
                        size={30}
                        onPress={() => setIsReversed(!isReversed)} />

                    <View style={styles.dropdownWrapper} >
                        <Dropdown
                            options={SORTOPTIONS}
                            value={sortOption}
                            onSelect={(value) => {
                                if (value === null || value === undefined) {
                                    setSortOption('alphabetical')
                                } else {
                                    setSortOption(value)
                                }
                            }}
                            style={styles.dropdown}
                            menuContentStyle={styles.dropDownMenu}
                        />
                    </View>

                    <View style={styles.dropdownWrapper} >
                        <Dropdown
                            options={TYPES}
                            value={selectedType}
                            onSelect={(value) => {
                                if (value === null || value === undefined) {
                                    setSelectedType('all')
                                } else {
                                    setSelectedType(value)
                                }
                            }}
                            style={styles.dropdown}
                            menuContentStyle={styles.dropDownMenu}
                        />
                    </View>
                </View>
            }
        </>
    )
}

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
    sortContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginVertical: 4,
    },
    sortIcon: {
        padding: 0,
        margin: 0,
    },
    dropdownWrapper: {
        flex: 1,
        width: '100%'
    },
    dropdown: {
        width: 300,
        paddingHorizontal: 10,
        height: 40,
        textAlignVertical: 'center'
    },
    dropDownMenu: {
        width: '100%',
    },
    searchContainer: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        marginVertical: 10,
        width: "100%",
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
});