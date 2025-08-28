import axios from "axios";

const url = "http://localhost:3000/api";

const createChart = async (chartData) => {
    try {
        const response = await axios.post(`${url}/charts`, chartData);
        return response.data;
    } catch (error) {
        console.error("Error creating chart:", error);
    }
};

const getCharts = async () => {
    try {
        const response = await axios.get(`${url}/charts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching charts:", error);
    }
};

const updateChart = async (chartId, updatedData) => {
    try {
        const response = await axios.put(`${url}/charts/${chartId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error updating chart:", error);
    }
};

const deleteChart = async (chartId) => {
    try {
        const response = await axios.delete(`${url}/charts/${chartId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting chart:", error);
    }
};


export { createChart, getCharts, updateChart, deleteChart };