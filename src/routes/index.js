const express = require("express");

const router = express.Router();

const tasksRoute = require("./tasks.route");
const postsRoute = require("./posts.route");
const usersRoute = require("./users.route");
// ...

router.use("/tasks", tasksRoute);
router.use("/posts", postsRoute);
router.use("/users", usersRoute);

module.exports = router;
