const roles = ['user', 'admin', 'client'];

const roleRights = new Map();
roleRights.set(roles[0], []);
roleRights.set(roles[1], [
  'getUsers',
  'manageUsers',
  'getTasks',
  'manageTasks',
  'getPortfolio',
  'managePortfolio',
  'getClient',
  'manageClient',
]);
roleRights.set(roles[2], ['getClient']);

module.exports = {
  roles,
  roleRights,
};
