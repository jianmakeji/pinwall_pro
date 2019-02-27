'use strict';

const Service = require('egg').Service;
const smsUtil = require('../utils/SmsUtils.js');

class SmsMessage extends Service {

  async createSmsMessage(smsMessage) {
    let code = this.ctx.helper.randomNumber(6);
    smsMessage.code = code;

    let smsSendResult = await smsUtil.sendSMS(smsMessage,3);

    let result = '';

    if (smsSendResult.Code == 'OK'){
      await this.ctx.model.SmsMessage.createSmsMessage(smsMessage);
      result = "发送成功！"
    }
    else{
      result = "发送失败！"
    }

    return result;
  }

  async getDataByCondition(smsMessage) {
    let curDate = new Date();
    let preDate = new Date(curDate.getTime() - 30 * 60 * 1000);
    let smsObject = await this.ctx.model.SmsMessage.getDataByCondition(smsMessage);
    if (smsObject){
      if(smsObject.createtime > preDate){
        return {success:true,data:'验证成功',status:200};
      }
      else{
        return {success:true,data:'验证码过时',status:500};
      }
    }
    else{
      return {success:true,data:'验证失败',status:500};
    }
  }

  async getCountDataByDatetime(syncType, date) {
    return await this.ctx.model.SmsMessage.getCountDataByDatetime(smsMessage);
  }

}

module.exports = SmsMessage;
