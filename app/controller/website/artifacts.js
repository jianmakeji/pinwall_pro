'use strict'

const BaseController = require('../BaseController');

class ArtifactsController extends BaseController{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      visible: ctx.helper.parseInt(ctx.query.visible),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
    };

    try{
      const result = await ctx.service.artifacts.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async show() {
    const ctx = this.ctx;

    try{
      const result = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async create() {
    const ctx = this.ctx;
    let artifact = ctx.request.body;
    artifact.userId = ctx.user.Id;
    let result = await ctx.service.artifacts.create(ctx.request.body);
    if(result){
      super.success('创建成功!');
    }
    else{
      super.failure("操作失败或者作业荚已关闭!");
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = ctx.request.body;
    let result = await ctx.service.artifacts.update({ id, updates });
    if(result){
      super.success('更新成功!');
    }
    else{
      super.failure("更新失败");
    }
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);
    let result = await ctx.service.artifacts.del(id);
    if(result){
      super.success('删除成功!');
    }
    else{
      super.failure('删除失败');
    }
  }

  async getMedalDataByRandom(){
    const ctx = this.ctx;
    const limit = ctx.params.limit;
    try{
      ctx.body = await ctx.service.artifacts.getMedalDataByRandom(limit);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async getPersonalJob() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
    };
    query.userId = ctx.user.Id;
    try{
      const result = await ctx.service.artifacts.getPersonalJobByUserId(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async getPersonalJobByUserId() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      userId: ctx.helper.parseInt(ctx.query.userId),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
    };

    try{
      const result = await ctx.service.artifacts.getPersonalJobByUserId(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async transterInsertDataToES(){
    const ctx = this.ctx;
    const ids = ctx.query.ids;

    const idArray = ids.split(',');
    if (idArray.length > 0){
        let result = await ctx.service.artifacts.transterInsertDataToES(idArray);
        if (result){
            super.success("同步成功");
        }
        else{
            super.failure("同步失败");
        }
    }
    else{
        super.failure("没有数据需要同步");
    }

  }

  async transterUpdateDataToES(){
    const ctx = this.ctx;
    const ids = ctx.query.ids;

    const idArray = ids.split(',');
    if (idArray.length > 0){
        let result = await ctx.service.artifacts.transterUpdateDataToES(idArray);
        if (result){
            super.success("同步成功");
        }
        else{
            super.failure("同步失败");
        }
    }
    else{
        super.failure("没有数据需要同步");
    }
  }
}

module.exports = ArtifactsController;
