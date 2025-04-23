export const getChartData = (careEvents, filterOption, careType, currentDate) => {
    const chartData = {}

    if (!careEvents || !careEvents[careType]) {
        return chartData
    }

    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' })

    if (filterOption === 'year') {
        for (const year in careEvents[careType]) {
            let total = 0
            for (const month in careEvents[careType][year]) {
                for (const day in careEvents[careType][year][month]) {
                    total += careEvents[careType][year][month][day]
                }
            }
            chartData[year] = total
        }
    }

    else if (filterOption === 'month') {
        const yearData = careEvents[careType][currentYear]
        if (yearData) {
            for (const month in yearData) {
                let total = 0
                for (const day in yearData[month]) {
                    total += yearData[month][day]
                }
                chartData[month] = total
            }
        }
    }

    else if (filterOption === 'day') {
        const monthData = careEvents[careType][currentYear]?.[currentMonth]
        if (monthData) {
            for (const day in monthData) {
                chartData[day] = monthData[day]
            }
        }
    }

    return chartData
}