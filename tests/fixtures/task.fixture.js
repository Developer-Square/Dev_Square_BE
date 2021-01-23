const mongoose = require('mongoose');
const faker = require('faker');
const { Task } = require('../../src/models');

const taskOne = {
  _id: mongoose.Types.ObjectId(),
  stack: 'node',
  creator: mongoose.Types.ObjectId(),
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  difficulty: 'medium',
};

const taskTwo = {
  _id: mongoose.Types.ObjectId(),
  stack: 'node',
  creator: '5fc4aa77fbb5c260556866c6',
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  difficulty: 'easy',
};

const taskThree = {
  _id: mongoose.Types.ObjectId(),
  stack: 'react',
  creator: '5fc4aa77fbb5c260556866c6',
  description: faker.lorem.paragraph(),
  dueDate: faker.date.future(2),
  difficulty: 'easy',
  status: 'inProgress',
  assigned: true,
};

const insertTasks = async (tasks) => {
  await Task.insertMany(tasks.map((task) => ({ ...task })));
};

module.exports = {
  taskOne,
  taskTwo,
  taskThree,
  insertTasks,
};
