const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
    expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expert",
    },
    name: String,
    email: String,
    phone: String,
    date: String,
    slot: String,
    notes: String,
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed"],
        default: "Pending",
    },
});
bookingSchema.index(
    { expertId: 1, date: 1, slot: 1 },
    { unique: true }
);
module.exports = mongoose.model("Booking", bookingSchema);