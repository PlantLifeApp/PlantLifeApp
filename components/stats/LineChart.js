import React from 'react';
import { LineChart } from "react-native-chart-kit";
import { Dimensions, StyleSheet } from "react-native";

export default function LineChartComponent({ param_data }) {

    const screenWidth = Dimensions.get("window").width;
    // Transform param_data into the format expected by the LineChart
    // const labels = Object.keys(param_data).map(label => label.charAt(0));
    const labels = Object.keys(param_data);
    const dataValues = Object.values(param_data);
    const data = {
        labels: labels,
        datasets: [
            {
                data: dataValues
            }
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#ffffff",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        useShadowColorFromDataset: false, // optional
    };

    return (
        <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
        />
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    chart: {
        width: "100%",
        height: 220,
    },
});