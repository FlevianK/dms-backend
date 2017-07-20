'use strict';
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(8);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        firstName: 'admin',
        lastName: 'admin',
        password: bcrypt.hashSync('Admin@1', salt),
        email: 'admin@dms.com',
        title: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
