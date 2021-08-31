const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createTask = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    creator: Joi.string().required().custom(objectId),
    project: Joi.string().required().custom(objectId),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
  }),
};

const queryTasks = {
  query: Joi.object().keys({
    project: Joi.string().custom(objectId),
    creator: Joi.string().custom(objectId),
    title: Joi.string(),
    status: Joi.string().valid('notStarted', 'inProgress', 'onHold', 'cancelled', 'completed'),
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

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      project: Joi.string().custom(objectId),
      creator: Joi.string().custom(objectId),
      description: Joi.string(),
      title: Joi.string(),
      dueDate: Joi.date(),
      status: Joi.string().valid('notStarted', 'inProgress', 'onHold', 'cancelled', 'completed'),
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
};
