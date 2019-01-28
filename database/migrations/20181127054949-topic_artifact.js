'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const {
      INTEGER
    } = Sequelize;

    await queryInterface.createTable('topic_artifact', {
      topicId: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0',
        primaryKey: true
      },
      artifactId: {
        type: INTEGER(11),
        allowNull: false,
        defaultValue: '0'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('topic_artifact');
  }
};
