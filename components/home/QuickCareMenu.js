import React, { useContext } from "react";
import { View } from "react-native"
import { Menu } from "react-native-paper";
import { AuthContext } from "../../context/authContext";
import { useTranslation } from "react-i18next";
import { addCareEvent } from "../../services/plantService";
import Toast from "react-native-toast-message";
import { usePlants } from "../../context/plantsContext";

export default function QuickCareMenu({ plantId, menuVisible, setMenuVisible, anchorPosition }) {

    const { user } = useContext(AuthContext)
    const { t } = useTranslation()
    const { updatePlantData } = usePlants()

    const handleAddCareEvent = async (eventType) => {
        try {
            await addCareEvent(user.uid, plantId, eventType)
            await updatePlantData(plantId, true)

            Toast.show({
                type: "success",
                text1: t("screens.plant.successfullyAdded"),
                position: "bottom",
                visibilityTime: 2000,
            })
        } catch (error) {
            console.error(`Error adding ${eventType} event:`, error)
            Toast.show({
                type: "error",
                text1: t("screens.plant.errorAdding"),
                position: "bottom",
                visibilityTime: 2000,
            })
        }
    }

    return (
        <>
            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={{ x: anchorPosition.x, y: anchorPosition.y }}
                contentStyle={{ borderRadius: 8 }}
            >
                <Menu.Item
                    onPress={() => {
                        handleAddCareEvent("watering")
                        console.log("Kasteltu");
                        setMenuVisible(false);
                    }}
                    title="Kastele"
                    leadingIcon="water"
                />
                <Menu.Item
                    onPress={() => {
                        handleAddCareEvent("fertilizing")
                        console.log("Lannoitettu");
                        setMenuVisible(false);
                    }}
                    title="Lannoita"
                    leadingIcon="leaf"
                />
                <Menu.Item
                    onPress={() => {
                        handleAddCareEvent("pruning")
                        console.log("Leikattu");
                        setMenuVisible(false);
                    }}
                    title="Leikkaa"
                    leadingIcon="content-cut"
                />
                <Menu.Item
                    onPress={() => {
                        handleAddCareEvent("repotting")
                        console.log("Ruukutettu");
                        setMenuVisible(false);
                    }}
                    title="Ruukuta"
                    leadingIcon="flower"
                />
            </Menu>
        </>
    )
}