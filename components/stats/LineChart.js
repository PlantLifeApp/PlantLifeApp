import React, { useContext, useState } from 'react';
import { Dimensions, StyleSheet, View } from "react-native";
import { ThemeContext } from "../../context/themeContext";
import { CartesianChart, Line, useChartPressState, Scatter } from 'victory-native';
import { useFont, Circle, Text as SKText } from "@shopify/react-native-skia";
import { useDerivedValue } from 'react-native-reanimated';
import { useTranslation } from "react-i18next"
import { Text } from 'react-native-paper'

export default function LineChartComponent({ param_data }) {
    const { t } = useTranslation()
    const inter = require("../../roboto.ttf");
    const font = useFont(inter, 12);
    const tooltipFont = useFont(inter, 18);
    const [chartWidth, setChartWidth] = useState(screenWidth); // fallback

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



    let data = labels.map((label, index) => {
        const [day, month, year] = label.split('/');
        const date = new Date(`${year}-${month}-${day}`);

        const options = labels.length > 3
            ? { month: 'short', year: 'numeric' }
            : { month: 'short' };

        const formattedLabel = date.toLocaleDateString(options);

        return {
            label: formattedLabel,
            value: dataValues[index] || 0,
        };
    });


    const value = useDerivedValue(() => {
        return "" + state.y.value.value.value;
    }, [state]);

    const textYPosition = useDerivedValue(() => {
        return state.y.value.position.value - 25;
    }, [value]);

    const textXPosition = useDerivedValue(() => {
        if (!tooltipFont) return 0;
        const measuredWidth = tooltipFont.measureText(value.value).width;
        const rawX = state.x.position.value;

        let left = rawX - measuredWidth / 2;
        let right = rawX + measuredWidth / 2;
        const padding = 30;
        if (left < padding) {
            return padding;
        } else if (right > chartWidth - padding) {
            return chartWidth - measuredWidth - padding;
        }

        return left;
    }, [value, tooltipFont]);

    if (Object.keys(param_data).length === 0) {
        return (
            <View style={styles.emptyText}>
                <Text>{t('screens.stats.noData') || "No data available"}</Text>
            </View>
        );
    }


    return (
        <View style={{ width: '100%', height: 220 }} onLayout={(e) => {
            setChartWidth(e.nativeEvent.layout.width);
        }}>

            <CartesianChart
                data={data}
                xKey="label"
                yKeys={['value']}
                domain={{
                    y: [0, getNextMaxValue(Math.max(...dataValues, 0))],
                }}

                chartPressState={state}
                axisOptions={{
                    font,
                    tickCount: { y: 10, x: data.length - 1 },
                    lineColor: theme.colors.outline,
                    labelColor: theme.colors.outline,
                }}
            >
                {({ points }) => (
                    <>
                        <Line
                            points={points.value}
                            color={theme.colors.primary}
                            strokeWidth={3}
                            animate={{ type: 'timing', duration: 300 }}
                        />
                        <Scatter
                            points={points.value}
                            radius={5}
                            color={theme.colors.primary}
                            shape="circle"
                        />
                        <>
                            <Circle
                                cx={state.x.position}
                                cy={state.y.value.position}
                                r={8}
                                color={theme.colors.primary}
                            />
                            <SKText
                                text={value}
                                x={textXPosition}
                                y={textYPosition}
                                font={tooltipFont}
                                color={theme.colors.onBackground}
                            />
                        </>
                    </>
                )}
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