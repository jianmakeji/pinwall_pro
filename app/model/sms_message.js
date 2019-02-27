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
      allowNull: true,
      defaultValue: app.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'sms_message'
  });

  SmsMessage.createSmsMessage = async function (smsMessage) {
    return this.create({
      mobile: smsMessage.mobile,
      code: smsMessage.code,
    });
  }

  SmsMessage.getDataByCondition = async function (smsMessage) {
    return this.findOne({
      where:{
        mobile:smsMessage.mobile,
        code: smsMessage.code,
      }
    });
  }

  SmsMessage.getCountDataByDatetime = async function (smsMessage) {
    return this.count({
      where:{
        mobile:smsMessage.mobile,
        createtime:{
          [app.Sequelize.Op.gte]:smsMessage.createtime
        }
      }
    });
  }

  return SmsMessage;
};
