'use strict';

const Service = require('egg').Service;

class Terms extends Service {

  async list({ offset = 0, limit = 10 }) {
    return this.ctx.model.Terms.listTerms({
      offset,
      limit
    });
  }

  async find(Id) {
    const term = await this.ctx.model.Terms.findTermById(Id);
    return term;
  }

  async create(term) {
    if (term.name == '' || term.name == null){
      throw new Error('名称不能为空');
    }
    else{
      const termObj = await this.ctx.model.Terms.createTerm(term);
      return termObj;
    }
  }

  async update({ Id, updates }) {
    const term = await this.ctx.model.Terms.updateTerm({ Id, updates });
    return term;
  }

  async delTermById(id) {
    const term = await this.ctx.model.Terms.del(id);
    return term;
  }
}

module.exports = Terms;
