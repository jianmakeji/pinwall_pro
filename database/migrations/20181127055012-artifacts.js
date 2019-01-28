'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      STRING,
      INTEGER,
      DATE,
      TEXT,
      BOOLEAN
    } = Sequelize;

    await queryInterface.createTable('artifacts', {
      Id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: INTEGER,
        allowNull: false,
        defaultValue: '0'
      },
      name: {
        type: STRING(130),
        allowNull: false,
        defaultValue: ''
      },
      description: {
        type: TEXT,
        allowNull: true
      },
      profileImage: {
        type: STRING(20),
        allowNull: false,
        defaultValue: ''
      },
      visible: {
        type: BOOLEAN,
        allowNull: true
      },
      createAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updateAt: {
        type: DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('artifacts');
  }
};
