/* jshint indent: 2 */

module.exports = app => {

  const { INTEGER } = app.Sequelize;

  const UserRole = app.model.define('user_role', {
    Id: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    },
    userId: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    roleId: {
      type: INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'user_role'
  });

  UserRole.creteUserRole = async function(userId,roleId) {
    const userRole = {
      userId:userId,
      roleId:roleId
    };
     return await this.create(userRole);
  }

  UserRole.delUserRoleByUserId = async function(userId) {
    return await this.destroy({
      where:{
        userId:userId
      }
    });
  }

  UserRole.delUserRoleByRoleId = async function(roleId) {
    return await this.destroy({
      where:{
        roleId:roleId
      }
    });
  }

  UserRole.updateUserRole = async function(userId, operation){
    let roleId = 1;
    if (operation == 'user'){
      roleId = 1;
    }
    else if (operation == 'vip'){
      roleId = 2;
    }
    return await this.update({
      roleId:roleId
    },{
      where:{
        userId:userId
      }
    });
  }

  return UserRole;
};
