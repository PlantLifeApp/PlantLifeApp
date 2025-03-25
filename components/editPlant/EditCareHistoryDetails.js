import React from "react"
import { View, StyleSheet } from "react-native"
import { Surface, Text, IconButton } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { formatDate } from "../../utils/dateUtils"

const typeEmoji = {
  watering: "💧",
  fertilizing: "💥",
  pruning: "✂️",
  repotting: "🪴",
}

const EditCareHistoryDetails = ({ careHistory, onDelete }) => {

  const { t } = useTranslation()

    // group by date string: { "2021-08-01": [entry1, entry2], "2021-08-02": [entry3, entry4] }
    // this separate function is needed instead of the groupedHistory array in PlantDetails because the individual care events need to be deletable aka have a unique id

    const grouped = careHistory.reduce((acc, entry) => {
      const dateKey = entry.date.toISOString().split("T")[0]
      if (!acc[dateKey]) acc[dateKey] = [] // acc is the accumulator, aka the object we are building
      acc[dateKey].push(entry)
      return acc
    }, {})

     // sort dates descending
     const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a))


    return (
      <>
        {sortedDates.map((dateKey) => (
          <Surface key={dateKey} style={styles.itemSurface}>
            <Text variant="titleMedium" style={styles.dateHeading}>{formatDate(new Date(dateKey))}</Text>
  
            {grouped[dateKey].map((entry) => (
              <View key={entry.id} style={styles.entryRow}>
                <Text variant="bodyLarge" style={styles.entryText}>
                  {typeEmoji[entry.type] || "❓"} {t(`screens.editCareHistory.${entry.type}`)}
                </Text>
                <IconButton icon="delete" style={{margin:0}} onPress={() => onDelete(entry.id)} />
              </View>
            ))}
          </Surface>
        ))}
      </>
    )
  
}

export default EditCareHistoryDetails

const styles = StyleSheet.create({
  itemSurface: {
    padding: 16,
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
  dateHeading: {
    marginBottom: 8,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

})