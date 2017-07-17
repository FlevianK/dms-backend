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
        password: bcrypt.hashSync('admin', salt),
        email: 'admin@live.com',
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
