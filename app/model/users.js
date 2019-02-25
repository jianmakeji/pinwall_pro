/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const Users = app.model.define('users', {
    Id: {
      type: INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: STRING(64),
      allowNull: true
    },
    fullname:{
      type: STRING(30),
      allowNull: true
    },
    mobile: {
      type: STRING(15),
      allowNull: true
    },
    password: {
      type: STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    openId: {
      type: STRING(64),
      allowNull: true
    },
    unionId:{
      type: STRING(64),
      allowNull: true
    },
    nickname: {
      type: STRING(30),
      allowNull: true
    },
    avatarUrl: {
      type: STRING(200),
      allowNull: true
    },
    gender: {
      type: INTEGER(3),
      allowNull: true
    },
    province: {
      type: STRING(20),
      allowNull: true
    },
    city: {
      type: STRING(20),
      allowNull: true
    },
    country: {
      type: STRING(20),
      allowNull: true
    },
    active: {
      type: BOOLEAN,
      allowNull: true
    },
    wxActive: {
      type: BOOLEAN,
      allowNull: true
    },
    activeCode: {
      type: STRING(50),
      allowNull: true
    },
    commentCount: {
      type: INTEGER,
      allowNull: true
    },
    artifactCount: {
      type: INTEGER,
      allowNull: true
    },
    medalCount: {
      type: INTEGER,
      allowNull: true
    },
    likeCount: {
      type: INTEGER,
      allowNull: true
    },
    createAt: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    confirmedAt: {
      type: DATE,
      allowNull: true
    }
  }, {
    tableName: 'users'
  });

  Users.associate = function() {
    app.model.Users.hasMany(app.model.Artifacts,{sourceKey:'Id',foreignKey: 'userId'});
    app.model.Users.hasMany(app.model.Topics,{sourceKey:'Id',foreignKey: 'userId'});

    app.model.Users.belongsToMany(app.model.Roles, {
      through: {
        model: app.model.UserRole,
        unique: false
      },
      foreignKey: 'userId',
      constraints: false
    });
  };

  Users.listUsers = async function ({ offset = 0, limit = 10 }) {
    return this.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
      include:[
        app.model.Roles
      ]
    });
  }

  Users.findUserById = async function (id) {
    const user = await this.findById(id,{
      include:[
        app.model.Roles
      ]
    });
    if (!user) {
      throw new Error('user not found');
    }
    return user;
  }

  Users.createUser = async function (user) {
    return this.create(user);
  }

  Users.updateUser = async function ({ id, updates }) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('user not found');
    }
    return user.update(updates);
  }

  Users.delUserById = async function (id) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('user not found');
    }
    return user.destroy();
  }

  Users.findByUnionId = async function (unionId){

    return await this.findOne({
      where:{
        unionId:{[app.Sequelize.Op.eq]:unionId}
      },
      include:[
        {
          model: app.model.Roles,
          through:{
            attributes:['userId','roleId'],
          },
          attributes:['Id','name']
        }
      ],
      attributes:['Id','email','fullname','avatarUrl','wxActive']
    });
  }

  Users.findByUserWithEmail = async function (email){
    return await this.findOne({
      where:{
        email:email
      },
      include:[
        {
          model: app.model.Roles,
          through:{
            attributes:['userId','roleId'],
          },
          attributes:['Id','name']
        }
      ],
      attributes:['Id','email','fullname','nickname','avatarUrl','password']
    });
  }

  Users.loginFindByUserWithEmail = async function (email){
    return await this.findOne({
      where:{
        email:email,
        active:1,
      },
      include:[
        {
          model: app.model.Roles,
          through:{
            attributes:['userId','roleId'],
          },
          attributes:['Id','name']
        }
      ],
      attributes:['Id','email','fullname','nickname','avatarUrl','password']
    });
  }

  Users.updateUserActiveCodeByEmail = async function(email, activeCode){
    return await this.update({
      activeCode:activeCode
    },{
      where:{
        email:email
      }
    });
  }

  Users.updateAcviveByActiveCodeAndEmail = async function(email,activeCode,active){
    return await this.update({
      active:active
    },{
      where:{
        email:email,
        activeCode:activeCode
      }
    });
  }

  Users.updateAcviveByUserId = async function(userId,active){
    return await this.update({
      active:active
    },{
      where:{
        Id:userId
      }
    });
  }

  Users.updatePwdWithEmailAndActiveCode = async function(email, activeCode, newPwd){
    return await this.update({
      password:newPwd
    },{
      where:{
        email:email,
        activeCode:activeCode,
      }
    });
  }

  Users.updateWxActiveByActiveCodeAndUnionId = async function(unionId,activeCode,wxActive){
    return await this.update({
      wxActive:wxActive,
      active:wxActive
    },{
      where:{
        unionId:unionId,
        activeCode:activeCode
      }
    });
  }

  Users.findUserByEmail = async function(email){
    return await this.findOne({
      where:{
        email:email
      },
      include:[
        {
          model: app.model.Roles,
          through:{
            attributes:['userId','roleId'],
          },
          attributes:['Id','name']
        }
      ],
    });
  }

  Users.updateWxInfoByEmail = async function(wxInfo){
    return await this.update({
      openId:wxInfo.openId,
      unionId:wxInfo.unionId,
      nickname:wxInfo.nickname,
      avatarUrl:wxInfo.avatarUrl,
      gender:wxInfo.gender,
      province:wxInfo.province,
      city:wxInfo.city,
      country:wxInfo.country,
      wxActive:0,
      activeCode:wxInfo.activeCode,
    },{
      where:{
        email:wxInfo.email
      }
    });
  }

  Users.updatePwd = async function(userId, newPwd){
    return await this.update({
      password:newPwd,
    },{
      where:{
        Id:userId
      }
    });
  }

  Users.addComment = async function(id,transaction) {
    await this.update({
      commentCount: app.Sequelize.fn('1 + abs', app.Sequelize.col('commentCount'))
    }, {
      transaction:transaction,
      where: {
        Id: id
      }
    });
  }

  Users.addMedal = async function(id,transaction) {
    await this.update({
      medalCount: app.Sequelize.fn('1 + abs', app.Sequelize.col('medalCount'))
    }, {
      transaction:transaction,
      where: {
        Id: id
      }
    });
  }

  Users.addlike = async function(id,transaction) {
    await this.update({
      likeCount: app.Sequelize.fn('1 + abs', app.Sequelize.col('likeCount'))
    }, {
      transaction:transaction,
      where: {
        Id: id
      }
    });
  }

  Users.addArtifact = async function(id,transaction) {
    await this.update({
      artifactCount: app.Sequelize.fn('1 + abs', app.Sequelize.col('artifactCount'))
    }, {
      transaction:transaction,
      where: {
        Id: id
      }
    });
  }

  Users.reduceMedal = async function(id, num,transaction) {
    await this.update({
      medalCount: app.Sequelize.literal('`medalCount` - ' + num)
    }, {
      transaction:transaction,
      where: {
        Id: id
      }
    });
  }

  Users.reducelike = async function(id,num,transaction) {
    await this.update({
      likeCount: app.Sequelize.literal('`likeCount` - ' + num)
    }, {
      transaction:transaction,
      where: {
        Id: id
      }
    });
  }

  Users.reduceComment = async function(id,num,transaction) {
    await this.update({
      commentCount: app.Sequelize.literal('`commentCount` - ' + num)
    }, {
      transaction:transaction,
      where: {
        Id: id
      }
    });
  }

  Users.reduceArtifact = async function(id) {
    await this.update({
      artifactCount: app.Sequelize.literal('`artifactCount` - 1')
    }, {
      where: {
        Id: id
      }
    });
  }

  Users.reduceAllAggData = async function(id,medalNum,likeNum,commentNum,transaction) {
    await this.update({
      medalCount: app.Sequelize.literal('`medalCount` - ' + medalNum),
      likeCount: app.Sequelize.literal('`likeCount` - ' + likeNum),
      commentCount: app.Sequelize.literal('`commentCount` - ' + commentNum),
      artifactCount: app.Sequelize.literal('`artifactCount` - ' + 1)
    }, {
      transaction:transaction,
      where: {
        Id: id
      }
    });
  }

  Users.searchByUsername = async function({ offset = 0, limit = 10, fullname='' }){

    let condition = {
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
      include:[
        app.model.Roles
      ]
    };

    if(fullname != null && fullname !=''){
      condition.where = {};
      condition.where.fullname = {
        [app.Sequelize.Op.like]: '%'+fullname+'%'
      }
    }

    return this.findAndCountAll(condition);
  }

  Users.searchByEmail = async function({ offset = 0, limit = 10, email='' }){
    let condition = {
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
      include:[
        app.model.Roles
      ]
    };

    if(email != null && email !=''){
      condition.where = {};
      condition.where.email = {
        [app.Sequelize.Op.like]: '%'+email+'%'
      }
    }

    return this.findAndCountAll(condition);
  }

  return Users;
};
