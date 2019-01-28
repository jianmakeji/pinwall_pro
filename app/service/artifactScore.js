'use strict';

const Service = require('egg').Service;

class ArtifactScore extends Service {

  async list({
    offset = 0,
    limit = 10
  }) {
    return this.ctx.model.ArtifactScores.listArtifactScores({
      offset,
      limit,
    });
  }

  async findByArtifactIdWithPage({
    offset = 0,
    limit = 10,
    artifactId = 0
  }) {
    return this.ctx.model.ArtifactScores.findByArtifactIdWithPage({
      offset,
      limit,
      artifactId
    });
  }

  async findByArtifactIdAndScorerId({
    offset = 0,
    limit = 10,
    scorerId = 0
  }) {
    return this.ctx.model.ArtifactScores.findByScorerIdWithPage({
      offset,
      limit,
      scorerId
    });
  }

  async create(artifactScores) {
    const ctx = this.ctx;
    artifactScores.scorerId = ctx.user.Id;
    const artifactScoreObj = await this.ctx.model.ArtifactScores.findOneByArtifactIdAndScorerId({
      artifactId:artifactScores.artifactId,
      scorerId:artifactScores.scorerId
    });

    if (!artifactScoreObj){
      return await this.ctx.model.ArtifactScores.createArtifactScores(artifactScores);
    }
    else{
      return await this.ctx.model.ArtifactScores.updateScore(artifactScores.artifactId, artifactScores.scorerId, artifactScores.score);
    }
  }

  async update({
    artifactId = 0,
    scorerId = 0,
    score = 0
  }) {
    const artifactScores = await this.ctx.model.ArtifactScores.updateScore(artifactId, scorerId, score);
    return artifactScores;
  }

  async del(artifactId) {
    const artifact = await this.ctx.model.ArtifactScores.delArtifactScoresByArtifactId(artifactId);
    return artifact;
  }
}

module.exports = ArtifactScore;
