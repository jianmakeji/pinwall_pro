/* jshint indent: 2 */

module.exports = app => {

  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Roles = app.model.define('roles', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(30),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'roles'
  });

  Roles.associate = function() {

    app.model.Roles.belongsToMany(app.model.Users, {
      through: {
        model: app.model.UserRole,
        unique: false,
        scope: {
          taggable: 'roles'
        }
      },
      foreignKey: 'roleId',
      constraints: false
    });
  };

  Roles.listRoles = async function ({ offset = 0, limit = 10 }) {
    return this.findAndCountAll({
      offset,
      limit,
      order: [[ 'createAt', 'desc' ], [ 'Id', 'desc' ]],
    });
  }

  Roles.findRoleById = async function (Id) {
    const role = await this.findById(Id);
    if (!role) {
      throw new Error('role not found');
    }
    return role;
  }

  Roles.createRole = async function (role) {

      const roleObj = await this.findAll({
        where:{
          name:role.name
        }
      });
      if (roleObj.length == 0){
        return this.create(role);
      }
      else{
        return roleObj[0];
      }

  }

  Roles.updateRole = async function ({ Id, updates }) {
    const role = await this.findById(id);
    if (!role) {
      throw new Error('role not found');
    }
    return this.update(updates);
  }

  Roles.delRoleById = async function (id) {
    const role = await this.findById(id);
    if (!role) {
      throw new Error('role not found');
    }
    return this.destroy();
  }

  return Roles;
};
