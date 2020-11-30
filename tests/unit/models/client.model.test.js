const faker = require('faker');
const { Client } = require('../../../src/models');

describe('Client model', () => {
  describe('Client validation', () => {
    let newClient;
    beforeEach(() => {
      newClient = {
        name: faker.lorem.word(),
        description: faker.lorem.sentence(5),
        projectName: faker.lorem.sentence(3),
        dueDate: faker.date.future(2),
        stack: [faker.lorem.word(), faker.lorem.word()],
      };
    });

    test('should correctly validate a valid client', async () => {
      await expect(new Client(newClient).validate()).resolves.toBeUndefined();
    });
  });
});
