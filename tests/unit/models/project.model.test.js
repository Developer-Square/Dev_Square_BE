const mongoose = require('mongoose');
const faker = require('faker');
const { Project } = require('../../../src/models');

describe('Project model', () => {
  describe('Project validation', () => {
    let newProject;
    beforeEach(() => {
      newProject = {
        clientId: mongoose.Types.ObjectId(),
        name: faker.lorem.sentence(3),
        description: faker.lorem.sentence(5),
        dueDate: faker.date.future(2),
        stack: faker.lorem.word(),
      };
    });

    test('should correctly validate a valid client', async () => {
      await expect(new Project(newProject).validate()).resolves.toBeUndefined();
    });
  });
});
