const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./router/authRoute");
const hackathonRoutes = require("./router/hackathonRoutes");
const ProjectRoutes = require("./router/projectRoutes");
const paymentRoutes = require("./router/paymentRoutes");
const connectDb = require("./db/db");

// Auth middleware
const auth = require("./middleware/auth");

const app = express();
connectDb();

// Use Helmet for security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// ✅ Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({ origin: true, credentials: true }));

// ✅ Parse cookies
app.use(cookieParser());

// Routes
app.use("/api/photos", require("./router/photoRoute"));
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/projects", ProjectRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/mentors", require("./router/mentorRoutes"));
app.use("/api/chat", require("./router/chatRoutes"));
app.use("/api/cart", require("./router/cartRoutes")); // Cart
app.use("/api/orders", require("./router/orderRoutes")); // Orders
app.use("/api/plans", require("./router/planRoutes")); // Plans
app.use("/api/bookings", require("./router/bookingRoutes")); // Bookings
app.use("/api/notifications", require("./router/notificationRoutes")); // Notifications
app.use("/api/leaderboard", require("./router/leaderboardRoutes")); // Leaderboard
app.use("/api/jobs", require("./router/jobRoutes")); // Jobs
app.use("/api/interviews", require("./router/interviewRoutes")); // Mock Interviews
app.use("/api/admin", require("./router/adminRoutes")); // Admin Panel
app.use("/api/ai", require("./router/aiRoutes")); // AI Resume Builder
app.use("/api", authRoutes);

// ✅ Auth check route
app.get("/api/check-auth-status", auth, (req, res) => {
  res.status(200).json({ isLoggedIn: true, user: req.user });
});

// ✅ Fix for frontend `/api/me`
app.get("/api/me", auth, (req, res) => {
  res.status(200).json(req.user);
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const http = require("http");
const { initSocket } = require("./socket");

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
