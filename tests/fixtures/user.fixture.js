const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const User = require('../../src/models/user.model');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  status: 'available',
};

const userTwo = {
  _id: '8ebac534954b54139806c603',
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  status: 'busy',
};

const client = {
  _id: '8ebac534954b54139806c604',
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'client',
  status: 'busy',
};

const admin = {
  _id: '8ebac534954b54139806c605',
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  status: 'available',
};

const adminTwo = {
  _id: '8ebac534954b54139806c606',
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  status: 'available',
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

module.exports = {
  userOne,
  userTwo,
  client,
  admin,
  adminTwo,
  insertUsers,
};
