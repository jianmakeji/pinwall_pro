const Subscription = require('egg').Subscription;

class UpdateElasticsearch extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1m', // 1m 分钟间隔
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

    let esArray1 = await ctx.model.Artifacts.findArtifactByTime(insertPinwallTime,0);
    insertPinwallTime = new Date();
    for (let artiObj of esArray1){
        try{
            await ctx.service.esUtils.createObject(artiObj.Id, artiObj);
        }
        catch(e){
          this.ctx.getLogger('elasticLogger').info("insert artifact:"+artiObj.Id+"\n"+e.message+"\n");
        }

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

        try{
          await ctx.service.esUtils.createSuggestObject(artiObj.Id, object);
        }
        catch(e){
          this.ctx.getLogger('elasticLogger').info("insert suggest"+artiObj.Id+"\n"+e.message+"\n");
        }
    }

    await ctx.service.esSyncData.update(1, insertPinwallTime);

    let updateDataTime;

    const lastSyncTime = await ctx.service.esSyncData.getDateBySyncType(2);
    if (lastSyncTime.length == 0){
       updateDataTime = new Date();
       await ctx.service.esSyncData.createEsSyncData(2,updateDataTime);
    }
    else{
       updateDataTime = lastSyncTime[0].lastSyncTime;
    }

    //更新数据到es
    let esArray2 = await ctx.model.Artifacts.findArtifactByTime(updateDataTime,1);
    updateDataTime = new Date();
    for (let artiObj of esArray2){

        try{
            await ctx.service.esUtils.updateobject(artiObj.Id, artiObj);
        }
        catch(e){
            this.ctx.getLogger('elasticLogger').info("update artifact:"+artiObj.Id+"\n"+e.message+"\n");
        }

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

        try{
          await ctx.service.esUtils.updateSuggestObject(artiObj.Id, artiObj);
        }
        catch(e){
          this.ctx.getLogger('elasticLogger').info("update suggest"+artiObj.Id+"\n"+e.message+"\n");
        }
    }
    await ctx.service.esSyncData.update(2, updateDataTime);

  }
}

module.exports = UpdateElasticsearch;
