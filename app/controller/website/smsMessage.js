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
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async getDataByCondition(){
    const ctx = this.ctx;
    const limit = ctx.params.limit;
    try{
      ctx.body = await ctx.service.artifacts.getDataByCondition(limit);
    }
    catch(e){
      super.failure(e.message);
    }
  }

}

module.exports = SmsMessageController;
