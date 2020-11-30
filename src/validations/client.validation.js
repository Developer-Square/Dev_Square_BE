const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createClient = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    projectName: Joi.string().required(),
    dueDate: Joi.date().required(),
    stack: Joi.array().required(),
  }),
};

const queryClient = {
  query: Joi.object().keys({
    category: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getClient = {
  params: Joi.object().keys({
    clientId: Joi.string().custom(objectId),
  }),
};

const updateClient = {
  params: Joi.object().keys({
    clientId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      projectName: Joi.string(),
      dueDate: Joi.string(),
      stack: Joi.array(),
    })
    .min(1),
};

const deleteClient = {
  params: Joi.object().keys({
    clientId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createClient,
  queryClient,
  getClient,
  updateClient,
  deleteClient,
};
