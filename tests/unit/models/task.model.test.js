const mongoose = require('mongoose');
const faker = require('faker');
const { Task } = require('../../../src/models');

describe('Task model', () => {
  describe('Task validation', () => {
    let newTask;
    beforeEach(() => {
      newTask = {
        project: mongoose.Types.ObjectId(),
        creator: mongoose.Types.ObjectId(),
        title: faker.lorem.sentence(3),
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(2),
        status: 'inProgress',
      };
    });

    test('should correctly validate a valid task', async () => {
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if status is unknown', async () => {
      newTask.status = 'invalid';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if project is not a mongoDB objectId', async () => {
      newTask.project = 'invalid';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });

    test('should throw a validation error if creator is not a mongoDB objectId', async () => {
      newTask.creator = 'invalid';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });
  });
});
