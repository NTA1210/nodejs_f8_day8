const express = require("express");

const router = express.Router();

const tasksRoute = require("./tasks.route");
const postsRoute = require("./posts.route");
// ...

router.use("/tasks", tasksRoute);
router.use("/posts", postsRoute);

module.exports = router;
