'use strict';

const Service = require('egg').Service;

class SmsMessage extends Service {

  async createSmsMessage(smsMessage) {
    let code = this.ctx.helper.randomNumber(6);
    smsMessage.code = code;
    let curDate = new Date();
    let preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
    smsMessage.createtime = preDate;
    let count = await this.ctx.model.SmsMessage.getCountDataByDatetime(smsMessage);
    let result = "发送成功!"
    if (count >= 10){
      result = "一天内不能发送超过10条信息!"
    }
    else{
      await this.ctx.model.SmsMessage.createSmsMessage(smsMessage);
    }
    return result;
  }

  async getDataByCondition(smsMessage) {
    return await this.ctx.model.SmsMessage.getDataByCondition(smsMessage);
  }

  async getCountDataByDatetime(syncType, date) {
    return await this.ctx.model.SmsMessage.getCountDataByDatetime(smsMessage);
  }

}

module.exports = SmsMessage;
