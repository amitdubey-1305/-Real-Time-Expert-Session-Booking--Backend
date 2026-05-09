const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
    try {
        const { expertId, name, email, phone, date, slot, notes } = req.body;

        // Check if the slot is already booked
        const existingBooking = await Booking.findOne({ expertId, date, slot });
        if (existingBooking) {
            return res.status(400).json({ message: "Slot already booked" });
        }

        const newBooking = new Booking({
            expertId,
            name,
            email,
            phone,
            date,
            slot,
            notes
        });

        await newBooking.save();

        // Emit real-time update that the slot is booked
        const io = req.app.get("io");
        if (io) {
            io.emit("slotBooked", {
                expertId,
                date,
                slot
            });
        }

        res.status(201).json({
            success: true,
            data: newBooking
        });
    } catch (error) {
        // Handle unique index error if race condition occurs
        if (error.code === 11000) {
            return res.status(400).json({ message: "Slot already booked" });
        }
        console.error("Error in createBooking:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const bookings = await Booking.find({ email }).populate("expertId", "name category");

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error("Error in getBookingsByEmail:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!["Pending", "Confirmed", "Completed"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error("Error in updateBookingStatus:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findByIdAndDelete(id);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Emit real-time update that the slot is freed
        const io = req.app.get("io");
        if (io) {
            io.emit("slotFreed", {
                expertId: booking.expertId,
                date: booking.date,
                slot: booking.slot
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteBooking:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
