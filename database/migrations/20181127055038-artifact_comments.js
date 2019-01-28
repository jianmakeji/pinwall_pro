'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

  const { BOOLEAN, INTEGER, DATE, TEXT } = Sequelize;

    await queryInterface.createTable('artifact_comments', {
      Id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      artifactId: {
        type: INTEGER,
        allowNull: true
      },
      commenterId: {
        type: INTEGER,
        allowNull: true
      },
      content: {
        type: TEXT,
        allowNull: true
      },
      commentAt: {
        type: DATE,
        allowNull: false,
        defaultValue:  Sequelize.literal('CURRENT_TIMESTAMP')
      },
      visible: {
        type: BOOLEAN,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('artifact_comments');
  }
};
