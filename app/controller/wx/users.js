'use strict'

const BaseController = require('../BaseController');
var rp = require('request-promise');
var WXBizDataCrypt = require('../../utils/WXBizDataCrypt')

class UsersController extends BaseController {

  async createWxUser() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const mobile = body.mobile;
    const fullname = body.fullname;
    const password = body.password;
    const sessionKey = body.sessionKey;
    const iv = body.iv;
    const encryptedData = body.encryptedData;
    const smsCode = body.smsCode;
    const appId = 'wxa4cd6f777c8b75d0'

    let user = {
      mobile: mobile,
      fullname: fullname,
      password: password,
      openId: body.openid,
      nickname: body.nickname,
      gender: body.sex,
      city: body.city,
      province: body.province,
      country: body.country,
      avatarUrl: body.headimageurl,
      smsCode:smsCode,
    };
    try {
      var pc = new WXBizDataCrypt(appId, sessionKey);
      var data = pc.decryptData(encryptedData , iv);
      user.unionId = data.unionId;

      const result = await ctx.service.users.createUser(user);

      if (result) {
        let backObject = {
            message:'操作成功!',
            user:result,
            roleName:'user'
        }
        super.success(backObject);
      } else {
        super.failure('操作失败！请重新操作');
      }
    } catch (e) {
      super.failure(e.message);
    }

  }

  async bindWeixinInfoByMobile() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const mobile = body.mobile;
    const sessionKey = body.sessionKey;
    const iv = body.iv;
    const encryptedData = body.encryptedData;
    const appId = 'wxa4cd6f777c8b75d0';
    const smsCode = body.smsCode;

    let user = {
      openid: body.openid,
      nickname: body.nickname,
      headimageurl: body.headimageurl,
      sex: body.sex,
      province: body.province,
      city: body.city,
      country: body.country,
      smsCode:smsCode,
    };

    try {
      var pc = new WXBizDataCrypt(appId, sessionKey);
      var data = pc.decryptData(encryptedData , iv);
      user.unionid = data.unionId;

      const result = await ctx.service.users.bindWeixinInfoByMobile(mobile, smsCode, user);

      if (result) {
        let backObject = {
            message:'绑定成功!',
            user:result
        }
        super.success(backObject);
      }
      else{
        super.failure('绑定失败');
      }
    } catch (e) {
      super.failure(e.message);
    }
  }

  async getWxCode() {
    const ctx = this.ctx;
    const jscode = ctx.query.jscode;
    const iv =  ctx.query.iv;
    const encryptedData =  ctx.query.encryptedData;
    const appId = 'wxa4cd6f777c8b75d0';

    const requestUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=wxa4cd6f777c8b75d0&secret=aeb6d1ab0c59d4145bd00e146551f468&js_code=${jscode}&grant_type=authorization_code`;

    let data;
    await rp(requestUrl).promise().bind(this).then(function(repos) {
      data = repos;
    });

    let openid = JSON.parse(data).openid;
    let sessionKey = JSON.parse(data).session_key;

    let result = {
      openid: openid,
      sessionKey:sessionKey
    }
    if (openid) {
      var pc = new WXBizDataCrypt(appId, sessionKey);
      var userData = pc.decryptData(encryptedData , iv);
      const user = await ctx.service.users.findByUnionId(userData.unionId);
      result.user = user;
    }
    ctx.body = result;
  }

  async refreshUserInfo(){
    const ctx = this.ctx;
    try{
      const result = await ctx.service.users.find(ctx.helper.parseInt(ctx.params.id));
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

}

module.exports = UsersController;
