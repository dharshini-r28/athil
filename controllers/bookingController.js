const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const mongoose = require("mongoose");

const bookBus = async (req, res) => {
    try {
        console.log("Booking request received:", req.body); 

        const { busId } = req.body;
        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ error: "Bus not found" });

        if (bus.availableSeats <= 0) return res.status(400).json({ error: "No seats available" });

        console.log("Bus found:", bus); 
       
        if (!req.userId) return res.status(401).json({ error: "User ID missing in token" });

        const booking = new Booking({ ...req.body, userId: req.userId });
        await booking.save();

       
        bus.availableSeats -= 1;
        await bus.save();

        console.log("Booking successful:", booking); 
        res.json({ message: "Bus booked successfully", booking });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ error: "Error booking bus", details: error.message });
    }
};




const cancelBooking = async (req, res) => {
    try {
        let { id } = req.params;
        
        console.log("Cancel Request for Booking ID:", id);

       
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid booking ID format" });
        }

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        console.log("Booking Found:", booking);

      
        booking.status = "cancelled";
        await booking.save();

       
        console.log("Looking for Bus with ID:", booking.busId);
        const bus = await Bus.findById(booking.busId);
        if (bus) {
            bus.availableSeats += 1;
            await bus.save();
            console.log("Seats Updated. Available Seats:", bus.availableSeats);
        }

        res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling booking:", error.message);
        res.status(500).json({ error: "Error cancelling booking", details: error.message });
    }
};

module.exports = { bookBus, cancelBooking };
