const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addTaskToUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserTaskById(req.params.userId, req.body.taskId);
  res.send(user);
});

const getUserTasks = catchAsync(async (req, res) => {
  const tasks = await userService.getUserTasks(req.params.userId);
  res.send(tasks);
});

const changeUserStatus = catchAsync(async (req, res) => {
  const user = await userService.updateStatusById(req.params.userId, req.body.newStatus);
  res.send(user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addTaskToUser,
  changeUserStatus,
  getUserTasks,
};
