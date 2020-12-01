const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Developer Square Node Backend',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-mongoose-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url:
        config.env === 'production' ? `https://developer-square-be.herokuapp.com/v1` : `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
