
/*
    - barChart date not centered
    - Fragment code
*/

import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Surface, useTheme, Text, Button, SegmentedButtons, List } from 'react-native-paper'
import { useTranslation } from "react-i18next"
import { usePlants } from "../context/plantsContext"
import BarChartComponent from '../components/stats/BarChart.js'
import { Dropdown } from 'react-native-paper-dropdown';
import PieChartComponent from '../components/stats/PieChart.js'
import { formatDate } from '../utils/dateUtils.js'
import LineChartComponent from '../components/stats/LineChart.js'


export default function StatsScreen() {
    const theme = useTheme()
    const { t } = useTranslation()
    const plants = usePlants()

    // console.log("🪴 Plants summary from context:");
    // plants.plants.forEach((p) => {
    //   console.log(`• ${p.givenName} (${p.id}) – careHistory length: ${p.careHistory?.length ?? "N/A"}`);
    // })

    const [careEvents, setCareEvents] = useState({})
    const [filterOption, setFilterOption] = useState('month')
    const [totalWaterings, setTotalWaterings] = useState(0)
    const [totalFertilizings, setTotalFertilizings] = useState(0)
    const [totalPrunings, setTotalPrunings] = useState(0)
    const [totalPottings, setTotalPottings] = useState(0)
    const [totalAlivePlants, setTotalAlivePlants] = useState(0)
    const [totalDeadPlants, setTotalDeadPlants] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [chartWateringData, setChartWateringData] = useState([])
    const [chartFertilizingData, setChartFertilizingData] = useState([])
    const [chartPruningData, setChartPruningData] = useState([])
    const [chartPottingsData, setChartPottingsData] = useState([])
    const [barChartFilterOption, setBarChartFilterOption] = useState('watering')
    const [currentDate, setCurrentDate] = useState(new Date())
    const [listOfPurchases, setListOfPurchases] = useState({})

    const TYPES = [
        { label: t('screens.stats.daily'), value: 'day' },
        { label: t('screens.stats.monthly'), value: 'month' },
        { label: t('screens.stats.yearly'), value: 'year' },
    ]

    const BARCHARTTYPES = [
        { label: <List.Icon icon="water" />, value: 'watering', chartType: chartWateringData },
        { label: <List.Icon icon="bottle-tonic" />, value: 'fertilizing', chartType: chartFertilizingData },
        { label: <List.Icon icon="content-cut" />, value: 'pruning', chartType: chartPruningData },
        { label: <List.Icon icon="shovel" />, value: 'pottings', chartType: chartPottingsData }
    ]
    const handlePreviousMonth = () => {
        const newDate = new Date(currentDate)
        newDate.setMonth(currentDate.getMonth() - 1)
        setCurrentDate(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(currentDate)
        newDate.setMonth(currentDate.getMonth() + 1)
        setCurrentDate(newDate)
    }

    const handlePreviousYear = () => {
        const newDate = new Date(currentDate)
        newDate.setFullYear(currentDate.getFullYear() - 1)
        setCurrentDate(newDate)
    }

    const handleNextYear = () => {
        const newDate = new Date(currentDate)
        newDate.setFullYear(currentDate.getFullYear() + 1)
        setCurrentDate(newDate)
    }

    useEffect(() => {

        const fetchCareHistory = async () => {
    
            const updatedPlants = plants.plants.map((plant) => {

                const rawHistory = plant.careHistory || []
                const normalizedHistory = rawHistory.map((event, idx) => {
                    const events = event.events ?? (event.type ? [event.type] : [])
                    const date = event.date?.seconds
                        ? new Date(event.date.seconds * 1000)
                        : event.date instanceof Date
                        ? event.date
                        : null
    
                    if (!events.length || !date) {
                        console.warn(`⚠️ ${plant.givenName} [${idx}] has invalid event`, event)
                    }
    
                    return { date, events }

                }).filter(e => e.date)
    
                return { ...plant, careHistory: normalizedHistory }
            })
    
            const careEvents = {}
            let waterings = 0, fertilizings = 0, prunings = 0, pottings = 0
            let alivePlants = 0, deadPlants = 0
            let price = 0
            const purchases = {}
    
            updatedPlants.forEach(plant => {
                if (plant.isDead) deadPlants++
                else alivePlants++
    
                if (plant.plantPrice && plant.createdAt?.seconds) {
                    const dateFormatted = formatDate(plant.createdAt.seconds * 1000)
                    price += plant.plantPrice
                    purchases[dateFormatted] = (purchases[dateFormatted] || 0) + plant.plantPrice
                }
    
                plant.careHistory.forEach(event => {
                    const date = event.date
                    if (!date) return
                    const year = date.getFullYear()
                    const month = date.toLocaleString('default', { month: 'long' })
                    const day = date.getDate()
    
                    event.events.forEach(type => {
                        careEvents[type] ??= {}
                        careEvents[type][year] ??= {}
                        careEvents[type][year][month] ??= {}
                        careEvents[type][year][month][day] ??= 0
                        careEvents[type][year][month][day]++
    
                        if (type === 'watering') waterings++
                        if (type === 'fertilizing') fertilizings++
                        if (type === 'pruning') prunings++
                        if (type === 'repotting') pottings++
                    })
                })
            })
    
            // Täydentää tyhjät päivät 0:lla
            const monthsStatic = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ]
            const days = Array.from({ length: 31 }, (_, i) => i + 1)
    
            Object.keys(careEvents).forEach(type =>
                Object.keys(careEvents[type]).forEach(year =>
                    monthsStatic.forEach(month => {
                        careEvents[type][year][month] ??= {}
                        days.forEach(day => {
                            careEvents[type][year][month][day] ??= 0
                        })
                    })
                )
            )
    
            // Sortataan päivät oikeaan järjestykseen
            Object.keys(careEvents).forEach(type =>
                Object.keys(careEvents[type]).forEach(year => {
                    const sorted = {}
                    monthsStatic.forEach(month => {
                        if (careEvents[type][year][month]) {
                            const sortedDays = Object.entries(careEvents[type][year][month])
                                .sort(([a], [b]) => Number(a) - Number(b))
                            sorted[month] = Object.fromEntries(sortedDays)
                        }
                    })
                    careEvents[type][year] = sorted
                })
            )
    
            // Päivitetään state
            setCareEvents(careEvents)
            setTotalWaterings(waterings)
            setTotalFertilizings(fertilizings)
            setTotalPrunings(prunings)
            setTotalPottings(pottings)
            setTotalAlivePlants(alivePlants)
            setTotalDeadPlants(deadPlants)
            setTotalPrice(price)
            setListOfPurchases(purchases)
    
        }
    
        fetchCareHistory()

    }, [plants])
    
    useEffect(() => {
        const getChartData = (careEvents, filterOption, careType) => {
            const chartData = {}

            if (!careEvents || !careEvents[careType]) {
                return chartData
            }
            // Get the current year and month
            const currentYear = currentDate.getFullYear()
            const currentMonth = currentDate.toLocaleString('default', { month: 'long' })

            if (filterOption === 'year') {
                Object.keys(careEvents[careType]).forEach(year => {
                    let total = 0
                    Object.keys(careEvents[careType][year]).forEach(month => {
                        Object.keys(careEvents[careType][year][month]).forEach(day => {
                            total += careEvents[careType][year][month][day]
                        })
                    })
                    chartData[year] = total
                })
            }

            else if (filterOption === 'month') {
                if (careEvents[careType][currentYear]) {
                    Object.keys(careEvents[careType][currentYear]).forEach(month => {
                        let total = 0
                        Object.keys(careEvents[careType][currentYear][month]).forEach(day => {
                            total += careEvents[careType][currentYear][month][day]
                        })
                        chartData[month] = total
                    })
                }
            }

            else if (filterOption === 'day') {
                if (careEvents[careType][currentYear] && careEvents[careType][currentYear][currentMonth]) {
                    Object.keys(careEvents[careType][currentYear][currentMonth]).forEach(day => {
                        chartData[day] = careEvents[careType][currentYear][currentMonth][day]
                    })
                }
            }

            return chartData
        }

        let data = getChartData(careEvents, filterOption, "watering")
        setChartWateringData(data)

        data = getChartData(careEvents, filterOption, "fertilizing")
        setChartFertilizingData(data)

        data = getChartData(careEvents, filterOption, "pruning")
        setChartPruningData(data)

        data = getChartData(careEvents, filterOption, "repotting")
        setChartPottingsData(data)

    }, [filterOption, careEvents, currentDate, plants])

    const renderChart = () => {
        switch (barChartFilterOption) {
            case 'watering':
                return <BarChartComponent param_data={chartWateringData} filterType={filterOption} careType={barChartFilterOption} currentDate={currentDate} />
            case 'fertilizing':
                return <BarChartComponent param_data={chartFertilizingData} filterType={filterOption} careType={barChartFilterOption} currentDate={currentDate} />
            case 'pruning':
                return <BarChartComponent param_data={chartPruningData} filterType={filterOption} careType={barChartFilterOption} currentDate={currentDate} />
            case 'pottings':
                return <BarChartComponent param_data={chartPottingsData} filterType={filterOption} careType={barChartFilterOption} currentDate={currentDate} />
            default:
                return <></>
        }
    }

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

                <Surface style={styles.surface}>
                    <Text variant="headlineMedium">{t('screens.stats.overall')}</Text>

                    <Text variant="titleMedium">💧 {t('screens.stats.watering')}: {totalWaterings}</Text>
                    <Text variant="titleMedium">✂️ {t('screens.stats.pruning')}: {totalPrunings}</Text>
                    <Text variant="titleMedium">💥 {t('screens.stats.fertilizing')}: {totalFertilizings}</Text>
                    <Text variant="titleMedium">🪴 {t('screens.stats.repotting')}: {totalPottings}</Text>
                    <Text variant="titleMedium">🌱 {t('screens.stats.alivePlants')}: {totalAlivePlants}</Text>
                    <Text variant="titleMedium">💀 {t('screens.stats.deadPlants')}: {totalDeadPlants}</Text>
                    <Text variant="titleMedium">💰 {t('screens.stats.moneySpent')}: {totalPrice} €</Text>
                </Surface>

                <Surface styles={styles.surface}>
                    <View style={styles.barChartHeader}>
                        {/*<Text styles={styles.chartTitle} variant="titleMedium"> {t('screens.stats.barChartTitle')}</Text>*/}
                        <SegmentedButtons
                            value={barChartFilterOption}
                            onValueChange={setBarChartFilterOption}
                            buttons={BARCHARTTYPES.map((option) => ({
                                value: option.value,
                                label: option.label,
                            }))}
                        />
                    </View>
                    {filterOption === 'day' ?
                        <View style={styles.navigationButtons}>
                            <Button title="Previous Month" onPress={handlePreviousMonth} >{t('screens.stats.previousMonth')}</Button>
                            <Text style={styles.barChartDate}>{formatDate(currentDate)}</Text>

                            <Button title="Next Month" onPress={handleNextMonth} >{t('screens.stats.nextMonth')}</Button>
                        </View>
                        :
                        <View style={styles.navigationButtons}>

                            <Button title="Previous Year" onPress={handlePreviousYear} >{t('screens.stats.previousYear')}</Button>
                            <Text style={styles.barChartDate}>{formatDate(currentDate)}</Text>

                            <Button title="Next Year" onPress={handleNextYear} >{t('screens.stats.nextYear')}</Button>
                        </View>

                    }

                    {renderChart()}
                </Surface>

                <Surface style={styles.surface}>
                    <Text styles={styles.chartTitle} variant="headlineMedium">{t('screens.stats.pieChartTitle')}</Text>
                    <PieChartComponent
                        param_data={{ [t('screens.stats.alive')]: totalAlivePlants, [t('screens.stats.dead')]: totalDeadPlants }}
                    />

                </Surface>

                {/* <Surface style={styles.surface}>
                    <LineChartComponent
                        param_data={listOfPurchases}
                    />
                </Surface> */}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    chart: {
        width: "100%",
        height: 200,
    },
    barChartDate: {
        flex: 1,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        alignSelf: 'center',
    },
    container: {
        flexGrow: 1,
        padding: 16,
        alignItems: "center",
    },
    centered: {
        paddingTop: 24,
        alignItems: "center",
    },
    surface: {
        flex: 1,
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
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
})