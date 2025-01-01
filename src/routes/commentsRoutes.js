// src/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const { addComment, getCommentsForPost, updateComment, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

// Define routes
router.post("/", protect, addComment); // Add a comment to a post
router.get("/:postId", getCommentsForPost); // Get comments for a post
router.put("/:id", protect, updateComment); // Update a comment
router.delete("/:id", protect, deleteComment); // Delete a comment

module.exports = router;
