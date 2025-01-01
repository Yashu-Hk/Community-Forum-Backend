const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/errorHandler"); 


const app = express();
dotenv.config();

// Middleware
app.use(express.json()); // To parse JSON request body
app.use(cors()); // For handling cross-origin requests

// Connect to the database
connectDb();

// Import routes
const userRoutes = require("./routes/usersRoutes");
const postRoutes = require("./routes/postsRoutes");
const commentRoutes = require("./routes/commentsRoutes");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the community forum API!");
});

// Error handling middleware
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode).json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// });

// Use the error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
