const faker = require('faker');
const { Project } = require('../../src/models');
const { client, admin } = require('./user.fixture');

const projectOne = {
  _id: '9ebac534954b54139806c602',
  client: client._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.sentence(5),
  dueDate: faker.date.future(2),
};

const projectTwo = {
  _id: '9ebac534954b54139806c603',
  client: client._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.sentence(5),
  dueDate: faker.date.future(2),
};

const projectThree = {
  _id: '9ebac534954b54139806c604',
  client: admin._id,
  title: faker.lorem.sentence(3),
  description: faker.lorem.sentence(5),
  dueDate: faker.date.future(2),
};

const insertProjects = async (projects) => {
  await Project.insertMany(projects.map((project) => ({ ...project })));
};

module.exports = {
  projectOne,
  projectTwo,
  projectThree,
  insertProjects,
};
