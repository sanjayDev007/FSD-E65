const express = require("express")
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")

// Middleware
app.use(express.json())
app.use(cors("*"))

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/entri", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Define a simple schema and model
const chartSchema = new mongoose.Schema({
    title: { type: String, required: true },
    data: { type: Array, required: true }
})
const Chart = mongoose.model("Chart", chartSchema)

// CRUD Routes

// Create
app.post("/api/charts", async (req, res) => {
    try {
        const { title, data } = req.body
        const chart = new Chart({ title, data })
        await chart.save()
        res.status(201).json(chart)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Read all
app.get("/api/charts", async (req, res) => {
    const charts = await Chart.find()
    res.json(charts)
})

// Read one
app.get("/api/charts/:id", async (req, res) => {
    try {
        const chart = await Chart.findById(req.params.id)
        if (!chart) return res.status(404).json({ error: "Not found" })
        res.json(chart)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Update
app.put("/api/charts/:id", async (req, res) => {
    try {
        const { title, data } = req.body
        const chart = await Chart.findByIdAndUpdate(req.params.id, { title, data }, { new: true, runValidators: true })
        if (!chart) return res.status(404).json({ error: "Not found" })
        res.json(chart)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Delete
app.delete("/api/charts/:id", async (req, res) => {
    try {
        const chart = await Chart.findByIdAndDelete(req.params.id)
        if (!chart) return res.status(404).json({ error: "Not found" })
        res.json({ message: "Deleted" })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000")
})