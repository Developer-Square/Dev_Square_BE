const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    client: Joi.string().required().custom(objectId),
    title: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
  }),
};

const queryProject = {
  query: Joi.object().keys({
    title: Joi.string(),
    client: Joi.string().custom(objectId),
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
      client: Joi.string().custom(objectId),
      title: Joi.string(),
      description: Joi.string(),
      dueDate: Joi.date(),
    })
    .min(1),
};

const deleteProject = {
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
};
