import React, { useContext } from 'react';
import { BarChart } from "react-native-chart-kit";
import { Dimensions, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { ThemeContext } from "../../context/themeContext";

export default function BarChartComponent({ param_data, filterType }) {
    const { isDarkMode } = useContext(ThemeContext)
    const screenWidth = Dimensions.get("window").width;
    // Transform param_data into the format expected by the BarChart
    //const labels = Object.keys(param_data).map(label => label.charAt(0));;
    let labels = Object.keys(param_data)
    const dataValues = Object.values(param_data);

    if (filterType === "day") {
        labels = labels.map((label, index) => ((index + 1) % 5 === 0 ? label : ''));
        labels[0] = "1";
    }
    else if (filterType === "month") {
        labels = labels.map((label) => label.slice(0, 3));
    }
    const data = {
        labels: labels,
        datasets: [
            {
                data: dataValues
            }
        ],

    };


    const chartConfig = {
        backgroundGradientFrom: isDarkMode ? "#333333" : "#ffffff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: isDarkMode ? "#333333" : "#ffffff",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.2,
        useShadowColorFromDataset: false, // optional
    };

    return (
        <BarChart
            style={styles.chart}
            data={data}
            fromZero={true}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
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