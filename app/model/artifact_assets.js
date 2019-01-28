/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const ArtifactAssets = app.model.define('artifact_assets', {
    Id: {
      type:INTEGER,
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    artifactId: {
      type:INTEGER,
      allowNull: false,
    },
    position: {
      type:INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    name: {
      type:STRING(130),
      allowNull: true
    },
    filename: {
      type:STRING(100),
      allowNull: true
    },
    imagename: {
      type:STRING(100),
      allowNull: true
    },
    description: {
      type:TEXT,
      allowNull: true
    },
    type: {
      type:INTEGER,
      allowNull: true
    },
    profileImage: {
      type:STRING(26),
      allowNull: true
    },
    mediaFile: {
      type:STRING(20),
      allowNull: true
    },
    viewUrl: {
      type:STRING(130),
      allowNull: true
    }
  }, {
    tableName: 'artifact_assets'
  });

  ArtifactAssets.associate = function() {
      app.model.ArtifactAssets.belongsTo(app.model.Artifacts, {targetKey: 'Id', foreignKey: 'artifactId'});
  }

  ArtifactAssets.createAssets = async function (artifactAssets,transaction) {
    return this.create(artifactAssets,{
      transaction:transaction
    });
  }

  ArtifactAssets.delAssetsByArtifactId = async function (artifactId,transaction) {

    return this.destroy({
      transaction:transaction,
      where:{
          artifactId:artifactId,
      },
    });
  }

  ArtifactAssets.delAssetsByArtifactAssetsId = async function (assetsId,transaction) {

    return this.destroy({
      transaction:transaction,
      where:{
          Id:{
            [app.Sequelize.Op.in]:assetsId,
          },
      },
    });
  }

  return ArtifactAssets;
};
