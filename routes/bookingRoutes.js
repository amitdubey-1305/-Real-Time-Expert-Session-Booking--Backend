const express = require("express");
const router = express.Router();
const {
    createBooking,
    getBookingsByEmail,
    updateBookingStatus,
    deleteBooking
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

// POST /bookings
router.post("/", protect, createBooking);

// GET /bookings?email=test@gmail.com
router.get("/", getBookingsByEmail);

// PATCH /bookings/:id/status
router.patch("/:id/status", updateBookingStatus);

// DELETE /bookings/:id
router.delete("/:id", deleteBooking);

module.exports = router;
