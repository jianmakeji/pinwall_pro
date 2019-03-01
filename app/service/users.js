'use strict';

const Service = require('egg').Service;
const UUID = require('uuid');
const moment = require('moment');

class Users extends Service {

  async list({
    offset = 0,
    limit = 10
  }) {
    return this.ctx.model.Users.listUsers({
      offset,
      limit
    });
  }

  async find(id) {
    const user = await this.ctx.model.Users.findUserById(id);

    return user;
  }

  async createUser(user) {
    if (user.mobile == '' || user.mobile == null) {
      throw new Error('用户电话号码不能为空');
    } else {
      const userObj = await this.ctx.model.Users.findUserByMobile(user.mobile);
      if (userObj) {
        throw new Error('用户已经存在');
      } else {
        //判断短信验证码是否正确
        let curDate = new Date();
        let preDate = moment(new Date(curDate.getTime() - 30 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss');
        let smsObject = await this.ctx.model.SmsMessage.getDataByCondition({
          mobile: user.mobile,
          code: user.smsCode
        });
        if (smsObject) {
          if (smsObject.createtime > preDate) {
            let transaction;
            try {
              transaction = await this.ctx.model.transaction();
              const helper = this.ctx.helper;
              user.password = helper.cryptoPwd(helper.cryptoPwd(user.password));
              user.activeCode = UUID.v1();
              user.active = 1;
              const createUserObj = await this.ctx.model.Users.createUser(user, transaction);
              await this.ctx.model.UserRole.creteUserRole(createUserObj.Id, 1, transaction);
              await transaction.commit();

              return createUserObj;
            } catch (e) {
              await transaction.rollback();
              return false;
            }
          } else {
            throw new Error('手机验证码失效');
          }
        } else {
          throw new Error('手机验证码不正确');
        }
      }
    }
  }

  async update({
    id,
    updates
  }) {
    return this.ctx.model.Users.updateUser({
      id,
      updates
    });
  }

  async del(id) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      await this.ctx.model.Users.delUserById(id, transaction);
      await this.ctx.model.UserRole.delUserRoleByUserId(id, transaction);
      await this.ctx.model.Artifacts.delArtifactById(id, transaction);
      await this.ctx.model.ArtifactAssets.delAssetsByArtifactId(id, transaction);
      await this.ctx.model.ArtifactAssets.delCommentByArtifactId(id, transaction);
      await transaction.commit();
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }

  }

  async findByUnionId(unionId) {
    return await this.ctx.model.Users.findByUnionId(unionId);
  }

  async findByUserWithMobile(mobile) {
    return await this.ctx.model.Users.findByUserWithMobile(mobile);
  }

  async loginFindByUserWithMobile(mobile) {
    return await this.ctx.model.Users.loginFindByUserWithMobile(mobile);
  }

  async updateAcviveByUserId(userId) {
    return await this.ctx.model.Users.updateAcviveByUserId(userId);
  }

  async bindWeixinInfoByMobile(mobile, smsCode, user) {
    let wxInfo = {};
    wxInfo.mobile = mobile;
    wxInfo.openId = user.openid;
    wxInfo.nickname = user.nickname;
    wxInfo.avatarUrl = user.headimageurl;
    wxInfo.gender = user.sex;
    wxInfo.province = user.province;
    wxInfo.city = user.city;
    wxInfo.country = user.country;
    wxInfo.unionId = user.unionid;

    let curDate = new Date();
    let preDate = moment(new Date(curDate.getTime() - 30 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss');
    let smsObject = await this.ctx.model.SmsMessage.getDataByCondition({
      mobile: mobile,
      code: smsCode
    });
    if (smsObject) {
      if (smsObject.createtime > preDate) {
        let userObject = this.ctx.model.Users.findUserByMobile(mobile);
        if (userObject) {
          await this.ctx.model.Users.updateWxInfoByMobile(wxInfo);
          return userObject;
        } else {
          throw new Error('绑定用户不存在');
        }
      } else {
        throw new Error('手机验证码失效');
      }
    } else {
      throw new Error('手机验证码不正确');
    }

  }

  async updatePwd(userId, newPwd) {
    try {
      await this.ctx.model.Users.updatePwd(userId, newPwd);
      return true;
    } catch (e) {
      return false;
    }

  }

  async updatePwdWithMobileAndSmsCode(mobile, smsCode, newPwd) {
    try {
      const helper = this.ctx.helper;
      let curDate = new Date();
      let preDate = moment(new Date(curDate.getTime() - 30 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss');
      let smsObject = await this.ctx.model.SmsMessage.getDataByCondition({
        mobile: mobile,
        code: smsCode
      });
      if (smsObject) {
        if (smsObject.createtime > preDate) {
          const password = helper.cryptoPwd(helper.cryptoPwd(newPwd));
          await this.ctx.model.Users.updatePwdWithMobileAndSmsCode(mobile, password);
          return {
            success: true,
            message: '修改成功!'
          };
        } else {
          return {
            success: false,
            message: '验证码超时!'
          };
        }
      } else {
        return {
          success: false,
          message: '验证码错误!'
        };
      }

    } catch (e) {
      return {
        success: false,
        message: e.message
      };
    }
  }

  async updateUserRole(userId, operation) {
    try {
      await this.ctx.model.UserRole.updateUserRole(userId, operation);
      return true;
    } catch (e) {
      return false;
    }
  }

  async searchByUsername(query) {
    return await this.ctx.model.Users.searchByUsername(query);
  }

  async searchByMobile(query) {
    return await this.ctx.model.Users.searchByMobile(query);
  }

}

module.exports = Users;
