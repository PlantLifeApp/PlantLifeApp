import React from "react"
import { View, StyleSheet } from "react-native"
import { Surface, Text, IconButton } from "react-native-paper"
import { useTranslation } from "react-i18next"
import { formatDate } from "../../utils/dateUtils"

const EditCareHistoryDetails = ({ careHistory, onDelete }) => {
  const { t } = useTranslation()

  //console.log(careHistory)

  return (
    <>
      {careHistory.map((entry) => (
        <Surface key={`${entry.id}-${entry.type}-${entry.date.getTime()}`} style={styles.itemSurface}>
          <View style={styles.itemRow}>
            <Text variant="titleSmall">{formatDate(entry.date)}</Text>
            <IconButton
              icon="delete"
              onPress={() => onDelete(entry.id)}
            />
          </View>
          <Text variant="bodyMedium">{t(`screens.editCareHistory.${entry.type}`)}</Text>
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
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
})
