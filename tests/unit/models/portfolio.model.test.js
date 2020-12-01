const faker = require('faker');
const { Portfolio } = require('../../../src/models');

describe('Portfolio model', () => {
  describe('Portfolio validation', () => {
    let newItem;
    beforeEach(() => {
      newItem = {
        title: faker.lorem.sentence(5),
        category: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        link: faker.internet.url(),
        gallery: [faker.internet.url(), faker.internet.url()],
      };
    });

    test('should correctly validate a valid portfolio item', async () => {
      await expect(new Portfolio(newItem).validate()).resolves.toBeUndefined();
    });
  });
});
