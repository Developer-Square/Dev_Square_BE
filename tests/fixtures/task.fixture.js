const faker = require('faker');
const { Task } = require('../../src/models');
const { admin, adminTwo } = require('./user.fixture');
const { projectOne, projectTwo } = require('./project.fixture');

const taskOne = {
  _id: '9ebac534954b54139806c701',
  project: projectOne._id,
  creator: admin._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  status: 'notStarted',
};

const taskTwo = {
  _id: '9ebac534954b54139806c702',
  project: projectTwo._id,
  creator: admin._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  status: 'notStarted',
};

const taskThree = {
  _id: '9ebac534954b54139806c703',
  project: projectOne._id,
  creator: adminTwo._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  status: 'inProgress',
};

const taskFour = {
  _id: '9ebac534954b54139806c704',
  project: projectOne._id,
  creator: adminTwo._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  status: 'completed',
};

const taskFive = {
  _id: '9ebac534954b54139806c705',
  project: projectOne._id,
  creator: adminTwo._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  status: 'onHold',
};

const taskSix = {
  _id: '9ebac534954b54139806c706',
  project: projectOne._id,
  creator: adminTwo._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  status: 'completed',
};

const insertTasks = async (tasks) => {
  await Task.insertMany(tasks.map((task) => ({ ...task })));
};

module.exports = {
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  taskFive,
  taskSix,
  insertTasks,
};
