import React, { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../context/themeContext";
import { Text } from 'react-native-paper'
import { CartesianChart, Bar, useChartPressState } from 'victory-native'
import { useFont, Circle, Text as SKText } from "@shopify/react-native-skia";
import { useDerivedValue } from 'react-native-reanimated';
import { useTranslation } from "react-i18next"


export default function BarChartComponent({ param_data, filterType, careType, currentDate }) {
    const { t } = useTranslation()
    const inter = require("../../roboto.ttf");
    const font = useFont(inter, 12)
    const toolTipfont = useFont(inter, 18)
    const { state } = useChartPressState({ x: 0, y: { value: 0 } })
    const { theme } = useContext(ThemeContext)
    const screenWidth = Dimensions.get("window").width
    const MAX_BAR_WIDTH = 20

    useEffect(() => {
        state.y.value.position.value = -20
    }, [filterType, careType, currentDate])

    const labelsRaw = Object.keys(param_data || {})
    const dataValues = Object.values(param_data || {})

    let labels = [...labelsRaw]

    if (filterType === "day") {
        labels = labels.map((label, index) => ((index + 1) % 5 === 0 ? label : ''))
        labels[0] = "1"
    } else if (filterType === "month") {
        labels = labels.map((label) => label.slice(0, 3))
    }

    const data = labels.map((label, index) => ({
        label,
        value: dataValues[index] || 0,
    }))

    const value = useDerivedValue(() => {
        return "" + state.y.value.value.value
    }, [state])

    const textYPosition = useDerivedValue(() => {
        return state.y.value.position.value - 20
    }, [value])

    const textXPosition = useDerivedValue(() => {
        if (!toolTipfont) return 0
        return state.x.position.value - toolTipfont.measureText(value.value).width / 2
    }, [value, toolTipfont])

    let barColor
    switch (careType) {
        case "watering":
            barColor = theme.colors.wateringColor
            break
        case "fertilizing":
            barColor = theme.colors.fertilizingColor
            break
        case "pruning":
            barColor = theme.colors.pruningColor
            break
        default:
            barColor = theme.colors.barChartColor
    }

    function getNextMaxValue(currentMax) {
        const predefined = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]
        for (let val of predefined) {
            if (currentMax <= val) return val
        }
        return currentMax
    }

    if (Object.keys(param_data).length === 0) {
        return (
            <View style={styles.emptyText}>
                <Text>{t('screens.stats.noDataAvailable') || "No data available"}</Text>
            </View>
        )
    }
    return (
        <View style={{ height: 300 }}>
            <CartesianChart
                data={data}
                padding={5}
                xKey='label'
                yKeys={['value']}
                domain={{
                    y: [0, getNextMaxValue(Math.max(...dataValues, 0))],
                }}
                domainPadding={{
                    left: data.length < 5 ? 150 : 9,
                    right: data.length < 5 ? 150 : 15,
                }}
                chartPressState={state}
                axisOptions={{
                    font,
                    tickCount: { y: 10, x: data.length },
                    lineColor: theme.colors.outline,
                    labelColor: theme.colors.outline,
                    formatYLabel(value) {
                        return Number.isInteger(value) ? value.toString() : ""
                    }
                }}
            >
                {({ points, chartBounds }) => (
                    <>
                        <Bar
                            points={points.value}
                            chartBounds={chartBounds}
                            color={barColor}
                            roundedCorners={{ topLeft: 5, topRight: 5 }}
                            animate={{ type: "timing", duration: 500 }}
                            barWidth={Math.min(screenWidth / (data.length * 2), MAX_BAR_WIDTH)}
                        />
                        <SKText
                            x={textXPosition}
                            y={textYPosition}
                            font={toolTipfont}
                            color={theme.colors.primary}
                            text={value}
                        />
                        <Circle
                            cx={state.x.position}
                            cy={state.y.value.position}
                            r={8}
                            color={theme.colors.outline}
                            opacity={0.8}
                        />
                    </>
                )}
            </CartesianChart>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    chart: {
        height: 220,
    },
    emptyText: {
        alignSelf: 'center',

        fontSize: 16,
        height: 220
    },
});