import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, Surface, List } from 'react-native-paper'
import { formatDate } from '../../utils/dateUtils'
import { useTranslation } from "react-i18next"

const CareHistory = ({ careHistory }) => {

    const { t } = useTranslation()

    const [expanded, setExpanded] = useState(false)

    const getIconForEvents = (events) => {
        if (events.includes("watering") && events.includes("fertilization")) {
            return "leaf"
        } else if (events.includes("watering")) {
            return "water"
        } else if (events.includes("fertilization")) {
            return "bottle-tonic"
        } else if (events.includes("pruning")) {
            return "content-cut"
        }
        return "help-circle"
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
                            description={` ${t("screens.plant.event")}: ${entry.events
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