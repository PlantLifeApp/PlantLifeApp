export const loadPlantData = async () => {
    setLoading(true)
    const data = await loadPlantDetails(plantId)
    setPlant(data)
    setLoading(false)
}