const Bus = require("../models/Bus");
const mongoose = require("mongoose");

const addBus = async (req, res) => {
    try {
        const { name, number, seats, availableSeats, routeId } = req.body;

        if (!name || !number || !seats || !availableSeats || !routeId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const bus = new Bus({ name, number, seats, availableSeats, routeId });
        await bus.save();

        res.status(201).json({ message: "Bus added successfully", bus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add bus" });
    }
};



const updateBus = async (req, res) => {
    try {
        let { id } = req.params;
        id = id.replace(":", "").trim(); 

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid bus ID format" });
        }

        const { name, number, seats, availableSeats, routeId } = req.body;

        const bus = await Bus.findByIdAndUpdate(
            id,
            { name, number, seats, availableSeats, routeId },
            { new: true }
        );

        if (!bus) return res.status(404).json({ error: "Bus not found" });

        res.json({ message: "Bus updated successfully", bus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update bus" });
    }
};


const deleteBus = async (req, res) => {
    try {
        const { id } = req.params;
        const bus = await Bus.findByIdAndDelete(id);

        if (!bus) return res.status(404).json({ error: "Bus not found" });

        res.json({ message: "Bus deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete bus" });
    }
};


const searchBuses = async (req, res) => {
    try {
        const { routeId } = req.query;
        const query = {};

        if (routeId) query.routeId = routeId;

        const buses = await Bus.find(query);

        if (buses.length === 0) return res.status(404).json({ message: "No buses found" });

        res.json(buses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching buses" });
    }
};

module.exports = { addBus, updateBus, deleteBus, searchBuses };
