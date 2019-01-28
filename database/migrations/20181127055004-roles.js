'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER,
      DATE,
      STRING
    } = Sequelize;

    await queryInterface.createTable('roles', {
      Id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING(30),
        allowNull: false,
        defaultValue: ''
      },
      description: {
        type: STRING(100),
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  }
};
