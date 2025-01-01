// importing async handler and models
const asyncHandler = require("express-async-handler");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// @desc Create a new post
// @route POST /api/posts
// @access private
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required!");
  }

  // Get the logged-in user's ID
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  // Create the post
  const post = await Post.create({
    title,
    content,
    author: user._id,
  });

  if (post) {
    res.status(201).json(post);
  } else {
    res.status(400);
    throw new Error("Error creating the post!");
  }
});

// @desc Get all posts
// @route GET /api/posts
// @access public
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "username email").populate("comments");

  if (!posts || posts.length === 0) {
    res.status(404);
    throw new Error("No posts found!");
  }

  res.status(200).json(posts);
});

// @desc Get a single post by ID
// @route GET /api/posts/:id
// @access public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username email")
    .populate("comments");

  if (!post) {
    res.status(404);
    throw new Error("Post not found!");
  }

  res.status(200).json(post);
});

// @desc Update a post
// @route PUT /api/posts/:id
// @access private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found!");
  }

  // Check if the user is the author of the post
  if (post.author.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this post");
  }

  // Update the post content
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.updatedAt = Date.now();

  const updatedPost = await post.save();

  res.status(200).json(updatedPost);
});

// @desc Delete a post
// @route DELETE /api/posts/:id
// @access private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found!");
  }

  // Check if the user is the author of the post
  if (post.author.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this post");
  }

  // Delete the post
  await post.remove();

  res.status(200).json({ message: "Post deleted successfully" });
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
