const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { taskService } = require('../services');

const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
});

const queryTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category', 'difficulty']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.queryTask(filter, options);
  res.send(result);
});

const getTasks = catchAsync(async (req, res) => {
  const tasks = await taskService.getTasks();
  if (!tasks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tasks not found');
  }
  res.send(tasks);
});

const getTask = catchAsync(async (req, res) => {
    const task = await taskService.getTaskById(req.params.taskId);
    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    res.send(task);
});

const getTaskByUserId = catchAsync(async (req, res) => {
  const tasks = await taskService.getTaskByUserId(req.params.userId);
  if (!tasks){
    throw new ApiError(httpStatus.NOT_FOUND, 'Tasks not found');
  }
  res.send(tasks);
})

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTaskById(req.params.taskId, req.body);
  res.send(task);
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTaskById(req.params.taskId);
  res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
  createTask,
  queryTasks,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTaskByUserId
};