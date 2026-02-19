import express from "express";
import userRoutes from "./users.js";
import topicRoutes from "./topics.js";
import questionRoutes from "./questions.js";
import leetcodeRoutes from "./leetcode.js";

const router = express.Router();

// Wire up all the routes to the main router
router.use("/users", userRoutes);
router.use("/topics", topicRoutes);
router.use("/questions", questionRoutes);
router.use("/leetcode", leetcodeRoutes);

// A simple test route for the API root
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the DSA Tracker API" });
});

export default router;
