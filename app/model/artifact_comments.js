/* jshint indent: 2 */

module.exports = app => {

  const {
    BOOLEAN,
    INTEGER,
    DATE,
    TEXT
  } = app.Sequelize;

  const ArtifactComments = app.model.define('artifact_comments', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    artifactId: {
      type: INTEGER,
      allowNull: true
    },
    commenterId: {
      type: INTEGER,
      allowNull: true
    },
    content: {
      type: TEXT,
      allowNull: true
    },
    commentAt: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    visible: {
      type: BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'artifact_comments'
  });

  ArtifactComments.associate = function() {
    app.model.ArtifactComments.belongsTo(app.model.Users, {
      targetKey: 'Id',
      foreignKey: 'commenterId'
    });

    app.model.ArtifactComments.belongsTo(app.model.Artifacts, {
      targetKey: 'Id',
      foreignKey: 'artifactId'
    });
  };

  ArtifactComments.listComments = async function ({ offset = 0, limit = 10}) {
    return await this.findAndCountAll({
      offset,
      limit,
      order: [[ 'commentAt', 'desc' ]],
      include: [{
        model: app.model.Artifacts,
        attributes:['Id','name']
      },{
        model: app.model.Users,
        attributes:['Id','fullname']
      }],
    });
  }

  ArtifactComments.findByArtifactIdWithPage = async function ({
    offset = 0,
    limit = 10,
    artifactId = 0
  }) {
    return await this.findAndCountAll({
      offset,
      limit,
      order: [
        ['commentAt', 'desc'],
        ['Id', 'desc']
      ],
      where: {
        artifactId: artifactId
      },
      include: [{
        model: app.model.Artifacts,
        attributes:['Id','name']
      },{
        model: app.model.Users,
        attributes:['Id','fullname','avatarUrl']
      }],
    });
  }

  ArtifactComments.findCommentById = async function (Id) {
    const comment = await this.findById(Id);
    if (!comment) {
      throw new Error('comment not found');
    }
    return comment;
  }

  ArtifactComments.createComment = async function (artifactComments,transaction) {
    return await this.create(artifactComments,{
      transaction:transaction
    });
  }

  ArtifactComments.setVisible = async function ({
    Id = 0,
    visible = 0
  }) {
    return await this.update({
      visible: visible
    }, {
      where: {
        Id: Id
      }
    });
  }

  ArtifactComments.delCommentById = async function (Id,transaction) {
    return this.destroy({
      transaction:transaction,
      where : {
        Id:Id
      }
    });
  }

  ArtifactComments.delCommentByArtifactId = async function (artifactId,transaction) {
    return this.destroy({
      transaction:transaction,
      where : {
        artifactId:artifactId
      }
    });
  }

  ArtifactComments.delCommentByCommenterId = async function (commenterId,transaction) {
    return this.destroy({
      transaction:transaction,
      where : {
        commenterId:commenterId
      }
    });
  }

  ArtifactComments.searchCommentByContent = async function ({
    offset = 0,
    limit = 10,
    keyword = ''
  }) {

    let condition = {
      offset,
      limit,
      order: [
        ['commentAt', 'desc'],
        ['Id', 'desc']
      ],
      include: [{
        model: app.model.Artifacts,
        attributes:['Id','name']
      },{
        model: app.model.Users,
        attributes:['Id','fullname','avatarUrl']
      }],
    };

    if(keyword != null && keyword !=''){
      condition.where = {};
      condition.where.content = {
        [app.Sequelize.Op.like]: '%'+keyword+'%'
      }
    }

    return await this.findAndCountAll(condition);
  }

  ArtifactComments.searchCommentByUsername = async function ({
    offset = 0,
    limit = 10,
    keyword = ''
  }) {
    let condition = {};
    if (keyword != null && keyword !=''){
      condition = {
        offset,
        limit,
        order: [
          ['commentAt', 'desc'],
          ['Id', 'desc']
        ],
        include: [{
          model: app.model.Artifacts,
          attributes:['Id','name']
        },{
          model: app.model.Users,
          where:{
            fullname:{
                [app.Sequelize.Op.like]: '%'+keyword+'%'
            }
          },
          attributes:['Id','fullname','avatarUrl']
        }],
      };
    }
    else{
      condition = {
        offset,
        limit,
        order: [
          ['commentAt', 'desc'],
          ['Id', 'desc']
        ],
        include: [{
          model: app.model.Artifacts,
          attributes:['Id','name']
        },{
          model: app.model.Users,
          attributes:['Id','fullname','avatarUrl']
        }],
      };
    }


    return await this.findAndCountAll(condition);
  }

  ArtifactComments.searchCommentByArtifactsName = async function ({
    offset = 0,
    limit = 10,
    keyword = ''
  }) {
    let condition = {};
    if (keyword != null && keyword !=''){
      condition = {
        offset,
        limit,
        order: [
          ['commentAt', 'desc'],
          ['Id', 'desc']
        ],
        include: [{
          model: app.model.Artifacts,
          where:{
            name:{
                [app.Sequelize.Op.like]: '%'+keyword+'%'
            }
          },
          attributes:['Id','name']
        },{
          model: app.model.Users,
          attributes:['Id','fullname','avatarUrl']
        }],
      };
    }
    else{
      condition = {
        offset,
        limit,
        order: [
          ['commentAt', 'desc'],
          ['Id', 'desc']
        ],
        include: [{
          model: app.model.Artifacts,
          attributes:['Id','name']
        },{
          model: app.model.Users,
          attributes:['Id','fullname','avatarUrl']
        }],
      };
    }


    return await this.findAndCountAll(condition);
  }

  return ArtifactComments;
};
