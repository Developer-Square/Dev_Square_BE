const mongoose = require('mongoose');
const faker = require('faker');
const { Client } = require('../../src/models');

const clientOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(5),
  projectName: faker.lorem.sentence(3),
  dueDate: faker.date.future(2),
  stack: [faker.lorem.word(), faker.lorem.word()],
};

const clientTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(5),
  projectName: faker.lorem.sentence(3),
  dueDate: faker.date.future(2),
  stack: [faker.lorem.word(), faker.lorem.word()],
};

const clientThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.word(),
  description: faker.lorem.sentence(5),
  projectName: faker.lorem.sentence(3),
  dueDate: faker.date.future(2),
  stack: [faker.lorem.word(), faker.lorem.word()],
};

const insertClients = async (clients) => {
  await Client.insertMany(clients.map((client) => ({ ...client })));
};

module.exports = {
  clientOne,
  clientTwo,
  clientThree,
  insertClients,
};
