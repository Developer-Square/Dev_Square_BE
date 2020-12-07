const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const User = require('../../src/models/user.model');
const { Task } = require('../../src/models');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  tasks: ['5ebac534954b54139806c601'],
  skills: ['JS', 'PHP', 'Django'],
  status: 'available',
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  tasks: [],
  skills: ['JS', 'PHP', 'C'],
  status: 'busy',
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  tasks: [],
  skills: ['JS', 'PHP', 'Django', 'C'],
  status: 'available',
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

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
  taskOne,
  taskTwo,
  taskThree,
  insertTasks,
};
