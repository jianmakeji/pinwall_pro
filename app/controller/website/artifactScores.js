'use strict'

const BaseController = require('../BaseController');

class ArtifactScoresController extends BaseController{

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
    };

    try{
      const result = await ctx.service.artifactScore.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async show() {
    const ctx = this.ctx;

    try{
      const result = await ctx.service.artifactScore.find(ctx.helper.parseInt(ctx.params.id));
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async create() {
    const ctx = this.ctx;
    try{
      const article = await ctx.service.artifactScore.create(ctx.request.body);
      super.success('打分成功!');
    }
    catch(e){
        console.log(e);
      super.failure(e.message);
    }
  }

  async update() {
    const ctx = this.ctx;
    const id = ctx.params.id;
    const updates = {
      mobile: ctx.request.body.mobile,
    };

    try{
      await ctx.service.artifactScore.update({ id, updates });
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
      await ctx.service.artifactScore.del(id);
      super.success('删除成功!');
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
      const result = await ctx.service.artifactScore.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async findByScorerIdWithPage() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      scorerId: ctx.helper.parseInt(ctx.query.scorerId),
    };
    try{
      const result = await ctx.service.artifactScore.list(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }
}

module.exports = ArtifactScoresController;
