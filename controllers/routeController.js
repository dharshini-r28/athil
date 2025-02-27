const Route = require("../models/Route");

const addRoute = async (req, res) => {
    try {
        const route = new Route(req.body);
        await route.save();
        res.json({ message: "Route added successfully", route });
    } catch (error) {
        res.status(500).json({ error: "Error adding route" });
    }
};


const updateRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!route) return res.status(404).json({ error: "Route not found" });

        res.json({ message: "Route updated successfully", route });
    } catch (error) {
        res.status(500).json({ error: "Error updating route" });
    }
};


const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const route = await Route.findByIdAndDelete(id);

        if (!route) return res.status(404).json({ error: "Route not found" });

        res.json({ message: "Route deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete route" });
    }
};

module.exports = { addRoute, updateRoute, deleteRoute };
