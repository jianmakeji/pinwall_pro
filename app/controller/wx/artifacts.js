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

}

module.exports = ArtifactsController;
