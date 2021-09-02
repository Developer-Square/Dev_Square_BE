const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService, userService } = require('../services');

const createProject = catchAsync(async (req, res) => {
  const client = await userService.getUserById(req.body.client);
  if (!client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client does not exist');
  }
  const project = await projectService.createProject(req.body);
  res.status(httpStatus.CREATED).send(project);
});

const queryProject = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'client']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await projectService.queryProject(filter, options);
  res.send(result);
});

const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  res.send(project);
});

const updateProject = catchAsync(async (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'client')) {
    const client = await userService.getUserById(req.body.client);
    if (!client) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Client does not exist');
    }
  }
  const updatedProject = await projectService.updateProjectById(req.params.projectId, req.body);
  res.send(updatedProject);
});

const deleteProject = catchAsync(async (req, res) => {
  await projectService.deleteProjectById(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProject,
  queryProject,
  getProject,
  updateProject,
  deleteProject,
};
