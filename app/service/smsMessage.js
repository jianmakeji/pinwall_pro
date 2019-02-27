'use strict';

const Service = require('egg').Service;
const smsUtil = require('../utils/SmsUtils.js');

class SmsMessage extends Service {

  async createSmsMessage(smsMessage) {
    let code = this.ctx.helper.randomNumber(6);
    smsMessage.code = code;

    let result = smsUtil.sendSMS(code,3);
    if (result && result.Message == 'OK' && result.Code == 'OK'){
      await this.ctx.model.SmsMessage.createSmsMessage(smsMessage);
      result = "发送成功！"
    }
    else{
      result = "发送失败！"
    }
  }

  async getDataByCondition(smsMessage) {
    return await this.ctx.model.SmsMessage.getDataByCondition(smsMessage);
  }

  async getCountDataByDatetime(syncType, date) {
    return await this.ctx.model.SmsMessage.getCountDataByDatetime(smsMessage);
  }

}

module.exports = SmsMessage;
