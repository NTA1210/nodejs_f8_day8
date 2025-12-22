const express = require("express");

const router = express.Router();

// [GET] /api/posts
router.get("/", (req, res) => {
    res.send("Task list");
});

// [GET] /api/posts/123
router.get("/:id", (req, res) => {
    res.send("Task detail");
});

// [POST] /api/posts
router.post("/", (req, res) => {
    res.send("Create task");
});

module.exports = router;
