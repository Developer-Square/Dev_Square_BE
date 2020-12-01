const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');

const createItem = catchAsync(async (req, res) => {
  const item = await portfolioService.createItem(req.body);
  res.status(httpStatus.CREATED).send(item);
});

const queryPortfolio = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await portfolioService.queryItem(filter, options);
  res.send(result);
});

const getItem = catchAsync(async (req, res) => {
  const item = await portfolioService.getItemById(req.params.itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  res.send(item);
});

const updateItem = catchAsync(async (req, res) => {
  const item = await portfolioService.updateItemById(req.params.itemId, req.body);
  res.send(item);
});

const deleteItem = catchAsync(async (req, res) => {
  await portfolioService.deleteItemById(req.params.itemId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createItem,
  queryPortfolio,
  getItem,
  updateItem,
  deleteItem,
};
