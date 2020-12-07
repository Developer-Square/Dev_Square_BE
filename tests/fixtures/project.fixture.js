const mongoose = require('mongoose');
const faker = require('faker');
const { Project } = require('../../src/models');
const { Task } = require('../../src/models');

const projectOne = {
  _id: mongoose.Types.ObjectId(),
  clientId: mongoose.Types.ObjectId(),
  name: faker.lorem.sentence(3),
  description: faker.lorem.sentence(5),
  dueDate: faker.date.future(2),
  stack: 'node',
};

const projectTwo = {
  _id: mongoose.Types.ObjectId(),
  clientId: '5ebac534954b54139806c582',
  name: 'node app',
  description: faker.lorem.sentence(5),
  dueDate: faker.date.future(2),
  stack: 'node',
};

const projectThree = {
  _id: mongoose.Types.ObjectId(),
  clientId: '5ebac534954b54139806c582',
  name: 'node app',
  description: faker.lorem.sentence(5),
  dueDate: faker.date.future(2),
  stack: faker.lorem.word(),
  tasks: ['5ebac534954b54139806c601', '5ebac534954b54139806c602', '5ebac534954b54139806c603'],
};

const projectFour = {
  _id: mongoose.Types.ObjectId(),
  clientId: '5ebac534954b54139806c582',
  name: 'node app',
  description: faker.lorem.sentence(5),
  dueDate: faker.date.future(2),
  stack: faker.lorem.word(),
  tasks: ['5ebac534954b54139806c621', '5ebac534954b54139806c602', '5ebac534954b54139806c603'],
};

const taskOne = {
  _id: '5ebac534954b54139806c601',
  stack: 'node',
  creator: mongoose.Types.ObjectId(),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  difficulty: 'medium',
};

const taskTwo = {
  _id: '5ebac534954b54139806c602',
  stack: 'node',
  creator: '5fc4aa77fbb5c260556866c6',
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  difficulty: 'easy',
};

const taskThree = {
  _id: '5ebac534954b54139806c603',
  stack: 'react',
  creator: '5fc4aa77fbb5c260556866c6',
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  difficulty: 'easy',
  status: 'inProgress',
};

const insertTasks = async (tasks) => {
  await Task.insertMany(tasks.map((task) => ({ ...task })));
};

const insertProjects = async (projects) => {
  await Project.insertMany(projects.map((project) => ({ ...project })));
};

module.exports = {
  projectOne,
  projectTwo,
  projectThree,
  projectFour,
  insertProjects,
  taskOne,
  taskTwo,
  taskThree,
  insertTasks,
};
