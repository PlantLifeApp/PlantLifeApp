import React, { useEffect, useState, useContext } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Text as RNText } from 'react-native'
import { Text, ActivityIndicator, Surface, Button } from 'react-native-paper'
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { AuthContext } from '../context/authContext'
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import PlantDetails from "../components/plant/PlantDetails"

const db = getFirestore()

const PlantScreen = ({ route, navigation }) => {

    const { plantId } = route.params
    const { user } = useContext(AuthContext)

    const [plant, setPlant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [careHistory, setCareHistory] = useState([])

    const { t } = useTranslation()

    useEffect(() => {

        const fetchPlantData = async () => {
            try {
                if (!user) {
                    console.error("User not found in AuthContext");
                    return;
                }

                // Fetch the plant document
                const plantRef = doc(db, "users", user.uid, "plants", plantId);
                const plantSnap = await getDoc(plantRef);

                if (plantSnap.exists()) {
                    const plantData = { id: plantSnap.id, ...plantSnap.data() };
                    setPlant(plantData);
                } else {
                    console.error("No such plant found!");
                }

                // Fetch care history subcollection
                const careHistoryRef = collection(db, "users", user.uid, "plants", plantId, "careHistory");
                const careHistorySnap = await getDocs(careHistoryRef);
                const careEntries = careHistorySnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // ✅ Sort by date (newest first)
                careEntries.sort((a, b) => b.date.seconds - a.date.seconds)
                
            // ✅ Group events by date
            const groupedHistory = {};
            careEntries.forEach((entry) => {
                const dateStr = new Date(entry.date.seconds * 1000).toLocaleDateString(); // Format date

                if (!groupedHistory[dateStr]) {
                    groupedHistory[dateStr] = { date: dateStr, events: [] };
                }
                groupedHistory[dateStr].events.push(entry.type);
            });

            // Convert object back to sorted array
            const sortedGroupedHistory = Object.values(groupedHistory);

            setCareHistory(sortedGroupedHistory);

            } catch (error) {
                console.error("Error fetching plant or care history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlantData();

    }, [plantId, user]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        )
    }

    if (!plant) {
        return (
            <View style={styles.centered}>
                <Text variant="headlineMedium">{t("screens.plant.plantNotFound")}.</Text>
            </View>
        )
    }

    return (

        <ScrollView contentContainerStyle={styles.container}>
            
            <Surface style={styles.surface}>
                <Text variant="headlineMedium">{plant.givenName}</Text>
                <Text variant="bodyLarge" style={{fontStyle: "italic"}}>{plant.scientificName}</Text>
                {/* <RNText style={styles.italicised}>{plant.scientificName}</RNText> */}
            </Surface>

            <PlantDetails plant={plant} careHistory={careHistory} />

        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f4f4f4',
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    surface: {
        padding: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    }
})

export default PlantScreen