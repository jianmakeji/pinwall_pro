'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER
    } = Sequelize;

    await queryInterface.createTable('topic_term', {
      Id: {
        type: INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      topicId: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      },
      termId: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('topic_term');
  }
};
