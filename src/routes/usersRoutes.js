const express = require("express");
const router = express.Router();
const { registerUser, loginUser, currentUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", protect, currentUser);

module.exports = router;
