/* Notes:
    - Do the translation options
    - Filler data for dates that don't have data
    - Switch years and months for each graph seperately (go back and forth)
    - ChartData should take parameter
    - Repotting data?
*/
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Surface, useTheme, Text, Button, ToggleButton } from 'react-native-paper'
import { useTranslation } from "react-i18next"
import { usePlants } from "../context/plantsContext"
import BarChartComponent from '../components/stats/BarChart.js'
import { Dropdown } from 'react-native-paper-dropdown';
import PieChartComponent from '../components/stats/PieChart.js'
import { LineChart } from 'react-native-chart-kit'
import LineChartComponent from '../components/stats/LineChart.js'

export default function StatsScreen() {
    const theme = useTheme();
    const { t } = useTranslation();
    const plants = usePlants();
    const [careEvents, setCareEvents] = useState({});
    const [filterOption, setFilterOption] = useState('month');
    const [totalWaterings, setTotalWaterings] = useState(0);
    const [totalFertilizings, setTotalFertilizings] = useState(0);
    const [totalPrunings, setTotalPrunings] = useState(0);
    const [totalAlivePlants, setTotalAlivePlants] = useState(0);
    const [totalDeadPlants, setTotalDeadPlants] = useState(0);
    const [chartWateringData, setChartWateringData] = useState([]);
    const [chartFertilizingData, setChartFertilizingData] = useState([]);
    const [chartPruningData, setChartPruningData] = useState([]);
    const [barChartFilterOption, setBarChartFilterOption] = useState('watering');

    const TYPES = [
        { label: 'Daily', value: 'day' },
        { label: 'Monthly', value: 'month' },
        { label: 'Yearly', value: 'year' },
    ];

    const BARCHARTTYPES = [
        { label: '💧', value: 'watering', chartType: chartWateringData },
        { label: '💥', value: 'fertilizing', chartType: chartFertilizingData },
        { label: '✂️', value: 'pruning', chartType: chartPruningData },
    ]


    useEffect(() => {
        const fetchCareHistory = async () => {
            const updatedPlants = await Promise.all(plants.plants.map(async (plant) => {
                const careHistory = plant.careHistory || [];
                return {
                    ...plant,
                    careHistory,
                };
            }));

            const careEvents = {};
            let waterings = 0;
            let fertilizings = 0;
            let prunings = 0;
            let alivePlants = 0;
            let deadPlants = 0;

            updatedPlants.forEach(plant => {
                if (plant.isDead == true) deadPlants++;
                else alivePlants++;
                plant.careHistory.forEach(event => {
                    const date = new Date(event.date.seconds * 1000);
                    const year = date.getFullYear();
                    const month = date.toLocaleString('default', { month: 'long' });
                    const day = date.getDate();

                    if (!careEvents[event.type]) {
                        careEvents[event.type] = {};
                    }
                    if (!careEvents[event.type][year]) {
                        careEvents[event.type][year] = {};
                    }
                    if (!careEvents[event.type][year][month]) {
                        careEvents[event.type][year][month] = {};
                    }
                    if (!careEvents[event.type][year][month][day]) {
                        careEvents[event.type][year][month][day] = 0;
                    }
                    careEvents[event.type][year][month][day]++;
                    if (event.type === 'watering') waterings++;
                    if (event.type === 'fertilizing') fertilizings++;
                    if (event.type === 'pruning') prunings++;
                });
            });

            setTotalWaterings(waterings);
            setTotalFertilizings(fertilizings);
            setTotalPrunings(prunings);
            setTotalAlivePlants(alivePlants);
            setTotalDeadPlants(deadPlants);

            // Populate all dates for years with care events
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

            Object.keys(careEvents).forEach(eventType => {
                Object.keys(careEvents[eventType]).forEach(year => {
                    months.forEach(month => {
                        if (!careEvents[eventType][year][month]) {
                            careEvents[eventType][year][month] = {};
                        }
                        days.forEach(day => {
                            if (!careEvents[eventType][year][month][day]) {
                                careEvents[eventType][year][month][day] = 0;
                            }
                        });
                    });
                });
            });

            // Sort the months and days in the correct order
            Object.keys(careEvents).forEach(eventType => {
                Object.keys(careEvents[eventType]).forEach(year => {
                    const sortedCareEvents = {};
                    months.forEach(month => {
                        if (careEvents[eventType][year][month]) {
                            const sortedDays = Object.keys(careEvents[eventType][year][month]).map(Number).sort((a, b) => a - b);
                            sortedCareEvents[month] = {};
                            sortedDays.forEach(day => {
                                sortedCareEvents[month][day] = careEvents[eventType][year][month][day];
                            });
                        }
                    });
                    careEvents[eventType][year] = sortedCareEvents;
                });
            });

            setCareEvents(careEvents);
        };
        fetchCareHistory();

    }, [plants]);
    useEffect(() => {
        const getChartData = (careEvents, filterOption, careType) => {
            const chartData = {};

            if (!careEvents || !careEvents[careType]) {
                return chartData;
            }

            // Get the current year and month
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });

            if (filterOption === 'year') {
                Object.keys(careEvents[careType]).forEach(year => {
                    let total = 0;
                    Object.keys(careEvents[careType][year]).forEach(month => {
                        Object.keys(careEvents[careType][year][month]).forEach(day => {
                            total += careEvents[careType][year][month][day];
                        });
                    });
                    chartData[year] = total;
                });
            }

            else if (filterOption === 'month') {
                if (careEvents[careType][currentYear]) {
                    Object.keys(careEvents[careType][currentYear]).forEach(month => {
                        let total = 0;
                        Object.keys(careEvents[careType][currentYear][month]).forEach(day => {
                            total += careEvents[careType][currentYear][month][day];
                        });
                        chartData[month] = total;
                    });
                }
            }

            else if (filterOption === 'day') {
                if (careEvents[careType][currentYear] && careEvents[careType][currentYear][currentMonth]) {
                    Object.keys(careEvents[careType][currentYear][currentMonth]).forEach(day => {
                        chartData[day] = careEvents[careType][currentYear][currentMonth][day];
                    });
                }
            }

            return chartData;
        };

        let data = getChartData(careEvents, filterOption, "watering");
        setChartWateringData(data);

        data = getChartData(careEvents, filterOption, "fertilizing");
        setChartFertilizingData(data);

        data = getChartData(careEvents, filterOption, "pruning");
        setChartPruningData(data);

        setBarChartFilterOption(chartWateringData)

    }, [filterOption, careEvents]);

    const renderChart = () => {
        switch (barChartFilterOption) {
            case 'watering':
                return <BarChartComponent param_data={chartWateringData} filterType={filterOption} />;
            case 'fertilizing':
                return <BarChartComponent param_data={chartFertilizingData} filterType={filterOption} />;
            case 'pruning':
                return <BarChartComponent param_data={chartPruningData} filterType={filterOption} />;
            default:
                return <BarChartComponent param_data={chartWateringData} filterType={filterOption} />;
        }
    };
    return (
        <View style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
            <View style={styles.inputContainer}>
                <Dropdown
                    placeholder={t("screens.addPlant.selectType")}
                    options={TYPES}
                    value={filterOption}
                    onSelect={setFilterOption}
                    style={styles.dropdown}
                />
            </View>
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Surface styles={styles.surface}>
                    <Text variant="headlineMedium">General Stats</Text>

                    <Text variant="titleMedium">💧 Waterings: {totalWaterings}</Text>
                    <Text variant="titleMedium">✂️ Prunings: {totalPrunings} </Text>
                    <Text variant="titleMedium">💥 Fertilizings: {totalFertilizings}</Text>
                    <Text variant="titleMedium">🌱 Alive plants: {totalAlivePlants}</Text>
                    <Text variant="titleMedium">💀 Dead plants: {totalDeadPlants}</Text>
                </Surface>

                <Surface styles={styles.surface}>
                    <View style={styles.barChartHeader}>
                        <Text styles={styles.chartTitle} variant="titleMedium"> Stats</Text>
                        {BARCHARTTYPES.map((option) => (
                            <Button
                                key={option.value}
                                mode="contained"
                                onPress={() => {
                                    setBarChartFilterOption(option.value);
                                }}
                            >
                                {option.label}
                            </Button>
                        ))}

                    </View>

                    {renderChart()}
                </Surface>

                <Surface styles={styles.surface}>
                    <Text styles={styles.chartTitle} variant="headlineMedium">Graveyard Stats</Text>
                    <PieChartComponent
                        param_data={{ "Alive": totalAlivePlants, "Dead": totalDeadPlants }}
                    />

                </Surface>
                {/*

                <Surface styles={styles.surface}>
                    <LineChartComponent
                        param_data={filteredWaterings}
                    />
                </Surface>
        */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    chart: {
        width: "100%",
        height: 200,
    },
    container: {
        flexGrow: 1,
        padding: 16,
        gap: 24,
        alignItems: "center",
    },
    centered: {
        paddingTop: 24,
        alignItems: "center",
    },
    surface: {
        padding: 16,
        width: "100%",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    dropdown: {
        width: '100%',
        paddingHorizontal: 10,
        height: 40,
    },
    inputContainer: {
        width: "100%",

    },
    chartTitle: {
        marginleft: 10,
    },
    barChartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})