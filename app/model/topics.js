module.exports  = app => {

  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const Topics = app.model.define('topics', {
    Id: {
      type: INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: INTEGER(11),
      allowNull: true
    },
    name: {
      type: STRING(64),
      allowNull: true
    },
    description: {
      type: TEXT,
      allowNull: true
    },
    status: {
      type: INTEGER(6),
      allowNull: true
    },
    jobTag: {
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
    tableName: 'topics'
  });

  Topics.associate = function() {
    app.model.Topics.belongsTo(app.model.Users, {targetKey: 'Id', foreignKey: 'userId'});

    app.model.Topics.belongsToMany(app.model.Terms, {
        through: {
          model: app.model.TopicTerm,
          unique: false
        },
        foreignKey: 'topicId',
        constraints: false
    });

    app.model.Topics.belongsToMany(app.model.Artifacts, {
        through: {
          model: app.model.TopicArtifact,
          unique: false
        },
        foreignKey: 'topicId',
        constraints: false
    });
  };

  Topics.listTopics = async function ({ offset = 0, limit = 10, jobTag = 0, subLimit = 0,status = 0,userId = 0 }) {

    let condition = {
      offset,
      limit,
      order: [[ 'createAt', 'desc' ]],
      where:{

      },
      include:[
        {
          model: app.model.Users,
          attributes:['Id','email','fullname','nickname','avatarUrl']
        },{
          model: app.model.Artifacts,
          through:{
            attributes:['topicId','artifactId'],
          },
          attributes:['Id','profileImage']
        }
      ]
    };

    let countCondition = {
      where:{

      }
    };

    if (jobTag != 0){
      condition.where.jobTag = jobTag;
      countCondition.where.jobTag = jobTag;
    }

    if (status != -1){
      condition.where.status = status;
      countCondition.where.status = status;
    }

    if (userId != -1){
      condition.where.userId = userId;
      countCondition.where.userId = userId;
    }

    let resultData = await this.findAll(condition);

    resultData.forEach((element, index)=>{
      const artifactSize = element.artifacts.length;
      element.user.gender = artifactSize;

      if (artifactSize > subLimit && subLimit != 0){
        let tempArray = element.artifacts.slice(0, subLimit);
        element.artifacts.length = 0;
        tempArray.forEach((artifact, index)=>{
          element.artifacts.push(artifact);
        });
      }
    });

    let result = {};
    result.rows = resultData;
    result.count = await this.count(countCondition);
    return result;
  }

  Topics.searchTopics = async function ({ offset = 0, limit = 10, jobTag = 0, subLimit = 0,status = 0,userId = 0, keyword='' }) {

    let condition = {
      offset,
      limit,
      order: [[ 'createAt', 'desc' ]],
      where:{

      },
      include:[
        {
          model: app.model.Users,
          attributes:['Id','email','fullname','nickname','avatarUrl']
        },{
          model: app.model.Artifacts,
          through:{
            attributes:['topicId','artifactId'],
          },
          attributes:['Id','profileImage']
        }
      ]
    };

    let countCondition = {
      where:{

      }
    };

    if (jobTag != 0){
      condition.where.jobTag = jobTag;
      countCondition.where.jobTag = jobTag;
    }

    if (status != -1){
      condition.where.status = status;
      countCondition.where.status = status;
    }

    if (userId != -1){
      condition.where.userId = userId;
      countCondition.where.userId = userId;
    }

    if (keyword != null && keyword != ''){
      condition.where.name = {
        [app.Sequelize.Op.like]: '%'+keyword+'%',
      };
      countCondition.where.name = {
        [app.Sequelize.Op.like]: '%'+keyword+'%',
      };
    }

    let resultData = await this.findAll(condition);

    resultData.forEach((element, index)=>{
      const artifactSize = element.artifacts.length;
      element.user.gender = artifactSize;

      if (artifactSize > subLimit && subLimit != 0){
        let tempArray = element.artifacts.slice(0, subLimit);
        element.artifacts.length = 0;
        tempArray.forEach((artifact, index)=>{
          element.artifacts.push(artifact);
        });
      }
    });

    let result = {};
    result.rows = resultData;
    result.count = await this.count(countCondition);
    return result;
  }

  Topics.getTopicAndArtifactById = async function ({ offset = 0, limit = 10, topicId = 0 }) {

    let condition = {
      order: [[ 'createAt', 'desc' ]],
      where:{
        Id:topicId
      },
      include:[
        {
          model: app.model.Users,
          attributes:['Id','email','fullname','nickname','avatarUrl']
        },{
          model: app.model.Artifacts,
          include:[{
            model:app.model.Users,
            attributes:['Id','fullname','avatarUrl','commentCount','artifactCount','medalCount','likeCount','createAt']
          }],
          through:{
            attributes:['topicId','artifactId'],
          },
          attributes:['Id','profileImage','name','medalCount','likeCount','commentCount','createAt']
        }
      ]
    };

    let resultData = await this.findAll(condition);
    const artifactSize = resultData[0].artifacts.length;

    let tempArray = [];

    if (artifactSize >= (limit + offset)){
      tempArray = resultData[0].artifacts.slice(offset,limit + offset);
    }
    else{
      tempArray = resultData[0].artifacts.slice(offset,artifactSize);
    }

    resultData[0].artifacts.length = 0;
    tempArray.forEach((artifact, index)=>{
      resultData[0].artifacts.push(artifact);
    });

    let result = {};
    result.rows = resultData[0];
    result.count = artifactSize;
    return result;
  }

  Topics.findArtifactByTopicId = async function(topicId){
    let condition = {
      order: [[ 'createAt', 'desc' ]],
      where:{
        Id:topicId
      },
      include:[
        {
          model: app.model.Artifacts,
          include:[{
            model:app.model.Users,
            attributes:['Id','fullname','createAt']
          },{
            model:app.model.ArtifactScores,
            attributes:['scorerId','score']
          }],
          through:{
            attributes:['topicId','artifactId'],
          },
          attributes:['Id','name','medalCount','likeCount','commentCount','createAt']
        }
      ]
    };

    return await this.findAll(condition);
  }

  Topics.findTopicById = async function (Id) {
    const topic = await this.findById(Id,{
      include:[
        {
          model: app.model.Terms,
          through:{
            attributes:['topicId','termId'],
          },
          attributes:['Id','name']
        },
        {
          model:app.model.Users,
          attributes:['Id','fullname']
        }
      ]
    });
    if (!topic) {
      throw new Error('topic not found');
    }
    return topic;
  }

  Topics.createTopic = async function (topic,transaction) {
    if (topic.name == '' || topic.name == null){
      throw new Error('名称不能为空');
    }
    else{
      return await this.create(topic,{
          transaction:transaction
      });
    }
  }

  Topics.updateTopic = async function (updateData,transaction) {

    const topic = await this.findByPk(updateData.Id);
    if (!topic) {
      throw new Error('topic not found');
    }
    return await this.update(updateData.updates,{
        transaction:transaction,
        where:{
            Id:updateData.Id
        }
    });
  }

  Topics.updateTopicStatus = async function (topicId,status) {

    return await this.update({
      status:status
    },{
      where:{
        Id:topicId
      }
    });
  }

  Topics.delTopicById = async function (id,transaction) {
    const topic = await this.findById(id);
    if (!topic) {
      throw new Error('topic not found');
    }
    return await this.destroy({
      transaction:transaction,
      where:{
        Id:id
      }
    });
  }

  return Topics;
};
