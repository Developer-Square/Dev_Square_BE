const config = require('./config');

const properties = [
  {
    name: 'password',
    hidden: true,
    validator: /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]{8,}$/,
    message:
      'Must contain letters and numbers and has a minimum length of 8. Press Enter without typing password to use default configs',
    default: config.admin.password,
    type: 'string',
    description: 'Enter Admin Password',
  },
];

module.exports = properties;
