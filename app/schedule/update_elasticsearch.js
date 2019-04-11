const Subscription = require('egg').Subscription;

class UpdateElasticsearch extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '200m', // 1m 分钟间隔
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

    let insertObject = false;
    let updateObject = false;

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
      insertObject = true;
    }
    catch(e){
      insertObject = false;
      this.ctx.getLogger('elasticLogger').info(e.message+"\n");
    }

    if(insertObject){
      await ctx.service.esSyncData.update(1, insertPinwallTime);
    }

    let updatePinwallTime;

    const updatePinwall = await ctx.service.esSyncData.getDateBySyncType(2);
    if (updatePinwall.length == 0){
       updatePinwallTime = new Date();
       await ctx.service.esSyncData.createEsSyncData(2,updatePinwallTime);
    }
    else{
       updatePinwallTime = updatePinwall[0].lastSyncTime;
    }

    //更新数据到es
    try{
      let esArray = await ctx.model.Artifacts.findArtifactByTime(updatePinwallTime,1);
      updatePinwallTime = new Date();
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
      updateObject = true;
    }
    catch(e){
      updateObject = false;
      this.ctx.getLogger('elasticLogger').info(e.message+"\n");
    }

    if(updateObject){
      await ctx.service.esSyncData.update(2, insertSuggestTime);
    }
  }
}

module.exports = UpdateElasticsearch;
