'use strict'

const BaseController = require('../BaseController');

class SearchController extends BaseController{

  async searchByKeywords() {
    const ctx = this.ctx;

    const limit = ctx.helper.parseInt(ctx.query.limit);
    const offset = ctx.helper.parseInt(ctx.query.offset);
    const keyword = ctx.query.keyword;

    try{
      let hits = await ctx.app.elasticsearch.search({
        index: ctx.app.es_index,
        body: {
          from : offset,
          size : limit,
          query: {
            query_string: {
              query: keyword
            }
          }
        }
      }).then(function (resp) {
          var hits = resp.hits;
          hits.hits.forEach((element,index)=>{
            if(element._source.profileImage.indexOf('pinwall.fzcloud') == -1){
              element._source.profileImage = ctx.app.signatureUrl(ctx.app.imagePath + element._source.profileImage, "thumb_360_360");
            }
          });
          return hits;
      }, function (err) {
          console.trace(err.message);
      });

      super.success(hits);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async suggestKeyWords() {
    const ctx = this.ctx;
    const keyword = ctx.query.keyword;

    try{
      let hits = await ctx.app.elasticsearch.search({
        index: ctx.app.es_search_suggest_index,
        body: {
          size : 10,
          suggest: {
            key_suggest: {
              prefix:keyword,
              completion:{
                field:'suggest',
                skip_duplicates:true
              }
            }
          }
        }
      }).then(function (resp) {
        console.log(resp.suggest.key_suggest);
          var hits = resp.suggest.key_suggest[0].options;

          return hits;
      }, function (err) {
          console.log(err.message);
      });

      super.success(hits);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async suggestKeyWordsWithJobtag() {
    const ctx = this.ctx;
    const keyword = ctx.query.keyword;
    const jobTag = ctx.query.jobTag;
    const limit = ctx.query.limit;
    const offset = ctx.query.offset;

    try{
      let condition = {
        'from':offset,
        'size' : limit,
        'query': {
          'bool': {
            'must':[
              {'match':{'topics.jobTag':jobTag}},
              {'multi_match':{
                'query':keyword,
                'fields': ['name','topics.name','terms.name','description','user.fullname']
              }}
            ]
          }
        }
      };

      let hits = await ctx.app.elasticsearch.search({
        index: ctx.app.es_index,
        body: condition
      }).then(function (resp) {
        var hits = resp.hits;

        return hits;
      }, function (err) {
          console.log(err.message);
      });

      super.success(hits);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async searchArtifactsByNameOrTermName() {
    const ctx = this.ctx;
    const keyword = ctx.query.keyword;
    const limit = ctx.query.limit;
    const offset = ctx.query.offset;

    try{
      let condition = {
        'from':offset,
        'size' : limit,
        'query': {
          'multi_match':{
            'query':keyword,
            'fields': ['name','terms.name']
          }
        }
      };

      let hits = await ctx.app.elasticsearch.search({
        index: ctx.app.es_index,
        body: condition
      }).then(function (resp) {
        var hits = resp.hits;

        return hits;
      }, function (err) {
          console.log(err.message);
      });

      super.success(hits);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async searchByKeywordsAndJobtag() {
    const ctx = this.ctx;
    const query = {
      limit: ctx.helper.parseInt(ctx.query.limit),
      offset: ctx.helper.parseInt(ctx.query.offset),
      jobTag: ctx.helper.parseInt(ctx.query.jobTag),
      subLimit: ctx.helper.parseInt(ctx.query.subLimit),
      status: ctx.helper.parseInt(ctx.query.status),
      userId: ctx.helper.parseInt(ctx.query.userId),
      keyword: ctx.query.keyword,
    };
    if (query.userId == 0 && ctx.user){
        query.userId = ctx.user.Id;
    }

    try{
      const result = await ctx.service.topics.searchTopics(query);
      super.success(result);
    }
    catch(e){
      super.failure(e.message);
    }
  }

  async transferData(){
    const ctx = this.ctx;
    let transferData = await ctx.service.artifacts.transferArtifacts();
    console.log(transferData.length);
    await ctx.service.esUtils.batchCreateObject(transferData);

    let result = new Array();
    transferData.forEach((element,index)=>{

      let object = {};
      object.Id = element.Id;
      object.suggest = new Array();

      let name_suggest = {};
      name_suggest.input = element.name;
      name_suggest.weight = 10;
      object.suggest.push(name_suggest);

      let fullname_suggest = {};
      fullname_suggest.input = element.user.fullname;
      fullname_suggest.weight = 16;
      object.suggest.push(fullname_suggest);

      element.terms.forEach((term,index)=>{
        let term_suggest = {};
        term_suggest.input = term.name;
        term_suggest.weight = 8;
        object.suggest.push(term_suggest);
      });

      result.push(object);
    });
    console.log('end...');

    await ctx.service.esUtils.batchCreateSuggestObject(result);
    //ctx.body = transferData;
  }
}

module.exports = SearchController;
