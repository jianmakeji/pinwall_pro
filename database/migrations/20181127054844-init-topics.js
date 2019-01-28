'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER,
      DATE,
      STRING,
      TEXT
    } = Sequelize;

    await queryInterface.createTable('topics', {
      Id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: INTEGER(11),
        allowNull: true
      },
      name: {
        type: STRING(64),
        allowNull: true
      },
      description: {
        type: TEXT,
        allowNull: true
      },
      status: {
        type: INTEGER(6),
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
    await queryInterface.dropTable('topics');
  }
};
