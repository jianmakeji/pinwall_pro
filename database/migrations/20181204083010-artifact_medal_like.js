'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      STRING,
      INTEGER,
      DATE
    } = Sequelize;

    await queryInterface.createTable('artifact_medal_like', {
      Id: {
        type: INTEGER,
        allowNull: false,
        defaultValue: '0',
        primaryKey: true
      },
      tag: {
        type: INTEGER,
        allowNull: false,
        defaultValue: '0'
      },
      userId: {
        type: INTEGER,
        allowNull: true
      },
      artifactId: {
        type: INTEGER,
        allowNull: true
      },
      createAt: {
        type: DATE,
        allowNull: false,
        defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('artifact_medal_like');
  }
};
