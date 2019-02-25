const BaseController = require('../BaseController');

class ArtifactsController extends BaseController{

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

    async createComment() {
      const ctx = this.ctx;
      const result = await ctx.service.artifactComment.create(ctx.request.body);
      if(result){
        super.success('操作成功!');
      }
      else{
        super.failure(e.message);
      }
    }

    async createScore() {
      const ctx = this.ctx;
      try{
        const wxUser = await ctx.service.users.find(ctx.request.body.userId);
        if (wxUser.roles[0].name == 'vip'){
          const article = await ctx.service.artifactScore.wxCreateScore(ctx.request.body,wxUser.Id);
          super.success('打分成功!');
        }
        else{
          super.failure('没有操作权限!');
        }
      }
      catch(e){
        super.failure(e.message);
      }
    }

    async getArtifactById() {
      const ctx = this.ctx;

      try{
        const result = await ctx.service.artifacts.find(ctx.helper.parseInt(ctx.params.id));
        super.success(result);
      }
      catch(e){
        super.failure(e.message);
      }
    }

    async findCommentsByArtifactIdWithPage() {
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

    async getMedalLikeDataByUserIdAndArtifactsId(){
        const ctx = this.ctx;
        let tag = 0;
        if(ctx.query.roleName == 'vip' || ctx.query.roleName == 'admin'){
          tag = 1;
        }
        else if (ctx.query.roleName == 'user'){
          tag = 2;
        }

        let artifactMedalLike = {
            tag:tag,
            userId:ctx.query.userId,
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

    async createLike() {
      const ctx = this.ctx;
      const body = ctx.request.body;
      let tag = 0;
      if(body.roleName == 'vip' || body.roleName == 'admin'){
        tag = 1;
      }
      else if (body.roleName == 'user'){
        tag = 2;
      }
      let data = {
        tag:tag,
        userId:body.userId,
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
}

module.exports = ArtifactsController;
