import React, { useState } from "react"
import { Platform } from "react-native"
import { FAB, useTheme } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const PlantFAB = ({ onAddCareEvent, plant }) => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const theme = useTheme()
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()

    // fab positioning based on OS
    // Android calculates the bottom offset based on the button row
    // iOS calculates based on screen
    const bottomOffset = Platform.OS === "ios"
        ? -32 
        : insets.bottom + 8
    
    return (
        <FAB.Group
            open={open}
            visible={!!plant}
            icon={open ? "close" : "leaf"}
            onStateChange={({ open }) => setOpen(open)}
            actions={[
                {
                    icon: "water",
                    label: t("screens.plant.wateredShort"),
                    onPress: () => onAddCareEvent("watering"),
                },
                {
                    icon: "bottle-tonic",
                    label: t("screens.plant.fertilizedShort"),
                    onPress: () => onAddCareEvent("fertilizing"),
                },
                {
                    icon: "content-cut",
                    label: t("screens.plant.prunedShort"),
                    onPress: () => onAddCareEvent("pruning"),
                },
                {
                    icon: "shovel",
                    label: t("screens.plant.repottedShort"),
                    onPress: () => onAddCareEvent("repotting"),
                },
                {
                    icon: "image-multiple",
                    label: t("screens.plant.viewPhotos"),
                    onPress: () =>
                        navigation.navigate("Gallery", {
                            screen: "GalleryScreen",
                            params: { preselectedPlantID: plant.id },
                          }),
                  },
                {
                    icon: "file-document-edit",
                    label: t("screens.plant.editHistory"),
                    onPress: () => navigation.navigate("EditCareHistory", { plant }),
                },
                {
                    icon: "tools",
                    label: t("screens.plant.editPlant"),
                    onPress: () => navigation.navigate("EditPlant", { plant }),
                },
            ]}
            fabStyle={{
                backgroundColor: theme.colors.secondaryContainer,
                bottom: bottomOffset,
            }}
        />
    )
}

export default PlantFAB