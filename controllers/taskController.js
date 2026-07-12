const Task = require("../models/taskModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const parseDate = require("../utils/parseDate");
const { filterObj } = require("../utils/ObjectUtils");
const APIFeatures = require("../utils/apiFeatures");

const checkTask = async (taskId, userId, next) => {
  const task = await Task.findById(taskId);

  if (!task) {
    return next(new AppError(404, "Task not found"));
  }

  // 1. Check if the task was created by the same user or not
  if (!task.user.equals(userId)) {
    return next(
      new AppError(403, "You are not authorized to access this task."),
    );
  }

  return task;
};

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
  const features = new APIFeatures(
    Task.find({
      user: req.user._id,
    }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const userTasks = await features.query;

  res.status(200).json({
    status: "success",
    results: userTasks.length,
    data: {
      tasks: userTasks,
    },
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  // 1. Check if the task was created by the same user or not
  const task = await checkTask(req.params.id, req.user._id, next);

  // 2. Let the user access the task
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  // 1. Check if the task was created by the same user or not
  const task = await checkTask(req.params.id, req.user._id, next);

  // 2. Filter whitlisted fields from the request body
  const filteredObj = filterObj(req.body, "description", "priority", "dueDate");

  // 3. Update the task
  Object.keys(filteredObj).forEach((e) => {
    task[e] = filteredObj[e];
  });

  await task.save();

  // 4. Send the updated task to the user
  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  // 1. Check if the task was created by the same user or not
  const task = await checkTask(req.params.id, req.user._id, next);

  // 2. Delete the task
  await task.deleteOne();

  res.status(204).send();
});

exports.completeTask = catchAsync(async (req, res, next) => {
  // 1. Check if the task was created by the same user or not
  const task = await checkTask(req.params.id, req.user._id, next);

  // 2. Check if task is completed already
  if (task.completed) {
    return next(new AppError(409, "This task is already complete."));
  }

  // 3. Set completed to true
  task.completed = true;
  task.completedAt = Date.now();
  await task.save();

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.showDashboard = catchAsync(async (req, res, next) => {
  const dashboard = await Task.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $facet: {
        overallStats: [
          {
            $group: {
              _id: null,
              totalTasks: {
                $sum: 1,
              },
              completed: {
                $sum: {
                  $cond: [
                    {
                      $eq: ["$completed", true],
                    },
                    1,
                    0,
                  ],
                },
              },
              pending: {
                $sum: {
                  $cond: [
                    {
                      $eq: ["$completed", true],
                    },
                    0,
                    1,
                  ],
                },
              },
            },
          },
          {
            $project: {
              totalTasks: 1,
              completed: 1,
              pending: 1,
              completionRate: {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$completed", "$totalTasks"] },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        ],
        priorityStats: [
          {
            $group: {
              _id: "$priority",
              total: {
                $sum: 1,
              },
            },
          },
        ],
        upcomingDeadlines: [
          {
            $match: {
              completed: false,
              dueDate: { $gt: new Date() },
            },
          },
          {
            $sort: {
              dueDate: 1,
            },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              title: 1,
              dueDate: 1,
              priority: 1,
              _id: 1,
            },
          },
        ],
        overdueTasks: [
          {
            $match: {
              completed: false,
              dueDate: { $lt: new Date() },
            },
          },
          {
            $sort: {
              dueDate: 1,
            },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              title: 1,
              dueDate: 1,
              priority: 1,
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        overallStats: 1,
        priorityStats: {
          $map: {
            input: "$priorityStats",
            as: "priority",
            in: {
              _id: "$$priority._id",
              total: "$$priority.total",
              percentage: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$$priority.total",
                          {
                            $getField: {
                              field: "totalTasks",
                              input: { $arrayElemAt: ["$overallStats", 0] },
                            },
                          },
                        ],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
            },
          },
        },
        upcomingDeadlines: 1,
        overdueTasks: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: dashboard,
  });
});
