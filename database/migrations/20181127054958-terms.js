'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER,
      STRING
    } = Sequelize;

    await queryInterface.createTable('terms', {
      Id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: STRING(30),
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('terms');
  }
};
