/* jshint indent: 2 */

module.exports = app => {

  const {
    STRING,
    INTEGER,
    DATE,
    TEXT
  } = app.Sequelize;

  const Artifacts = app.model.define('artifacts', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    name: {
      type: STRING(130),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: TEXT,
      allowNull: true
    },
    profileImage: {
      type: STRING(20),
      allowNull: false,
      defaultValue: ''
    },
    visible: {
      type: INTEGER,
      allowNull: true
    },
    jobTag: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    medalCount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    likeCount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    commentCount: {
      type: INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    createAt: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updateAt: {
      type: DATE,
      allowNull: true
    }
  }, {
    tableName: 'artifacts'
  });

  Artifacts.associate = function() {
    app.model.Artifacts.belongsTo(app.model.Users, {
      targetKey: 'Id',
      foreignKey: 'userId'
    });
    Artifacts.ArtifactAssets = app.model.Artifacts.hasMany(app.model.ArtifactAssets, {
      sourceKey: 'Id',
      foreignKey: 'artifactId'
    });
    Artifacts.ArtifactScores = app.model.Artifacts.hasMany(app.model.ArtifactScores, {
      sourceKey: 'Id',
      foreignKey: 'artifactId'
    });
    Artifacts.ArtifactComments = app.model.Artifacts.hasMany(app.model.ArtifactComments, {
      sourceKey: 'Id',
      foreignKey: 'artifactId'
    });
    Artifacts.ArtifactMedalLike = app.model.Artifacts.hasMany(app.model.ArtifactMedalLike, {
      sourceKey: 'Id',
      foreignKey: 'artifactId'
    });

    app.model.Artifacts.belongsToMany(app.model.Topics, {
      through: {
        model: app.model.TopicArtifact,
        unique: false,
      },
      foreignKey: 'artifactId',
      constraints: false
    });

    app.model.Artifacts.belongsToMany(app.model.Terms, {
      through: {
        model: app.model.ArtifactTerm,
        unique: false,
      },
      foreignKey: 'artifactId',
      constraints: false
    });
  };

  Artifacts.listArtifacts = async function({
    offset = 0,
    limit = 10,
    visible = 0,
    jobTag = 0
  }) {

    let condition = {
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      include: [{
        model: app.model.ArtifactAssets
      },{
        model: app.model.Users,
        attributes:['Id','fullname']
      }],
      where:{}
    };

    let countCondition = {
      where:{

      }
    };

    if (jobTag != 0) {
      condition.where.jobTag = jobTag;
      countCondition.where.jobTag = jobTag;
    }

    if (visible != -1){
      condition.where.visible = visible;
      countCondition.where.visible = visible;
    }

    let result = {};
    result.rows = await this.findAll(condition);
    result.count = await this.count(countCondition);
    return result;
  }

  Artifacts.getPersonalJobByUserId = async function({
    offset = 0,
    limit = 10,
    userId = 0,
    jobTag = 0
  }) {

    let condition = {
      offset,
      limit,
      order: [
        ['createAt', 'desc']
      ],
      include: [{
        model: app.model.ArtifactAssets
      },{
        model: app.model.Users,
        attributes:['Id','fullname','avatarUrl','commentCount','artifactCount','medalCount','likeCount','createAt']
      }],
      where:{
        userId:userId,
        visible:0
      }
    };

    let countCondition = {
      where:{
        userId:userId,
        visible:0
      }
    };

    if (jobTag != 0) {
      condition.where.jobTag = jobTag;
      countCondition.where.jobTag = jobTag;
    }

    let result = {};
    result.rows = await this.findAll(condition);
    result.count = await this.count(countCondition);
    return result;
  }

  Artifacts.findArtifactById = async function(id) {
    const artifact = await this.findByPk(id,{
      include: [{
        model: app.model.ArtifactAssets
      },{
        model: app.model.Users,
        attributes:['Id','fullname','avatarUrl']
      },{
        model: app.model.Topics,
        through:{
          attributes:['topicId','artifactId'],
        },
        attributes:['Id','name','userId','status']
      },{
        model: app.model.Terms,
        through:{
          attributes:['termId','artifactId'],
        },
        attributes:['Id','name']
      },{
        model: app.model.ArtifactScores
      }]
    });
    if (!artifact) {
      throw new Error('artifact not found');
    }
    return artifact;
  }

  Artifacts.createArtifact = async function(artifact,transaction) {
    return this.create(artifact, {
      transaction:transaction,
      include: [
        Artifacts.ArtifactAssets
      ]
    });
  }

  Artifacts.updateArtifact = async function({
    id,
    updates
    },transaction) {
    const artifact = await this.findByPk(id);
    if (!artifact) {
      throw new Error('artifact not found');
    }
    return artifact.update(updates,{
        transaction:transaction
    });
  }

  Artifacts.delArtifactById = async function(id, transaction) {
    const artifact = await this.findById(id,{
      transaction:transaction
    });
    if (!artifact) {
      throw new Error('artifact not found');
    }
    return artifact.destroy({
      transaction:transaction
    });
  }

  Artifacts.addComment = async function(id) {
    await this.update({
      commentCount: app.Sequelize.fn('1 + abs', app.Sequelize.col('commentCount'))
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.addMedal = async function(id) {
    await this.update({
      medalCount: app.Sequelize.fn('1 + abs', app.Sequelize.col('medalCount'))
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.addlike = async function(id) {
    await this.update({
      likeCount: app.Sequelize.fn('1 + abs', app.Sequelize.col('likeCount'))
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.reduceMedal = async function(id) {
    await this.update({
      medalCount: app.Sequelize.literal('`medalCount` - 1')
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.reducelike = async function(id) {
    await this.update({
      likeCount: app.Sequelize.literal('`likeCount` - 1')
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.reduceComment = async function(id) {
    await this.update({
      commentCount: app.Sequelize.literal('`commentCount` - 1')
    }, {
      where: {
        Id: id
      }
    });
  }

  Artifacts.getMedalDataByRandom = async function(){
    return this.findAll({
      where:{
        medalCount:{
          [app.Sequelize.Op.gt]:0
        },
        visible:0
      },
      include: [{
          model: app.model.Users
      }],
      //attributes:['Id','userId','name','profileImage']
    });
  }

  Artifacts.findArtifactByTime = async function(lastSyncTime,tag) {
    let condition = {
      include: [{
        model: app.model.ArtifactAssets
      },{
        model: app.model.Users,
        attributes:['Id','fullname','avatarUrl']
      },{
        model: app.model.Topics,
        through:{
          attributes:['topicId','artifactId'],
        },
        attributes:['Id','name','userId','status']
      },{
        model: app.model.Terms,
        through:{
          attributes:['termId','artifactId'],
        },
        attributes:['Id','name']
      },{
        model: app.model.ArtifactScores
      }]
    };

    condition.where = {};
    if (tag == 0){
      condition.where.createAt = {
        [app.Sequelize.Op.gte]: lastSyncTime
      };
    }
    else{
      condition.where.updateAt = {
        [app.Sequelize.Op.gte]: lastSyncTime
      };
    }

    const result = await this.findAll(condition);

    return result;
  }

  Artifacts.transferArtifacts = async function() {

    let condition = {
      order: [
        ['createAt', 'desc']
      ],
      include: [{
        model: app.model.Users,
        attributes:['Id','fullname','avatarUrl']
      },{
        model: app.model.Topics,
        through:{
          attributes:['topicId','artifactId'],
        },
        attributes:['Id','name','jobTag']
      },{
        model: app.model.Terms,
        through:{
          attributes:['termId','artifactId'],
        },
        attributes:['Id','name']
      },{
        model: app.model.ArtifactScores
      }]
    };


    let result  = await this.findAll(condition);
    return result;
  }

  Artifacts.transterDataToES = async function(idArray) {

    let condition = {
      where:{
        Id:{
            [app.Sequelize.Op.in]: idArray
        }
      },
      order: [
        ['createAt', 'desc']
      ],
      include: [{
        model: app.model.Users,
        attributes:['Id','fullname','avatarUrl']
      },{
        model: app.model.Topics,
        through:{
          attributes:['topicId','artifactId'],
        },
        attributes:['Id','name','jobTag']
      },{
        model: app.model.Terms,
        through:{
          attributes:['termId','artifactId'],
        },
        attributes:['Id','name']
      },{
        model: app.model.ArtifactScores
      }]
    };

    let result  = await this.findAll(condition);
    return result;
  }

  return Artifacts;
};
