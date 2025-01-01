// importing async handler and models
const asyncHandler = require("express-async-handler");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

// @desc Add a comment to a post
// @route POST /api/comments
// @access private
const addComment = asyncHandler(async (req, res) => {
  const { content, postId } = req.body;

  if (!content || !postId) {
    res.status(400);
    throw new Error("Content and Post ID are required!");
  }

  // Check if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found!");
  }

  // Create the comment
  const comment = await Comment.create({
    content,
    author: req.user.id, // The author is the logged-in user
    post: postId,
  });

  // Add the comment reference to the post's comments array
  post.comments.push(comment._id);
  await post.save();

  res.status(201).json(comment);
});

// @desc Get all comments for a post
// @route GET /api/comments/:postId
// @access public
const getCommentsForPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error("Post not found!");
  }

  // Fetch all comments for the post
  const comments = await Comment.find({ post: req.params.postId })
    .populate("author", "username email") // Populate the author info
    .sort({ createdAt: -1 }); // Sort by latest comments first

  res.status(200).json(comments);
});

// @desc Update a comment
// @route PUT /api/comments/:id
// @access private
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found!");
  }

  // Check if the user is the author of the comment
  if (comment.author.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this comment");
  }

  // Update the comment content
  comment.content = req.body.content || comment.content;

  const updatedComment = await comment.save();

  res.status(200).json(updatedComment);
});

// @desc Delete a comment
// @route DELETE /api/comments/:id
// @access private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found!");
  }

  // Check if the user is the author of the comment
  if (comment.author.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this comment");
  }

  // Remove the comment from the post's comments array
  const post = await Post.findById(comment.post);
  post.comments = post.comments.filter((commentId) => commentId.toString() !== comment._id.toString());
  await post.save();

  // Delete the comment
  await comment.remove();

  res.status(200).json({ message: "Comment deleted successfully" });
});

module.exports = {
  addComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
};
