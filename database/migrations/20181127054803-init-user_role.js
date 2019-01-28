'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER
    } = Sequelize;

    await queryInterface.createTable('user_role', {
      userId: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0',
        primaryKey: true
      },
      roleId: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_role');
  }
};
