const mongoose = require('mongoose');
const faker = require('faker');
const { Portfolio } = require('../../src/models');

const itemOne = {
  _id: mongoose.Types.ObjectId(),
  title: faker.lorem.sentence(5),
  category: 'react',
  description: faker.lorem.paragraph(),
  link: faker.internet.url(),
  gallery: [faker.internet.url(), faker.internet.url()],
};

const itemTwo = {
  _id: mongoose.Types.ObjectId(),
  title: faker.lorem.sentence(5),
  category: 'react',
  description: faker.lorem.paragraph(),
  link: faker.internet.url(),
  gallery: [faker.internet.url()],
};

const itemThree = {
  _id: mongoose.Types.ObjectId(),
  title: faker.lorem.sentence(5),
  category: 'django',
  description: faker.lorem.paragraph(),
  link: faker.internet.url(),
  gallery: [faker.internet.url(), faker.internet.url(), faker.internet.url()],
};

const insertItems = async (items) => {
  await Portfolio.insertMany(items.map((item) => ({ ...item })));
};

module.exports = {
  itemOne,
  itemTwo,
  itemThree,
  insertItems,
};
