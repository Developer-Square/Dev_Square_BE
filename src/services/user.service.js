const httpStatus = require('http-status');
const prompt = require('prompt');
const { User } = require('../models');
const taskService = require('./task.service');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const logger = require('../config/logger');
const adminProperties = require('../config/admin');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user;
};

/**
 * Create initial admin user
 * @returns {Promise<User>}
 */
const createAdmin = async () => {
  const admin = await User.findOne({ name: config.admin.name });
  if (!admin) {
    prompt.start();
    prompt.message = 'Password';

    prompt.get(adminProperties, async function (err, result) {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        // return 1;
      }
      await User.create({
        name: config.admin.name,
        password: result.password,
        email: config.admin.email,
        role: config.admin.role,
      });
      if (result.password === config.admin.password) {
        logger.info('Admin created with default configs. Use the email and password in your environment variables to login');
      } else {
        logger.info(
          'Admin created with new password. Use the email in your environment variables and your new password to login'
        );
      }
    });

    // const user = await User.create(config.admin);
    // logger.info('Admin created...Use the default configs');
  } else {
    logger.info('Admin exists....');
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user tasks by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const getUserTasks = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return { tasks: user.tasks };
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Update task by user Id
 * @param {ObjectId} userId
 * @param {Object} taskId
 * @returns {Promise<User>}
 */
const updateUserTaskById = async (userId, taskId) => {
  const task = await taskService.getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // eslint-disable-next-line eqeqeq
  if (user.tasks.indexOf(taskId) != -1) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User is already assigned the task');
  }
  task.status = 'inProgress';
  await task.save();
  user.tasks.push(taskId);
  await user.save();
  return user;
};

/**
 * Delete task from user
 * @param {ObjectId} userId
 * @param {Object} taskId
 * @returns {Promise<User>}
 */
const deleteTaskFromUser = async (userId, taskId) => {
  const task = await taskService.getTaskById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // eslint-disable-next-line eqeqeq
  if (user.tasks.indexOf(taskId) === -1) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User is not assigned the task');
  }
  let index = user.tasks.indexOf(taskId);
  user.tasks.splice(index, 1);
  await user.save();
  return user;
};

/**
 * Update status by user Id
 * @param {ObjectId} userId
 * @param {String} newStatus
 * @returns {Promise<User>}
 */
const updateStatusById = async (userId, newStatus) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.status = newStatus;
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  updateUserTaskById,
  updateStatusById,
  getUserTasks,
  createAdmin,
  deleteTaskFromUser,
};
