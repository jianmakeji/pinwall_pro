'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER
    } = Sequelize;

    await queryInterface.createTable('artifact_term', {
      artifactId: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0',
        primaryKey: true
      },
      termId: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('artifact_term');
  }
};
