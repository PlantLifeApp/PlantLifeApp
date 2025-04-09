// components/plant/CareFAB.js

import React, { useState } from "react"
import { FAB, useTheme } from "react-native-paper"
import { useTranslation } from "react-i18next"

const CareFAB = ({ onAddCareEvent }) => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const theme = useTheme()

    return (
        <FAB.Group
            open={open}
            visible={true}
            icon={open ? "close" : "plus"}
            onStateChange={({ open }) => setOpen(open)}
            actions={[
                {
                    icon: "water",
                    label: t("screens.plant.wateredShort"),
                    onPress: () => onAddCareEvent("watering"), 
                    style: { marginBottom: 8 },
                },
                {
                    icon: "bottle-tonic",
                    label: t("screens.plant.fertilizedShort"),
                    onPress: () => onAddCareEvent("fertilizing"),                    
                    style: { marginBottom: 8 },
                },
                {
                    icon: "content-cut",
                    label: t("screens.plant.prunedShort"),
                    onPress: () => onAddCareEvent("pruning"),
                    style: { marginBottom: 8 },
                },
                {
                    icon: "shovel",
                    label: t("screens.plant.repottedShort"),
                    onPress: () => onAddCareEvent("repotting"),
                    style: { marginBottom: 20 },
                },
            ]}
            fabStyle={{
                backgroundColor: theme.colors.secondaryContainer,
                bottom: 28,
            }}

        />
    )
}

export default CareFAB