// src/routes/postsRoutes.js
const express = require("express");
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost } = require("../controllers/postsController");  // Correct import
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createPost);  // Create a post
router.get("/", getPosts);  // List all posts (corrected)
router.get("/:id", getPostById);  // Get a single post by ID (corrected)
router.put("/:id", protect, updatePost);  // Update a post
router.delete("/:id", protect, deletePost);  // Delete a post

module.exports = router;