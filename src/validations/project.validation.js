const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    clientId: Joi.string().required().custom(objectId),
    name: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
    stack: Joi.string().required(),
    tasks: Joi.array(),
  }),
};

const queryProject = {
  query: Joi.object().keys({
    name: Joi.string(),
    clientId: Joi.string().custom(objectId),
    stack: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      clientId: Joi.string().custom(objectId),
      name: Joi.string(),
      description: Joi.string(),
      dueDate: Joi.date(),
      stack: Joi.string(),
      tasks: Joi.array(),
    })
    .min(1),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const getProjectTasksById = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const getTaskData = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProject,
  queryProject,
  getProject,
  updateProject,
  deleteProject,
  getProjectTasksById,
  getTaskData,
};
