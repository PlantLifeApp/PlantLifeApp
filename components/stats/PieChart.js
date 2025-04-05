import React, { useContext } from 'react';
import { PieChart } from "react-native-chart-kit";
import { Dimensions, StyleSheet } from "react-native";
import { ThemeContext } from "../../context/themeContext";


export default function PieChartComponent({ param_data }) {
    const { isDarkMode } = useContext(ThemeContext)

    const screenWidth = Dimensions.get("window").width;

    const ColorsArray = [
        "#C8E6C9", // Light Green
        "#FFCDD2", // Light Red
    ];
    const legendFontColor = isDarkMode ? "#FFFFFF" : "#000000";

    const data = Object.keys(param_data).map((key, index) => ({
        name: key,
        state: param_data[key],
        color: ColorsArray[index % ColorsArray.length],
        legendFontColor: legendFontColor,
        legendFontSize: 15
    }));

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#ffffff",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        useShadowColorFromDataset: false, // optional
        fillShadowGradientToOffset: 0,
    };

    return (
        <PieChart
            style={styles.chart}
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor={"state"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
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