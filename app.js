const express = require("express");
const morgan = require("morgan");

const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// 1. MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json()); // To interpret json data

app.use((req, res, next) => {
  req.requestTime = new Date.now().toISOString();

  next();
});

// 2. ROUTES
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);

module.exports = app;
