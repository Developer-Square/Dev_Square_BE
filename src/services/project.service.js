const httpStatus = require('http-status');
const { Project } = require('../models');
const { Task } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Project
 * @param {Object} projectBody
 * @returns {Promise<Project>}
 */
const createProject = async (projectBody) => {
  const project = await Project.create(projectBody);
  return project;
};

/**
 * Query for Project
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProject = async (filter, options) => {
  const projects = await Project.paginate(filter, options);
  return projects;
};

/**
 * Get Project by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getProjectById = async (id) => Project.findById(id);

/**
 * Get Project Tasks by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getProjectTasksById = async (id) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  } else if (project.tasks.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tasks not found');
  } else {
    return Project.aggregateTasks(id);
  }
};

/**
 * Get Project Tasks by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getProjectTaskData = async (id) => {
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  if (project.tasks.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tasks not found');
  }
  const tasks = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < project.tasks.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const data = await Task.findById(project.tasks[i]);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid data');
    }
    tasks.push(data);
  }
  return tasks;
};

/**
 * Update Project by id
 * @param {ObjectId} projectId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateProjectById = async (projectId, updateBody) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  Object.assign(project, updateBody);
  await project.save();
  return project;
};

/**
 * Delete Project by id
 * @param {ObjectId} ProjectId
 * @returns {Promise<Item>}
 */
const deleteProjectById = async (projectId) => {
  const project = await getProjectById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  await project.remove();
  return project;
};

module.exports = {
  createProject,
  queryProject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
  getProjectTasksById,
  getProjectTaskData,
};
