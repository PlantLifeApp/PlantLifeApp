import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, Surface, Text } from "react-native";
import { ThemeContext } from "../../context/themeContext";
import { CartesianChart, Bar, useChartPressState } from 'victory-native'
import { useFont, LinearGradient, Circle, vec, Text as SKText } from "@shopify/react-native-skia";
import { useDerivedValue } from 'react-native-reanimated';
import { useTranslation } from "react-i18next"


export default function BarChartComponent({ param_data, filterType, careType, currentDate }) {
    /* this crashes??? Warning: Error: Rendered more hooks than during the previous render.
      const { t } = useTranslation()
  */
    if (Object.keys(param_data).length === 0) {
        return (
            <View style={styles.emptyText}>
                <Text>No Data available</Text>
            </View>
        )
    }

    const inter = require("../../roboto.ttf");
    const font = useFont(inter, 12)
    const toolTipfont = useFont(inter, 12)

    useEffect(() => {

        if (state && state.reset) {
            state.reset();
        }

    }, [filterType, careType, currentDate])

    const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });


    const { theme } = useContext(ThemeContext);
    const screenWidth = Dimensions.get("window").width;
    const MAX_BAR_WIDTH = 20;

    let labels = Object.keys(param_data || {});
    const dataValues = Object.values(param_data || {});

    function getNextMaxValue(currentMax) {
        const predefinedValues = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000]; // Define your specific max values
        for (let value of predefinedValues) {
            if (currentMax <= value) {
                return value; // Return the next highest value
            }
        }
        return currentMax; // If no predefined value is higher, return the current max
    }



    if (filterType === "day") {
        labels = labels.map((label, index) => ((index + 1) % 5 === 0 ? label : ''));
        labels[0] = "1";
    } else if (filterType === "month") {
        labels = labels.map((label) => label.slice(0, 3));
    }


    let data = labels.map((label, index) => ({
        label,
        value: dataValues[index] || 0,
    }));

    const value = useDerivedValue(() => {

        return "" + state.y.value.value.value
    }, [state])

    const textYPosition = useDerivedValue(() => {
        return state.y.value.position.value - 20
    }, [value])


    const textXPosition = useDerivedValue(() => {
        if (!toolTipfont) {
            return 0
        }

        return state.x.position.value - toolTipfont.measureText(value.value).width / 2
    }, [value, toolTipfont])


    // Determine bar color based on careType
    let barColor
    switch (careType) {
        case "watering":
            barColor = theme.colors.wateringColor;
            break;
        case "fertilizing":
            barColor = theme.colors.fertilizingColor;
            break;
        case "pruning":
            barColor = theme.colors.pruningColor;
            break;
        default:
            barColor = theme.colors.barChartColor;
    }
    return (
        <View style={{ height: 300 }}>
            <CartesianChart
                data={data}
                padding={5}
                xKey='label'
                yKeys={['value']}
                domain={{
                    y: [0, getNextMaxValue(Math.max(...dataValues, 0))], // Dynamically set max value
                }}
                domainPadding={{
                    left: data.length < 5 ? 150 : 10, // Increase padding when data length is below 5
                    right: data.length < 5 ? 150 : 10,
                }}
                chartPressState={state}


                axisOptions={{
                    font,
                    tickCount: { y: 10, x: (data.length) },
                    lineColor: "gray",
                    labelColor: "black",
                    formatYLabel(value) {

                        return Number.isInteger(value) ? value.toString() : "";
                    }
                }}

            >
                {({ points, chartBounds }) => {
                    return (
                        <>
                            <Bar
                                points={points.value}
                                chartBounds={chartBounds}
                                color={barColor}
                                roundedCorners={{ topLeft: 5, topRight: 5 }}
                                animate={{ type: "timing", duration: 500 }}
                                barWidth={Math.min(screenWidth / (data.length * 2), MAX_BAR_WIDTH)}
                            />

                            <>
                                <SKText
                                    x={textXPosition}
                                    y={textYPosition}
                                    font={toolTipfont}
                                    color="black"
                                    text={value}
                                />
                                <Circle
                                    cx={state.x.position}
                                    cy={state.y.value.position}
                                    r={8}
                                    color={"grey"}
                                    opacity={0.8}
                                />
                            </>
                        </>
                    )
                }}
            </CartesianChart>
        </View >
    )
    /* Old barchart using react-native-chart-kit
    return (
        <View style={styles.container}>
            {dataValues.length === 0 && (
                <Text style={styles.emptyText}>No data available</Text>
            )}
            <BarChart
                style={styles.chart}
                data={data}
                fromZero={true}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                withHorizontalLabels={dataValues.length > 0 ? true : false}
                withInnerLines={false}
            />
        </View>
    );
    */
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
        color: 'gray',
        height: 220
    },
});