const Task = require("../models/taskModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const parseDate = require("../utils/parseDate");

exports.createTask = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { title, description, priority, dueDate } = req.body;

  const parsedDate = dueDate ? parseDate(dueDate) : undefined;
  parsedDate.setHours(23, 59, 59, 999);

  const newTask = await Task.create({
    title,
    description,
    priority,
    dueDate: parsedDate,
    user: _id,
  });

  res.status(200).json({
    status: "success",
    data: {
      task: newTask,
    },
  });
});

exports.getAllTasks = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const userTasks = await Task.find({
    user: req.user._id,
  });

  res.status(200).json({
    status: "success",
    results: userTasks.length,
    data: {
      tasks: userTasks,
    },
  });
});
