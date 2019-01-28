'use strict'

const BaseController = require('../BaseController');

class ArtifactMedalLikeController extends BaseController{

  async create() {
    const ctx = this.ctx;
    let tag = 0;
    if(ctx.user.roles[0].name == 'vip' || ctx.user.roles[0].name == 'admin'){
      tag = 1;
    }
    else if (ctx.user.roles[0].name == 'user'){
      tag = 2;
    }
    let data = {
      tag:tag,
      userId:ctx.user.Id,
      artifactId:ctx.request.body.artifactId,
      artifactUserId:ctx.request.body.artifactUserId,
    };

    const result = await ctx.service.artifactMedalLike.create(data);

    if(result){
      super.success('操作成功!');
    }
    else{
      super.failure('操作失败!');
    }
  }

  async getMedalLikeDataByUserIdAndArtifactsId(){
      const ctx = this.ctx;
      let tag = 0;
      if(ctx.user.roles[0].name == 'vip' || ctx.user.roles[0].name == 'admin'){
        tag = 1;
      }
      else if (ctx.user.roles[0].name == 'user'){
        tag = 2;
      }
      
      let artifactMedalLike = {
          tag:tag,
          userId:ctx.user.Id,
          artifactId:ctx.query.artifactId
      }

      const result = await ctx.service.artifactMedalLike.getMedalLikeDataByUserIdAndArtifactsId(artifactMedalLike);
      if(result){
        super.success('已经点赞!');
      }
      else{
        super.failure('未点赞!');
      }
  }
}

module.exports = ArtifactMedalLikeController;
