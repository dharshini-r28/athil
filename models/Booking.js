const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    seatsBooked: { type: Number, required: true },
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", BookingSchema);
