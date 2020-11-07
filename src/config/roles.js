const roles = ['user', 'admin', 'developer'];

const roleRights = new Map();
roleRights.set(roles[0], []);
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'getTasks', 'manageTasks', 'getPortfolio', 'managePortfolio']);

module.exports = {
  roles,
  roleRights,
};
