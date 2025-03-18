import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Surface, List } from 'react-native-paper';

const PlantDetails = ({ plant, careHistory }) => {
    const [expanded, setExpanded] = useState(false);

    // Function to determine the correct icon
    const getIconForEvents = (events) => {
        if (events.includes("watering") && events.includes("fertilization")) {
            return "leaf"; // Watering + Fertilizing → Leaf icon 🌿
        } else if (events.includes("watering")) {
            return "water"; // Watering only → Water droplet icon 💧
        } else if (events.includes("fertilization")) {
            return "bottle-tonic"; // Fertilizing only → Plant food bottle 🌱
        } else if (events.includes("pruning")) {
            return "content-cut"; // Pruning only → Scissors ✂️
        }
        return "help-circle"; // Default if unknown event
    };

    return (
        <Surface style={styles.detailsContainer}>
            <Text variant="bodyLarge">Type: {plant.plantType}</Text>

            {/* Collapsible Care History */}
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
                            title={entry.date} // Display the date
                            description={`Events: ${entry.events.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(", ")}`}
                            left={props => <List.Icon {...props} icon={getIconForEvents(entry.events)} />}
                        />
                    ))
                ) : (
                    <List.Item title="No care history available." />
                )}
            </List.Accordion>
        </Surface>
    );
};

const styles = StyleSheet.create({
    detailsContainer: {
        padding: 16,
        width: '100%',
    },
});

export default PlantDetails;