const express = require("express");
const taskController = require("../controllers/taskController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, taskController.getAllTasks)
  .post(authController.protect, taskController.createTask);

module.exports = router;
