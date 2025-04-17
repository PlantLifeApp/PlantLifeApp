import React, { useContext, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { CartesianChart, useChartPressState, Scatter } from 'victory-native';
import { useFont, Circle, Text as SKText } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';
import { ThemeContext } from '../../context/themeContext';

export default function ScatterChartComponent({ dataPoints }) {
    const { theme } = useContext(ThemeContext);
    const inter = require('../../roboto.ttf');
    const font = useFont(inter, 12);
    const tooltipFont = useFont(inter, 18);
    const screenWidth = Dimensions.get('window').width;
    const [chartWidth, setChartWidth] = useState(screenWidth); // fallback

    const { state } = useChartPressState({ x: 0, y: { daysAlive: 0 } });

    const value = useDerivedValue(() => {
        const rawPrice = state?.x?.value?.value;
        const rawDaysAlive = state?.y?.daysAlive?.value.value;
        const price = typeof rawPrice === 'number' && !isNaN(rawPrice) ? rawPrice.toFixed(0) : '0';
        const daysAlive = typeof rawDaysAlive === 'number' && !isNaN(rawDaysAlive) ? rawDaysAlive.toFixed(0) : '0';

        return `price:${price} days:${daysAlive}`;
    }, [state]);

    const textYPosition = useDerivedValue(() => {
        return state.y.daysAlive.position.value - 25;
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

    if (!dataPoints || dataPoints.length === 0) {
        return (
            <View style={styles.emptyText}>
                <Text>No Data available</Text>
            </View>
        );
    }

    const cleanedDataPoints = dataPoints
        .filter(p => typeof p.price === 'number' && !isNaN(p.price) &&
            typeof p.daysAlive === 'number' && !isNaN(p.daysAlive));

    const maxX = Math.max(...cleanedDataPoints.map(p => p.price), 10);
    const maxY = Math.max(...cleanedDataPoints.map(p => p.daysAlive), 10);


    return (
        <View style={{ width: '100%', height: 220 }} onLayout={(e) => {
            setChartWidth(e.nativeEvent.layout.width);
        }}>
            <CartesianChart
                data={cleanedDataPoints}
                xKey="price"
                padding={5}
                yKeys={['daysAlive']}
                chartPressState={state}
                domain={{
                    x: [0, maxX + 10],
                    y: [0, maxY + 2],
                }}

                axisOptions={{
                    font,
                    tickCount: { x: 5, y: 5 },
                    lineColor: theme.colors.outline,
                    labelColor: theme.colors.outline,
                    formatYLabel(value) {
                      return Number.isFinite(value) ? `${Math.round(value)}d` : "";
                    },
                    formatXLabel(value) {
                      return Number.isFinite(value) ? `${Math.round(value)}€` : "";
                    }
                  }}
            >
                {({ points }) => {
                    const scatterPoints = Array.isArray(points.daysAlive)
                        ? points.daysAlive
                        : [];
                    return (
                        <>
                            <Scatter
                                points={scatterPoints}
                                radius={5}
                                color={theme.colors.primary}
                                shape="circle"
                            />
                            <>
                                <Circle
                                    cx={state.x.position}
                                    cy={state.y.daysAlive.position}
                                    r={7}
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
                        </>)
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