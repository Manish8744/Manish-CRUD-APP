// routes/userRoutes.js
const express = require("express");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Create new user
router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.file ? req.file.path : null,
    });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    // Map over users and modify profileImage path to be accessible
    const modifiedUsers = users.map((user) => {
      if (user.profileImage) {
        user.profileImage = `/uploads/${path.basename(user.profileImage)}`;
      }
      return user;
    });
    res.json(modifiedUsers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
