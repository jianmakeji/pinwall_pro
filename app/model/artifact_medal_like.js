/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const ArtifactMedalLike = app.model.define('artifact_medal_like', {
    Id: {
      type:INTEGER,
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    tag: {
      type:INTEGER,
      allowNull: false,
    },
    userId: {
      type:INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    artifactId: {
      type:INTEGER,
      allowNull: true
    },
    createAt: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'artifact_medal_like'
  });

  ArtifactMedalLike.associate = function() {
      app.model.ArtifactAssets.belongsTo(app.model.Artifacts, {targetKey: 'Id', foreignKey: 'artifactId'});
  }

  ArtifactMedalLike.createMedalAndLike = async function (artifactMedalLike,transaction) {
    return this.create(artifactMedalLike,{
        transaction:transaction
    });
  }

  ArtifactMedalLike.delMedalAndLikeByArtifactId = async function (artifactId) {

    return this.destroy({
      where:{
          artifactId:artifactId,
      },
    });
  }

  ArtifactMedalLike.delMedalAndLikeByArtifactIdAndUserId = async function(artifactMedalLike,transaction){
      return this.destroy({
          transaction:transaction,
          where:{
              artifactId: artifactMedalLike.artifactId,
              userId: artifactMedalLike.userId,
              tag:artifactMedalLike.tag,
          }
      });
  }

  ArtifactMedalLike.findByArtifactIdAndUserId = async function (artifactMedalLike){
    return this.findOne({
      where:{
        artifactId: artifactMedalLike.artifactId,
        userId: artifactMedalLike.userId,
        tag:artifactMedalLike.tag,
      },
    });
  }

  return ArtifactMedalLike;
};
