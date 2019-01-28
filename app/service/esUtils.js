'use strict';

const Service = require('egg').Service;

class esUtils extends Service {

  async createObject(id, searchObject){
    const ctx = this.ctx;
    await ctx.app.elasticsearch.create({
      index: ctx.app.es_index,
      type: ctx.app.es_type,
      id: id,
      body: searchObject
    });
  }

  async deleteObjectById(id){
    const ctx = this.ctx;
    await ctx.app.elasticsearch.delete({
      index: ctx.app.es_index,
      type: ctx.app.es_type,
      id: id
    });
  }

  async updateobject(id, updateObject){
    const ctx = this.ctx; 
    const response = await ctx.app.elasticsearch.update({
      index: ctx.app.es_index,
      type: ctx.app.es_type,
      id: id,
      body: {
        doc: updateObject
      }
    })
  }

  async batchCreateObject(batchObject){
    const ctx = this.ctx;
    let i = 0;
    for (let object of batchObject){
      console.log(i++);
      await ctx.app.elasticsearch.create({
        index: ctx.app.es_index,
        type: ctx.app.es_type,
        id: object.Id,
        body: object
      });
    }
  }

  async batchCreateSuggestObject(batchObject){
    const ctx = this.ctx;
    let i = 0;
    for (let object of batchObject){
      console.log(i++);
      await ctx.app.elasticsearch.create({
        index: ctx.app.es_search_suggest_index,
        type: ctx.app.es_search_suggest_type,
        id: object.Id,
        body: object
      });
    }
  }

  async createSuggestObject(id, suggestObject){
    const ctx = this.ctx;
    await ctx.app.elasticsearch.create({
      index: ctx.app.es_search_suggest_index,
      type: ctx.app.es_search_suggest_type,
      id: id,
      body: suggestObject
    });
  }

  async deleteSuggestObjectById(id){
    const ctx = this.ctx;
    await ctx.app.elasticsearch.delete({
      index: ctx.app.es_search_suggest_index,
      type: ctx.app.es_search_suggest_type,
      id: id
    });
  }

  async updateSuggestObject(id, updateObject){
    const ctx = this.ctx;
    const response = await ctx.app.elasticsearch.update({
      index: ctx.app.es_search_suggest_index,
      type: ctx.app.es_search_suggest_type,
      id: id,
      body: {
        doc: updateObject
      }
    })
  }
}

module.exports = esUtils;
