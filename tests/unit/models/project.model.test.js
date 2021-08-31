const mongoose = require('mongoose');
const faker = require('faker');
const { Project } = require('../../../src/models');

describe('Project model', () => {
  describe('Project validation', () => {
    let newProject;
    beforeEach(() => {
      newProject = {
        client: mongoose.Types.ObjectId(),
        title: faker.lorem.sentence(3),
        description: faker.lorem.sentence(5),
        dueDate: faker.date.future(2),
      };
    });

    test('should correctly validate a valid client', async () => {
      await expect(new Project(newProject).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if client is not a mongoDB objectId', async () => {
      newProject.client = 'invalid';
      await expect(new Project(newProject).validate()).rejects.toThrow();
    });
  });
});
