/* jshint indent: 2 */

module.exports = app => {

  const { INTEGER } = app.Sequelize;

  const TopicTerm = app.model.define('topic_term', {
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
  }, {
    tableName: 'topic_term'
  });

  TopicTerm.delTopicTermByTopicId = async function (topicId,transaction) {
    return this.destroy({
      transaction:transaction,
      where : {
        topicId:topicId
      }
    });
  }

  TopicTerm.delTopicTermByTopicIdAndtermIds = async function (topicId,termIds,transaction) {
    return this.destroy({
      transaction:transaction,
      where : {
        topicId:topicId,
        termId:{
          [app.Sequelize.Op.in]:termIds,
        },
      }
    });
  }

  TopicTerm.createTopicTerm = async function(topicTerm,transaction){
    return this.create(topicTerm,{
        transaction:transaction
    });
  }

  return TopicTerm;
};
