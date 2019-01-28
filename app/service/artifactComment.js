'use strict';

const Service = require('egg').Service;

class ArtifactComment extends Service {

  async list({ offset = 0, limit = 10}) {
    return this.ctx.model.ArtifactComments.listComments({
      offset,
      limit,
    });
  }

  async findByArtifactIdWithPage({ offset = 0, limit = 10, artifactId = 0}) {
    return this.ctx.model.ArtifactComments.findByArtifactIdWithPage({
      offset,
      limit,
      artifactId,
    });
  }

  async findCommentById(id) {
    return this.ctx.model.ArtifactComments.findCommentById(id);
  }

  async create(artifactComments) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      artifactComments.visible = 0;
      await this.ctx.model.ArtifactComments.createComment(artifactComments, transaction);
      await this.ctx.model.Artifacts.addComment(artifactComments.artifactId, transaction);
      await this.ctx.model.Users.addComment(artifactComments.commenterId, transaction);
      await transaction.commit();
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }

  }

  async update({Id = 0, visible = 0}) {
    const artifact = await this.ctx.model.ArtifactComments.setVisible(Id);
    return artifact;
  }

  async del(Id) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      const comment = await this.ctx.model.ArtifactComments.findCommentById(Id);
      await this.ctx.model.ArtifactComments.delCommentById(Id, transaction);
      await this.ctx.model.Artifacts.reduceComment(comment.artifactId, transaction);
      await this.ctx.model.Users.reduceComment(comment.commenterId, 1, transaction);
      await transaction.commit();
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
    
    return artifact;
  }

  async searchByKeyword({ offset = 0, limit = 10, keyword = '', field = 1}){
    let condition = {
      offset:offset,
      limit:limit,
      keyword:keyword
    };
    let result;
    if (field == 1){
      result = await this.ctx.model.ArtifactComments.searchCommentByContent(condition)
    }
    else if (field == 2){
      result = await this.ctx.model.ArtifactComments.searchCommentByUsername(condition);
    }
    else if (field == 3){
      result = await this.ctx.model.ArtifactComments.searchCommentByArtifactsName(condition);
    }
    return result;
  }
}

module.exports = ArtifactComment;
