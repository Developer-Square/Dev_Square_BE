const faker = require('faker');
const { Task } = require('../../../src/models');

describe('Task model', () => {
  describe('Task validation', () => {
    let newTask;
    beforeEach(() => {
      newTask = {
        title: faker.lorem.sentence(5),
        category: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        price: faker.random.number(),
        difficulty: 'beginner'
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