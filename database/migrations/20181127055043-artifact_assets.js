'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      STRING,
      INTEGER,
      DATE,
      TEXT
    } = Sequelize;

    await queryInterface.createTable('artifact_assets', {
      artifactId: {
        type: INTEGER,
        allowNull: false,
        defaultValue: '0',
        primaryKey: true
      },
      position: {
        type: INTEGER,
        allowNull: false,
        defaultValue: '0'
      },
      name: {
        type: STRING(130),
        allowNull: true
      },
      filename: {
        type: STRING(20),
        allowNull: true
      },
      description: {
        type: TEXT,
        allowNull: true
      },
      type: {
        type: INTEGER,
        allowNull: true
      },
      profileImage: {
        type: STRING(20),
        allowNull: true
      },
      mediaFile: {
        type: STRING(20),
        allowNull: true
      },
      viewUrl: {
        type: STRING(130),
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('artifact_assets');
  }
};
