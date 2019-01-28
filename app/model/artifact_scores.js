/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE } = app.Sequelize;

  const ArtifactScores = app.model.define('artifact_scores', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    artifactId: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    scorerId: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    score: {
      type: INTEGER,
      allowNull: true
    },
    createAt: {
      type: DATE,
      allowNull: true,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateAt: {
      type: DATE,
      allowNull: true
    }
  }, {
    tableName: 'artifact_scores'
  });

  ArtifactScores.associate = function() {
      app.model.ArtifactScores.belongsTo(app.model.Artifacts, {targetKey: 'Id', foreignKey: 'artifactId'});
  }

  ArtifactScores.listArtifactScores = async function ({
    offset = 0,
    limit = 10
  }) {
    return await this.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc'],
        ['Id', 'desc']
      ]
    });
  }

  ArtifactScores.findOneByArtifactIdAndScorerId = async function({
    artifactId = 0,
    scorerId = 0
  }){
    return this.findOne({
      where:{
        artifactId:artifactId,
        scorerId:scorerId,
      }
    });
  };

  ArtifactScores.findByArtifactIdWithPage = async function ({
    offset = 0,
    limit = 10,
    artifactId = 0
  }) {
    return this.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      where: {
        artifactId: artifactId,
      }
    });
  }

  ArtifactScores.findByScorerIdWithPage = async function ({
    offset = 0,
    limit = 10,
    scorerId = 0
  }) {
    return this.findAndCountAll({
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      where: {
        scorerId:scorerId
      }
    });
  }

  ArtifactScores.createArtifactScores = async function (artifactScores) {
    return this.create(artifactScores);
  }

  ArtifactScores.updateScore = async function (
    artifactId,
    scorerId,
    score
  ) {

    return this.update({
      score: score
    }, {
      where: {
        artifactId: artifactId,
        scorerId: scorerId
      }
    });
  }

  ArtifactScores.delArtifactScoresByArtifactId = async function (artifactId) {
    return this.destroy({
      where:{
        artifactId:artifactId
      }
    });
  }

  ArtifactScores.delArtifactScoresByScorerId = async function (scorerId) {
    return this.destroy({
      where:{
        scorerId:scorerId
      }
    });
  }

  return ArtifactScores;
};
