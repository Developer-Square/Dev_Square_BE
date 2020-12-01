const mongoose = require('mongoose');
const faker = require('faker');
const { Task } = require('../../src/models');

const taskOne = {
  _id: mongoose.Types.ObjectId(),
  title: faker.lorem.sentence(5),
  category: 'node',
  description: faker.lorem.paragraph(),
  price: faker.random.number(),
  difficulty: 'beginner',
};

const taskTwo = {
  _id: mongoose.Types.ObjectId(),
  title: faker.lorem.sentence(5),
  category: 'node',
  description: faker.lorem.paragraph(),
  price: faker.random.number(),
  difficulty: 'intermediate',
};

const taskThree = {
  _id: mongoose.Types.ObjectId(),
  title: faker.lorem.sentence(5),
  category: 'react',
  description: faker.lorem.paragraph(),
  price: faker.random.number(),
  difficulty: 'intermediate',
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
