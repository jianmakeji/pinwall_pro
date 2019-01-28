'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER,
      DATE,
      STRING,
      BOOLEAN
    } = Sequelize;

    await queryInterface.createTable('users', {
      Id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: STRING(64),
        allowNull: true
      },
      mobile: {
        type: STRING(15),
        allowNull: true
      },
      password: {
        type: STRING(64),
        allowNull: false,
        defaultValue: ''
      },
      openId: {
        type: STRING(64),
        allowNull: true
      },
      nickname: {
        type: STRING(30),
        allowNull: true
      },
      avatarUrl: {
        type: STRING(200),
        allowNull: true
      },
      gender: {
        type: INTEGER(3),
        allowNull: true
      },
      province: {
        type: STRING(20),
        allowNull: true
      },
      city: {
        type: STRING(20),
        allowNull: true
      },
      country: {
        type: STRING(20),
        allowNull: true
      },
      active: {
        type: BOOLEAN,
        allowNull: true
      },
      createAt: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      confirmedAt: {
        type: DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
