const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService } = require('../services');

const createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.status(httpStatus.CREATED).send(project);
});

const queryProject = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'clientId', 'stack']);
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

const getProjectTasks = catchAsync(async (req, res) => {
  const project = await projectService.getProjectTasksById(req.params.projectId);
  res.send(project);
});

const getTaskData = catchAsync(async (req, res) => {
  const tasks = await projectService.getProjectTaskData(req.params.projectId);
  res.send(tasks);
});

const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.updateProjectById(req.params.projectId, req.body);
  res.send(project);
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
  getProjectTasks,
  getTaskData,
};
