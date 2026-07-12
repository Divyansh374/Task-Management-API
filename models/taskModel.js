const mongoose = require("mongoose");
const AppError = require("../utils/appError");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for your task"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "none"],
      default: "none",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (val) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return val >= today;
        },
        message: "dueDate can't be smaller than today's date",
      },
    },
    completedAt: Date,
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
