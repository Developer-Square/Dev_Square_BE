const mongoose = require('mongoose');
const { toJSONWithDates } = require('../../../../src/models/plugins');

describe('toJSONWithDates plugin', () => {
  let connection;

  beforeEach(() => {
    connection = mongoose.createConnection();
  });

  it('should replace _id with id', () => {
    const schema = mongoose.Schema();
    schema.plugin(toJSONWithDates);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    expect(doc.toJSON()).not.toHaveProperty('_id');
    expect(doc.toJSON()).toHaveProperty('id', doc._id.toString());
  });

  it('should remove __v', () => {
    const schema = mongoose.Schema();
    schema.plugin(toJSONWithDates);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    expect(doc.toJSON()).not.toHaveProperty('__v');
  });

  it('should remove any path set as private', () => {
    const schema = mongoose.Schema({
      public: { type: String },
      private: { type: String, private: true },
    });
    schema.plugin(toJSONWithDates);
    const Model = connection.model('Model', schema);
    const doc = new Model({ public: 'some public value', private: 'some private value' });
    expect(doc.toJSON()).not.toHaveProperty('private');
    expect(doc.toJSON()).toHaveProperty('public');
  });

  it('should also call the schema toJSONWithDates transform function', () => {
    const schema = mongoose.Schema(
      {
        public: { type: String },
        private: { type: String },
      },
      {
        toJSON: {
          transform: (doc, ret) => {
            // eslint-disable-next-line no-param-reassign
            delete ret.private;
          },
        },
      }
    );
    schema.plugin(toJSONWithDates);
    const Model = connection.model('Model', schema);
    const doc = new Model({ public: 'some public value', private: 'some private value' });
    expect(doc.toJSON()).not.toHaveProperty('private');
    expect(doc.toJSON()).toHaveProperty('public');
  });
});
