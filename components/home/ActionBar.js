import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Menu, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function ActionBar({ isTwoColumns, setIsTwoColumns, searchQuery, setSearchQuery, setSortOption }) {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const { t } = useTranslation();

    return (
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