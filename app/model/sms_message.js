/* jshint indent: 2 */

module.exports = app => {

  const { INTEGER, STRING, DATE } = app.Sequelize;

  const SmsMessage = app.model.define('smsMessage', {
    Id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    remoteAddress: {
      type: STRING,
      allowNull: true
    },
    remoteHost: {
      type: STRING,
      allowNull: true
    },
    mobile: {
      type: STRING,
      allowNull: true
    },
    code: {
      type: STRING,
      allowNull: true
    },
    createtime: {
      type: DATE,
      allowNull: true
    }
  }, {
    tableName: 'sms_message'
  });

  SmsMessage.createSmsMessage = async function (smsMessage) {
    return this.create({
      remoteAddress: smsMessage.remoteAddress,
      remoteHost: smsMessage.remoteHost,
      mobile: smsMessage.mobile,
      code: smsMessage.code,
    });
  }

  SmsMessage.getDataByCondition = async function (smsMessage) {
    return this.findAll({
      where:{
        remoteAddress:remoteAddress,
        remoteHost:remoteHost,
        code: smsMessage.code,
      }
    });
  }

  EsSyncData.getCountDataByDatetime = async function (smsMessage) {
    return this.count({
      where:{
        remoteAddress:smsMessage.remoteAddress,
        remoteHost:smsMessage.remoteHost,
        createtime:{
          [app.Sequelize.Op.gte]:smsMessage.createtime
        }
      }
    });
  }

  return SmsMessage;
};
