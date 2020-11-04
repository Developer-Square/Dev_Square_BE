const httpStatus = require('http-status');
const { Portfolio } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a portfolio item
 * @param {Object} itemBody
 * @returns {Promise<Item>}
 */
const createItem = async (itemBody) => {
  const item = await Portfolio.create(itemBody);
  return item;
};

/**
 * Query for Portfolio
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryItem = async (filter, options) => {
  const items = await Portfolio.paginate(filter, options);
  return items;
};

/**
 * Get all items
 * @returns {Promise<Portfolio>}
 */
const getPortfolio = async () => {
  return Portfolio.find({});
};

/**
 * Get item by id
 * @param {ObjectId} id
 * @returns {Promise<Item>}
 */
const getItemById = async (id) => {
    return Portfolio.findById(id);
  };

/**
 * Update item by id
 * @param {ObjectId} itemId
 * @param {Object} updateBody
 * @returns {Promise<Item>}
 */
const updateItemById = async (itemId, updateBody) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  Object.assign(item, updateBody);
  await item.save();
  return item;
};

/**
 * Delete item by id
 * @param {ObjectId} itemId
 * @returns {Promise<Item>}
 */
const deleteItemById = async (itemId) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  await item.remove();
  return item;
};

module.exports = {
  createItem,
  queryItem,
  getItemById,
  updateItemById,
  deleteItemById,
  getPortfolio
};
