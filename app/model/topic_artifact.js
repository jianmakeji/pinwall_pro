/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

    const TopicArtifact = app.model.define('topic_artifact', {
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
  }, {
    tableName: 'topic_artifact'
  });

  TopicArtifact.createTopicArtifact = async function(topicArtifact,transaction){
    return this.create(topicArtifact,{
        transaction:transaction
    });
  }

  return TopicArtifact;
};
