import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Surface, List } from 'react-native-paper'
import { formatDate } from '../../utils/dateUtils'
import { useTranslation } from "react-i18next"

// this component is used to show the care history of a plant
// the events are grouped by date
// it is used in PlantScreen and GraveyardScreen

const CareHistory = ({ careHistory }) => {

    const { t } = useTranslation()
    const [expanded, setExpanded] = useState(false)

    // get icon for different event types
    const getIconForEvents = (events) => {
        const has = (type) => events.includes(type)
        if (has("repotting")) return "shovel"
        if (has("pruning")) return "content-cut"
        if (has("fertilizing")) return "bottle-tonic"
        if (has("watering")) return "water"
        return "help-circle" // default icon if something goes wrong
    }

    return (
        <Surface style={styles.container}>

            <List.Accordion
                title={t("screens.plant.careHistory")}
                expanded={expanded}
                onPress={() => setExpanded(!expanded)}
                left={props => <List.Icon {...props} icon="calendar" />}
            >
                {careHistory.length > 0 ? (
                    careHistory.map((entry, index) => (
                        <List.Item
                            key={index}
                            title={formatDate(entry.date)} //format for UI
                            description={`${t("screens.plant.event")}: ${entry.events
                                .map(e => t(`screens.plant.${e === "fertilizing" ? "fertilization" : e}`, e))
                                .join(", ")}`}
                            left={props => <List.Icon {...props} icon={getIconForEvents(entry.events)} />}
                        />
                    ))
                ) : (
                    <List.Item title={t("screens.plant.noCareHistory")} />
                )}
            </List.Accordion>

        </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        width: '100%',
        marginTop: 8,
        marginBottom: 16
    },
})

export default CareHistory