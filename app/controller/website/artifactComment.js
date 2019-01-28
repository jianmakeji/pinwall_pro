'use strict'

const BaseController = require('../BaseController');

class ArtifactCommentController extends BaseController{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };

    try{
      const result = await ctx.service.artifactComment.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async findByArtifactIdWithPage() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      artifactId: ctx.helper.parseInt(ctx.query.artifactId),
    };

    try{
      const result = await ctx.service.artifactComment.findByArtifactIdWithPage(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async show() {
    const ctx = this.ctx;

    try{
      const result = await ctx.service.artifactComment.findCommentById(ctx.helper.parseInt(ctx.params.id));
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async create() {
    const ctx = this.ctx;
    const result = await ctx.service.artifactComment.create(ctx.request.body);
    if(result){
      super.success('操作成功!');
    }
    else{
      super.failure(e.message);
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      content: ctx.request.body.content,
      artifactId: ctx.request.body.artifactId,
      commenterId: ctx.request.body.commenterId
    };

    try{
      await ctx.service.artifactComment.update({ id, updates });
      super.success('更新成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async destroy() {
    const ctx = this.ctx;
    const id = ctx.helper.parseInt(ctx.params.id);

    try{
      await ctx.service.artifactComment.del(id);
      super.success('删除成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async setCommentVisible() {
    const ctx = this.ctx;
    const updates = {
      Id:ctx.request.body.id,
      visible: ctx.request.body.visible,
    };

    try{
      await ctx.service.artifactComment.update(updates);
      super.success('更新成功!');
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async searchComment(){
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      field: ctx.helper.parseInt(ctx.query.field),
      keyword:ctx.query.keyword
    };

    try{
      const result = await ctx.service.artifactComment.searchByKeyword(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }
}

module.exports = ArtifactCommentController;
