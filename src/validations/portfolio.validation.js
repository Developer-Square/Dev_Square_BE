const Joi = require('@hapi/joi');
const { password, objectId } = require('./custom.validation');

const createItem = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().required(),
    gallery: Joi.array(),
  }),
};

const queryPortfolio = {
  query: Joi.object().keys({
    category: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    itemId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        title: Joi.string(),
        category: Joi.string(),
        description: Joi.string(),
        link: Joi.string(),
        gallery: Joi.array(),
    })
    .min(1),
};

const deleteItem = {
  params: Joi.object().keys({
    itemId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createItem,
  queryPortfolio,
  getItem,
  updateItem,
  deleteItem,
};