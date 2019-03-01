const Subscription = require('egg').Subscription;

class UpdateElasticsearch extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '2m', // 1m 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {

    const ctx = this.ctx;

    let insertPinwallTime;

    const insertPinwall = await ctx.service.esSyncData.getDateBySyncType(1);
    if (insertPinwall.length == 0){
       insertPinwallTime = new Date();
       await ctx.service.esSyncData.createEsSyncData(1,insertPinwallTime);
    }
    else{
       insertPinwallTime = insertPinwall[0].lastSyncTime;
    }

    let insertPinwallObject = false;
    let insertSuggestObject = false;

    try{
      let esArray = await ctx.model.Artifacts.findArtifactByTime(insertPinwallTime,0);
      insertPinwallTime = new Date();
      for (let artiObj of esArray){
        await ctx.service.esUtils.createObject(artiObj.Id, artiObj);

        let object = {};
        object.Id = artiObj.Id;
        object.suggest = new Array();

        let name_suggest = {};
        name_suggest.input = artiObj.name;
        name_suggest.weight = 10;
        object.suggest.push(name_suggest);

        let fullname_suggest = {};
        fullname_suggest.input = artiObj.user.fullname;
        fullname_suggest.weight = 16;
        object.suggest.push(fullname_suggest);

        artiObj.terms.forEach((term,index)=>{
          let term_suggest = {};
          term_suggest.input = term.name;
          term_suggest.weight = 8;
          object.suggest.push(term_suggest);
        });
        await ctx.service.esUtils.createSuggestObject(artiObj.Id, object);
        ctx.getLogger('elasticLogger').info(artiObj.Id+"\n");
      }
      insertPinwallObject = true;
    }
    catch(e){
      insertPinwallObject = false;
      this.ctx.getLogger('elasticLogger').info(e.message+"\n");
    }

    if(insertPinwallObject){
      await ctx.service.esSyncData.update(1, insertPinwallTime);
    }

    let insertSuggestTime;

    const insertSuggest = await ctx.service.esSyncData.getDateBySyncType(2);
    if (insertSuggest.length == 0){
       insertSuggestTime = new Date();
       await ctx.service.esSyncData.createEsSyncData(2,insertSuggestTime);
    }
    else{
       insertSuggestTime = insertSuggest[0].lastSyncTime;
    }

    //更新数据到es
    try{
      let esArray = await ctx.model.Artifacts.findArtifactByTime(insertSuggestTime,1);
      insertSuggestTime = new Date();
      for (let artiObj of esArray){
        await ctx.service.esUtils.updateobject(artiObj.Id, artiObj);
        let object = {};
        object.Id = artiObj.Id;
        object.suggest = new Array();

        let name_suggest = {};
        name_suggest.input = artiObj.name;
        name_suggest.weight = 10;
        object.suggest.push(name_suggest);

        let fullname_suggest = {};
        fullname_suggest.input = artiObj.user.fullname;
        fullname_suggest.weight = 16;
        object.suggest.push(fullname_suggest);

        artiObj.terms.forEach((term,index)=>{
          let term_suggest = {};
          term_suggest.input = term.name;
          term_suggest.weight = 8;
          object.suggest.push(term_suggest);
        });
        await ctx.service.esUtils.updateSuggestObject(artiObj.Id, artiObj);
        ctx.getLogger('elasticLogger').info(artiObj.Id+"\n");
      }
      insertSuggestObject = true;
    }
    catch(e){
      insertSuggestObject = false;
      this.ctx.getLogger('elasticLogger').info(e.message+"\n");
    }

    if(insertSuggestObject){
      await ctx.service.esSyncData.update(2, insertSuggestTime);
    }
  }
}

module.exports = UpdateElasticsearch;
