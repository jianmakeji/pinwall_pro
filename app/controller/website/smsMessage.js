'use strict'

const BaseController = require('../BaseController');

class SmsMessageController extends BaseController{

  async createSmsMessage() {
    const ctx = this.ctx;
    const query = {
      mobile: ctx.query.mobile,
    };

    try{
      const result = await ctx.service.smsMessage.createSmsMessage(query);
      if(result){
        super.success('发送成功!');
      }
      else{
        super.failure('发送失败.信息每天不能超过10条.');
      }
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async vertifySms(){
    const ctx = this.ctx;
    const smsCode = ctx.query.smsCode;
    const mobile = ctx.query.mobile;
    try{
      ctx.body = await ctx.service.smsMessage.getDataByCondition({mobile:mobile,code:smsCode});
    }
    catch(e){
      super.failure(e.message);
    }
  }

}

module.exports = SmsMessageController;
