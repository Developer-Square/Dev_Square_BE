const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { taskService, userService, projectService } = require('../services');

const createTask = catchAsync(async (req, res) => {
  const creator = await userService.getUserById(req.body.creator);
  if (!creator) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Creator does not exist');
  }
  const project = await projectService.getProjectById(req.body.project);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project does not exist');
  }
  const task = await taskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(task);
});

const queryTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['project', 'title', 'status', 'creator']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.queryTask(filter, options);
  res.send(result);
});

const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  res.send(task);
});

const updateTask = catchAsync(async (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'creator')) {
    const creator = await userService.getUserById(req.body.creator);
    if (!creator) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Creator does not exist');
    }
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'project')) {
    const project = await projectService.getProjectById(req.body.project);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Project does not exist');
    }
  }
  const updatedTask = await taskService.updateTaskById(req.params.taskId, req.body);
  res.send(updatedTask);
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTaskById(req.params.taskId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTask,
  queryTasks,
  getTask,
  updateTask,
  deleteTask,
};
