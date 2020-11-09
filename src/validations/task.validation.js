const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createTask = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().integer().required(),
    difficulty: Joi.string().required().valid('beginner', 'intermediate', 'expert'),
  }),
};

const queryTasks = {
  query: Joi.object().keys({
    category: Joi.string(),
    difficulty: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

const getTaskByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        title: Joi.string(),
        category: Joi.string(),
        description: Joi.string(),
        price: Joi.number().integer(),
        difficulty: Joi.string().valid('beginner', 'intermediate', 'expert'),
    })
    .min(1),
};

const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTask,
  queryTasks,
  getTask,
  updateTask,
  deleteTask,
  getTaskByUserId
};