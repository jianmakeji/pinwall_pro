/* jshint indent: 2 */

module.exports = app => {

  const {  INTEGER  } = app.Sequelize;

  const ArtifactTerm = app.model.define('artifact_term', {
    artifactId: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    termId: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'artifact_term'
  });

  ArtifactTerm.associate = function() {

  }

  ArtifactTerm.listArtifactTerm = async function ({
    offset = 0,
    limit = 10,
    artifactId = 0
  }) {
    return await this.findAndCountAll({
      offset,
      limit,
      where: {
        artifactId: artifactId
      }
    });
  }

  ArtifactTerm.delArtifactTermByArtifactId = async function (artifactId,transaction) {
    return this.destroy({
      transaction:transaction,
      where : {
        artifactId:artifactId
      }
    });
  }

  ArtifactTerm.delArtifactTermByArtifactIdAndtermId = async function (artifactId,termIds,transaction) {
    return this.destroy({
      transaction:transaction,
      where : {
        artifactId:artifactId,
        termId:{
          [app.Sequelize.Op.in]:termIds,
        },
      }
    });
  }

  ArtifactTerm.createArtifactTerm = async function(artifactTerm,transaction){
    return this.create(artifactTerm,transaction);
  }

  return ArtifactTerm;
};
