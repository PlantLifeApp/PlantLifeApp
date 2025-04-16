import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { TextInput, Menu, Surface } from 'react-native-paper'
import { useTranslation } from "react-i18next"

const EditPlantDetails = ({ plant, onChange }) => {
    const { t } = useTranslation()

    const plantTypeOptions = [
        { value: "cactus", label: t("screens.plant.cactus") },
        { value: "succulent", label: t("screens.plant.succulent") },
        { value: "general", label: t("screens.plant.general") },
        { value: "utilitarian", label: t("screens.plant.utilitarian") },
    ]

    const [givenName, setGivenName] = useState(plant.givenName)
    const [scientificName, setScientificName] = useState(plant.scientificName ?? null)
    const [plantType, setPlantType] = useState(plant.plantType)
    const [plantPriceInput, setPlantPriceInput] = useState(
        plant.plantPrice != null ? plant.plantPrice.toString().replace(".", ",") : ""
    )
    const [menuVisible, setMenuVisible] = useState(false)
    const selectedLabel = plantTypeOptions.find(opt => opt.value === plantType)?.label || ""


    // onChange receives an object with the new values to pass back to the parent

    const handleGivenNameChange = (value) => {
        setGivenName(value)
        onChange({ givenName: value, scientificName, plantType })
    }
    const handleScientificNameChange = (value) => {
        setScientificName(value)
        onChange({ givenName, scientificName: value, plantType })
    }
    const handlePlantTypeChange = (value) => {
        setPlantType(value)
        onChange({ givenName, scientificName, plantType: value })
    }
    const handlePriceChange = (value) => {
        setPlantPriceInput(value)
    
        const raw = value.replace(",", ".")
        const parsed = parseFloat(raw)
        const cleanValue = isNaN(parsed) ? null : parsed
    
        onChange({
            givenName,
            scientificName,
            plantType,
            plantPrice: cleanValue,
        })
    }


    return (
        <Surface style={styles.container}>
            <TextInput
                label={t("screens.editPlant.givenName")}
                value={givenName}
                onChangeText={handleGivenNameChange}
                style={styles.input}
                mode="outlined"
                returnKeyType='done'
            />

            <TextInput
                label={t("screens.editPlant.scientificName")}
                value={scientificName}
                onChangeText={handleScientificNameChange}
                style={styles.input}
                mode="outlined"
                returnKeyType='done'
            />

            <TextInput
                label={t("screens.editPlant.plantPrice")}
                value={plantPriceInput}
                onChangeText={handlePriceChange}
                style={styles.input}
                mode="outlined"
                keyboardType="decimal-pad"
                returnKeyType='done'
            />

            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                    <TextInput
                        label={t("screens.editPlant.plantType")}
                        value={selectedLabel}
                        editable={false}
                        mode="outlined"
                        onPressIn={() => setMenuVisible(true)}
                        right={<TextInput.Icon icon="menu-down" />}
                        style={styles.input}
                    />
                }
            >
                {plantTypeOptions.map((option) => (
                    <Menu.Item
                        key={option.value}
                        onPress={() => {
                            handlePlantTypeChange(option.value)
                            setMenuVisible(false)
                        }}
                        title={option.label}
                    />
                ))}
            </Menu>
        </Surface>
    )
}

export default EditPlantDetails

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        width: '100%',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        marginBottom: 16,
    },
})