import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, Surface, List } from 'react-native-paper'
import { formatDate } from '../../utils/dateUtils'

const CareHistory = ({ careHistory }) => {
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
                title="Care History"
                expanded={expanded}
                onPress={() => setExpanded(!expanded)}
                left={props => <List.Icon {...props} icon="calendar" />}
            >
                {careHistory.length > 0 ? (
                    careHistory.map((entry, index) => (
                        <List.Item
                            key={index}
                            title={formatDate(entry.date)} // ✅ Format here for UI
                            description={`Events: ${entry.events.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(", ")}`}
                            left={props => <List.Icon {...props} icon={getIconForEvents(entry.events)} />}
                        />
                    ))
                ) : (
                    <List.Item title="No care history available." />
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
    },
})

export default CareHistory