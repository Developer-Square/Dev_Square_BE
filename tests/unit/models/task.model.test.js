const mongoose = require('mongoose');
const faker = require('faker');
const { Task } = require('../../../src/models');

describe('Task model', () => {
  describe('Task validation', () => {
    let newTask;
    beforeEach(() => {
      newTask = {
        stack: 'node',
        creator: mongoose.Types.ObjectId(),
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(2),
        difficulty: 'medium',
        status: 'inProgress',
      };
    });

    test('should correctly validate a valid task', async () => {
      await expect(new Task(newTask).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if difficulty is unknown', async () => {
      newTask.difficulty = 'invalid';
      await expect(new Task(newTask).validate()).rejects.toThrow();
    });
  });
});
