const Booking = require("../models/Booking");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// Create Booking
exports.createBooking = async (req, res) => {
    try {
        const { mentorId, date, paymentId, amount } = req.body;

        const booking = new Booking({
            student: req.user.id,
            mentor: mentorId,
            date,
            paymentId,
            amount,
            status: "confirmed",
            meetingLink: "https://meet.google.com/abc-defg-hij", // specialized for demo
        });

        await booking.save();

        // Notify Mentor
        await createNotification(
            mentorId,
            "booking",
            `New Session Booked by ${req.user.fullName} for ₹${amount}`,
            "/dashboard"
        );

        // Notify Student
        await createNotification(
            req.user.id,
            "system",
            `Booking Confirmed with Mentor!`,
            "/dashboard"
        );

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: "Booking failed" });
    }
};

// Get My Bookings (Student)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ student: req.user.id }).populate("mentor", "fullName email profilePicture");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};

// Get Mentor Sessions
exports.getMentorSessions = async (req, res) => {
    try {
        const bookings = await Booking.find({ mentor: req.user.id }).populate("student", "fullName email profilePicture");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};
