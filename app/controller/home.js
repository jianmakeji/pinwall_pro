'use strict';

const Controller = require('egg').Controller;
const BaseController = require('./BaseController');

class HomeController extends BaseController {
  async index() {
    const ctx = this.ctx;
    await ctx.render('index.html',{
        user:ctx.user
    });
  }

  async logout(){
    const ctx = this.ctx;
    ctx.logout();
    await ctx.render('index.html');
  }

  async login() {
    const ctx = this.ctx;
    await ctx.render('login.html', {

    });
  }

  async relogin(){
    const ctx = this.ctx;
    await ctx.render('login.html', {
      message:'用户名密码错误，或者未激活!'
    });
  }

  async activeFailure(){
    const ctx = this.ctx;
    await ctx.render('login.html', {
      message:'激活失败!'
    });
  }

  async wxRelogin(){
    const ctx = this.ctx;
    await ctx.render('login.html', {
      message:'绑定成功，请先进入邮箱激活!!'
    });
  }

  async upload() {
    const ctx = this.ctx;
    if (ctx.isAuthenticated()){
      await ctx.render('upload.html', {

      });
    }
    else{
      ctx.session.returnTo = ctx.path;
      await ctx.render('login.html', {

      });
    }
  }

  async uploadWork(){
    const ctx = this.ctx;
    await ctx.render('uploadWork.html',{
        user:ctx.user
    });
  }

  async project(){
    const ctx = this.ctx;
    try{
      const data = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));
      await ctx.render('projects.html',{
          data:data,
          user:ctx.user
      });
    }
    catch(e){
        console.log(e);
      super.failure(e.message);
    }

  }

  async topics(){
    const ctx = this.ctx;
    await ctx.render('topics.html',{
        user:ctx.user
    });
  }

  async topicsAbout(){
    const ctx = this.ctx;
    await ctx.render('topicsAbout.html', {
        user:ctx.user
    });
  }

  async users(){
    const ctx = this.ctx;
    try{
      await ctx.render('users.html',{
          user:ctx.user
      });
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async workFolder(){
    const ctx = this.ctx;
    await ctx.render('workFolder.html',{
        user:ctx.user
    });
  }

  async userManager(){
    const ctx = this.ctx;
    await ctx.render('userManager.html',{
        user:ctx.user
    });
  }

  async updateSE(){
    const ctx = this.ctx;
    await ctx.render('updateSE.html',{
        user:ctx.user
    });
  }

  async workManager(){
    const ctx = this.ctx;
    await ctx.render('workManager.html',{
        user:ctx.user
    });
  }

  async commentManager(){
    const ctx = this.ctx;
    await ctx.render('commentManager.html',{
        user:ctx.user
    });
  }

  async topicsUpdate(){
    const ctx = this.ctx;
    await ctx.render('topicsUpdate.html',{
        user:ctx.user
    });
  }

  async children(){
    const ctx = this.ctx;
    await ctx.render('children.html');
  }

  async search(){
    const ctx = this.ctx;
    await ctx.render('search.html',{
        user:ctx.user
    });
  }

  async resetInfo(){
    const ctx = this.ctx;
    await ctx.render('resetInfo.html',{
        user:ctx.user
    });
  }

  async createTopics(){
    const ctx = this.ctx;
    await ctx.render('createTopics.html',{
        user:ctx.user
    });
  }

  async forgetPwd(){
    const ctx = this.ctx;
    await ctx.render('forgetPwd.html');
  }

  async register(){
    const ctx = this.ctx;
    await ctx.render('register.html');
  }

  async completeInfo(){
    const ctx = this.ctx;
    await ctx.render('completeInfo.html');
  }

  async wxCompleteInfo(){
    const ctx = this.ctx;
    await ctx.render('completeInfo.html',{
      message:'未激活，请先进入邮箱激活，或者重发邮件激活',
      tag:1
    });
  }

  async updatePwd(){
    const ctx = this.ctx;
    await ctx.render('updatePwd.html');
  }
}

module.exports = HomeController;
