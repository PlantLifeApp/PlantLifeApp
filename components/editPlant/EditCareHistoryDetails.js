import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import { Surface, Text, IconButton } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { formatDate } from "../../utils/dateUtils"
import DateTimePickerModal from "react-native-modal-datetime-picker"

// emoji for different care types
// this is used to show the type of care in the care history
const typeEmoji = {
  watering: "💧",
  fertilizing: "💥",
  pruning: "✂️",
  repotting: "🪴",
}
// this component is used to show the care history of a plant
// it is a list of care events that the user can edit or delete
// it is a child of the EditCareHistoryScreen

const EditCareHistoryDetails = ({ careHistory, onDelete, onEditDate }) => {
  const { t } = useTranslation()

  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)

  const showDatePicker = (entry) => {
    setSelectedEntry(entry)
    setDatePickerVisible(true)
  }

  const hideDatePicker = () => {
    setSelectedEntry(null)
    setDatePickerVisible(false)
  }

  const handleConfirm = (newDate) => {
    if (selectedEntry) {
      onEditDate(selectedEntry.id, newDate)
    }
    hideDatePicker()
  }

  // group care history by date
  // this is used to show the care history in a list
  const grouped = careHistory.reduce((acc, entry) => {
    const dateKey = entry.date.toISOString().split("T")[0]
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(entry)
    return acc
  }, {})

  // sort the dates in descending order
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a))

  return (
    <>
      {sortedDates.map((dateKey) => (
        <Surface key={dateKey} style={styles.itemSurface}>
          <Text variant="titleMedium" style={styles.dateHeading}>
            {formatDate(new Date(dateKey))}
          </Text>

          {grouped[dateKey].map((entry) => (
            <View key={entry.id} style={styles.entryRow}>
              <Text variant="bodyLarge" style={styles.entryText}>
                {typeEmoji[entry.type] || "❓"} {t(`screens.editCareHistory.${entry.type}`)}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon="pencil"
                  style={{ margin: 0 }}
                  onPress={() => showDatePicker(entry)}
                />
                <IconButton
                  icon="delete"
                  style={{ margin: 0 }}
                  onPress={() => onDelete(entry.id)}
                />
              </View>
            </View>
          ))}
        </Surface>
      ))}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedEntry?.date || new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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