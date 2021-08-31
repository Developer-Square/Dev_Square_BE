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
  'getProjects',
  'manageProjects',
]);
roleRights.set(roles[2], ['getProjects', 'getTasks']);

module.exports = {
  roles,
  roleRights,
};
