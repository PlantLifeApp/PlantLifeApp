import React, { useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text } from "react-native";
import { ThemeContext } from "../../context/themeContext";
import { CartesianChart, Line, useChartPressState } from 'victory-native';
import { useFont, Circle, Text as SKText } from "@shopify/react-native-skia";
import { useDerivedValue } from 'react-native-reanimated';
import { useTranslation } from "react-i18next"

export default function LineChartComponent({ param_data }) {
    /* this crashes??? Warning: Error: Rendered more hooks than during the previous render.
        const { t } = useTranslation()
    */
    if (Object.keys(param_data).length === 0) {
        return (
            <View style={styles.emptyText}>
                <Text>No Data available</Text>
            </View>
        );
    }

    const inter = require("../../roboto.ttf");
    const font = useFont(inter, 12);
    const toolTipfont = useFont(inter, 12);

    const { state, isActive } = useChartPressState({ x: 0, y: { value: 0 } });



    const { theme } = useContext(ThemeContext);
    const screenWidth = Dimensions.get("window").width;

    let labels = Object.keys(param_data || {});
    const dataValues = Object.values(param_data || {});

    function getNextMaxValue(currentMax) {
        const predefinedValues = [10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
        for (let value of predefinedValues) {
            if (currentMax <= value) {
                return value;
            }
        }
        return currentMax;
    }



    let data = labels.map((label, index) => ({
        label,
        value: dataValues[index] || 0,
    }));


    const value = useDerivedValue(() => {
        return "" + state.y.value.value.value;
    }, [state]);

    const textYPosition = useDerivedValue(() => {
        return state.y.value.position.value - 20;
    }, [value]);

    const textXPosition = useDerivedValue(() => {
        if (!toolTipfont) {
            return 0;
        }
        return state.x.position.value - toolTipfont.measureText(value.value).width / 2;
    }, [value, toolTipfont]);


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
                    left: data.length < 5 ? 150 : 10,
                    right: data.length < 5 ? 150 : 10,
                }}
                chartPressState={state}
                axisOptions={{
                    font, // Optional: Custom font for axis labels
                    tickCount: { y: 10, x: data.length }, // Number of ticks on each axis
                    lineColor: "gray", // Color of the axis lines
                    labelColor: "black", // Color of the axis labels
                    formatYLabel: (value) => Number.isInteger(value) ? value.toString() : "", // Format Y-axis labels
                    formatXLabel: (label) => label.length > 5 ? label.slice(0, 5) + "..." : label, // Format X-axis labels

                }}
            >
                {({ points }) => {
                    return (
                        <>
                            <Line
                                points={points.value}

                                color="red"
                                strokeWidth={3}
                                animate={{ type: "timing", duration: 500 }}
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
                    );
                }}
            </CartesianChart>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyText: {
        alignSelf: 'center',
        fontSize: 16,
        color: 'gray',
        height: 220,
    },
});