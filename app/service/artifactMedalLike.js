'use strict';

const Service = require('egg').Service;

class ArtifactMedalLike extends Service {

  async create(artifactMedalLike) {
    const mlObj = await this.ctx.model.ArtifactMedalLike.findByArtifactIdAndUserId(artifactMedalLike);

    if (mlObj){
        let transaction;
        try {
          transaction = await this.ctx.model.transaction();
          await this.ctx.model.ArtifactMedalLike.delMedalAndLikeByArtifactIdAndUserId(artifactMedalLike, transaction);
          if (artifactMedalLike.tag == 1){
            await this.ctx.model.Artifacts.reduceMedal(artifactMedalLike.artifactId, transaction);
            await this.ctx.model.Users.reduceMedal(artifactMedalLike.artifactUserId, 1, transaction);
          }
          else if (artifactMedalLike.tag == 2){
            await this.ctx.model.Artifacts.reducelike(artifactMedalLike.artifactId, transaction);
            await this.ctx.model.Users.reducelike(artifactMedalLike.artifactUserId, 1, transaction);
          }

          await transaction.commit();
          return true
        } catch (e) {
          await transaction.rollback();
          return false
        }

    }
    else{
      let transaction;
      try {
        transaction = await this.ctx.model.transaction();
        await this.ctx.model.ArtifactMedalLike.createMedalAndLike(artifactMedalLike, transaction);
        if (artifactMedalLike.tag == 1){
          await this.ctx.model.Artifacts.addMedal(artifactMedalLike.artifactId, transaction);
          await this.ctx.model.Users.addMedal(artifactMedalLike.artifactUserId, transaction);
        }
        else if (artifactMedalLike.tag == 2){
          await this.ctx.model.Artifacts.addlike(artifactMedalLike.artifactId, transaction);
          await this.ctx.model.Users.addlike(artifactMedalLike.artifactUserId, transaction);
        }

        await transaction.commit();
        return true
      } catch (e) {
        await transaction.rollback();
        return false
      }
    }

  }

  async getMedalLikeDataByUserIdAndArtifactsId(artifactMedalLike){
      const mlObj = await this.ctx.model.ArtifactMedalLike.findByArtifactIdAndUserId(artifactMedalLike);

      if(mlObj){
          return true;
      }
      else{
          return false;
      }
  }
}

module.exports = ArtifactMedalLike;
