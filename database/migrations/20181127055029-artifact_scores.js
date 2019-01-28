'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER,
      DATE,
      STRING
    } = Sequelize;

    await queryInterface.createTable('artifact_scores', {
      Id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      artifactId: {
        type: INTEGER,
        allowNull: false,
        defaultValue: '0'
      },
      scorerId: {
        type: INTEGER,
        allowNull: false,
        defaultValue: '0'
      },
      score: {
        type: INTEGER,
        allowNull: true
      },
      createAt: {
        type: DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updateAt: {
        type: DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('artifact_scores');
  }
};
