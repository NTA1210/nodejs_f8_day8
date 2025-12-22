const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");

router.get("/", taskController.getAll);
router.get("/:id", taskController.getOne);
router.post("/", taskController.create);
router.post("/:id/toggle", taskController.toggle);

module.exports = router;
