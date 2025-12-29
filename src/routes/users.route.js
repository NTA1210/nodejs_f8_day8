const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.get("/", userController.create);

module.exports = router;
