'use strict';

const Service = require('egg').Service;

class Artifacts extends Service {

  async list({ offset = 0, limit = 10, visible = 0, jobTag = 0}) {

    let resultObj = await this.ctx.model.Artifacts.listArtifacts({
      offset,
      limit,
      visible,
      jobTag,
    });

    const helper = this.ctx.helper;
    resultObj.rows.forEach((element, index)=>{
      element.profileImage = helper.signatureUrl(helper.imagePath + element.profileImage, "thumb_360_360");

      for (let subElement of element.artifact_assets){
        subElement.profileImage = helper.signatureUrl(helper.imagePath + subElement.profileImage, "thumb_1000");

        if (subElement.type == 2 && subElement.mediaFile != null){
            subElement.mediaFile = helper.signatureUrl(helper.pdfPath + subElement.mediaFile);
        }
        else if (subElement.type == 3 && subElement.mediaFile != null){
            subElement.mediaFile = helper.signatureUrl(helper.rar_zipPath + subElement.mediaFile);
        }
        else if (subElement.type == 4 && subElement.mediaFile != null){
            subElement.mediaFile = helper.signatureUrl(helper.videoPath + subElement.mediaFile);
        }
      }
    });

    return resultObj;
  }

  async find(id) {

    const artifact = await this.ctx.model.Artifacts.findArtifactById(id);
    const helper = this.ctx.helper;

    artifact.profileImage = helper.signatureUrl(helper.imagePath + artifact.profileImage, "thumb_360_360");

    for (let subElement of artifact.dataValues.artifact_assets){
      subElement.profileImage = helper.signatureUrl(helper.imagePath + subElement.profileImage, "thumb_1000");

      if (subElement.type == 2 && subElement.mediaFile != null){
        subElement.mediaFile = helper.signatureUrl(helper.pdfPath + subElement.mediaFile);
      }
      else if (subElement.type == 3 && subElement.mediaFile != null){
        subElement.mediaFile = helper.signatureUrl(helper.rar_zipPath + subElement.mediaFile);
      }
      else if (subElement.type == 4 && subElement.mediaFile != null){
        subElement.mediaFile = helper.signatureUrl(helper.videoPath + subElement.mediaFile);
      }
    }

    return artifact;
  }

  async create(artifact) {
    if (artifact.topicId == 0 && artifact.jobTag == 2){ //作品集上传
      let transaction;
      try {
        transaction = await this.ctx.model.transaction();
        artifact.visible = 0;
        const artiObj = await this.ctx.model.Artifacts.createArtifact(artifact,transaction);

        let terms = artifact.terms;
        for (let term of terms){
          const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
          await this.ctx.model.ArtifactTerm.createArtifactTerm({
            artifactId:artiObj.Id,
            termId:termObj.Id
          },transaction);
        }
        await this.ctx.model.Users.addArtifact(artifact.userId,transaction);
        await transaction.commit();

        return true
      } catch (e) {
        await transaction.rollback();
        return false
      }
    }
    else {
      //作业夹上传
      const topic = await this.ctx.model.Topics.findTopicById(artifact.topicId);
      if(topic){
        if(topic.status == 0)
        {
          let transaction;
          try {
            transaction = await this.ctx.model.transaction();
            artifact.visible = 0;
            const artiObj = await this.ctx.model.Artifacts.createArtifact(artifact,transaction);
            if (artifact.topicId != 0){
                await this.ctx.model.TopicArtifact.createTopicArtifact(
                    {
                      artifactId:artiObj.Id,
                      topicId:artifact.topicId
                    },transaction);
            }

            let terms = artifact.terms;
            for (let term of terms){
              const termObj = await this.ctx.model.Terms.createTerm(term,transaction);
              await this.ctx.model.ArtifactTerm.createArtifactTerm({
                artifactId:artiObj.Id,
                termId:termObj.Id
              },transaction);
            }
            await this.ctx.model.Users.addArtifact(artifact.userId,transaction);
            await transaction.commit();

            return true
          } catch (e) {
            await transaction.rollback();
            return false
          }
        }
        else if(topic.status == 1){
          return false;
        }

      }
      else{
        return false;
      }
    }

  }

  async update({ id, updates }) {
    const ctx = this.ctx;
    let transaction;
    try {
      transaction = await ctx.model.transaction();
      updates.updateAt = new Date();

      const artifact = await ctx.model.Artifacts.findArtifactById(id);

      let updateObject = await ctx.model.Artifacts.updateArtifact({ id, updates },transaction);

      if (updates.artifact_assets && updates.artifact_assets.length > 0){
        await ctx.model.ArtifactAssets.delAssetsByArtifactId(id,transaction);
        for (let artifact_asset of updates.artifact_assets){
            const asset = {};
            asset.position = artifact_asset.position,
            asset.name = artifact_asset.name,
            asset.filename = artifact_asset.filename,
            asset.description = artifact_asset.description,
            asset.type = artifact_asset.type,
            asset.profileImage = artifact_asset.profileImage,
            asset.imagename = artifact_asset.imagename,
            asset.mediaFile = artifact_asset.mediaFile,
            asset.viewUrl = artifact_asset.viewUrl,
            asset.artifactId = id;
            await ctx.model.ArtifactAssets.createAssets(asset,transaction);
        }
      }

      if (updates.addTerms && updates.addTerms.length > 0){
        for (let term of updates.addTerms){
          const termObj = await ctx.model.Terms.createTerm(term,transaction);
          await ctx.model.ArtifactTerm.createArtifactTerm({
            artifactId:artifact.Id,
            termId:termObj.Id
          },transaction);
        }
      }

      if (updates.deleteTerms && updates.deleteTerms.length > 0){
        await ctx.model.ArtifactTerm.delArtifactTermByArtifactIdAndtermId(id,updates.deleteTerms,transaction);
      }
      await transaction.commit();

      try{
        let artiObj = await this.ctx.model.Artifacts.transterDataToESById(id);
        if (artiObj){
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
        }
      }
      catch(e){
        ctx.getLogger('elasticLogger').info("update ID:"+id+": "+e.message+"\n");
      }

      let deleteAliOSSArray = new Array();
      try{

        if(artifact.profileImage != updates.profileImage){
          deleteAliOSSArray.push(ctx.app.imagePath + artifact.profileImage);
        }

        for (const artifactAssets of artifact.dataValues.artifact_assets){
          if(ctx.helper.judgeImageStringInArrayObject(artifactAssets.profileImage,updates.artifact_assets)){
            deleteAliOSSArray.push(ctx.helper.imagePath + artifactAssets.profileImage);
          }

          if(artifactAssets.type == 2){
            if(ctx.helper.judgeMediaStringInArrayObject(artifactAssets.mediaFile,updates.artifact_assets)){
              deleteAliOSSArray.push(ctx.helper.pdfPath + artifactAssets.mediaFile);
            }
          }
          else if(artifactAssets.type == 3){
            if(ctx.helper.judgeMediaStringInArrayObject(artifactAssets.mediaFile,updates.artifact_assets)){
              deleteAliOSSArray.push(ctx.helper.rar_zipPath + artifactAssets.mediaFile);
            }
          }
          else if(artifactAssets.type == 4){
            if(ctx.helper.judgeMediaStringInArrayObject(artifactAssets.mediaFile,updates.artifact_assets)){
              deleteAliOSSArray.push(ctx.helper.videoPath + artifactAssets.mediaFile);
            }
          }
        }

        if (deleteAliOSSArray.length > 0){
          ctx.helper.deleteOssMultiObject(deleteAliOSSArray);
        }
      }
      catch(e){
          ctx.getLogger('aliossLogger').info("delete file:"+deleteAliOSSArray.join(',')+": "+e.message+"\n");
      }

      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
  }

  async del(id) {
    const ctx = this.ctx;
    let transaction;
    try {
      transaction = await ctx.model.transaction();
      const artifact = await ctx.model.Artifacts.findArtifactById(id);
      await ctx.model.Artifacts.delArtifactById(id, transaction);
      await ctx.model.ArtifactAssets.delAssetsByArtifactId(id, transaction);
      await ctx.model.ArtifactComments.delCommentByArtifactId(id, transaction);
      await ctx.model.ArtifactTerm.delArtifactTermByArtifactId(id, transaction);
      await ctx.model.Users.reduceAllAggData(artifact.userId, artifact.medalCount, artifact.likeCount, artifact.commentCount, transaction);

      try{
        await ctx.service.esUtils.deleteObjectById(id);
        await ctx.service.esUtils.deleteSuggestObjectById(id);
      }
      catch(e){
        ctx.getLogger('elasticLogger').info("delete ID:"+id+": "+e.message+"\n");
      }

      let deleteAliOSSArray = new Array();
      try{
        deleteAliOSSArray.push(ctx.helper.imagePath + artifact.profileImage);

        for (const artifactAssets of artifact.dataValues.artifactAssets){
          deleteAliOSSArray.push(ctx.helper.imagePath + artifactAssets.profileImage);

          if(artifactAssets.type == 2){
            deleteAliOSSArray.push(ctx.helper.pdfPath + artifactAssets.mediaFile);
          }
          else if(artifactAssets.type == 3){
            deleteAliOSSArray.push(ctx.helper.rar_zipPath + artifactAssets.mediaFile);
          }
          else if(artifactAssets.type == 4){
            deleteAliOSSArray.push(ctx.helper.videoPath + artifactAssets.mediaFile);
          }
        }
        if (deleteAliOSSArray.length > 0){
          ctx.helper.deleteOssMultiObject(deleteAliOSSArray);
        }

      }
      catch(e){
          ctx.getLogger('aliossLogger').info("delete ID:"+deleteAliOSSArray.join(',')+": "+e.message+"\n");
      }
      await transaction.commit();
      return true
    } catch (e) {
      await transaction.rollback();
      return false
    }
  }

  async getMedalDataByRandom(limit){
    const helper = this.ctx.helper;
    const listData = await this.ctx.model.Artifacts.getMedalDataByRandom();
    const max = listData.length;
    if(max < limit){
        listData.forEach((element, index)=>{
            let profileImage = element.profileImage;
            element.profileImage = helper.signatureUrl(helper.imagePath + profileImage, "thumb_360_360");
        });

        return listData;
    }
    else{
      const setData = new Set();
      while(setData.size != limit){
        let rand = Math.random();
        let num = Math.floor(rand * max);
        setData.add(num);
      }
      let result = new Array();
      for (let item of setData.values()) {
        let profileImage = listData[item].dataValues.profileImage;
        listData[item].dataValues.profileImage = helper.signatureUrl(helper.imagePath + profileImage, "thumb_360_360");
        result.push(listData[item]);
      }

      return result;
    }
  }

  async getPersonalJobByUserId(query) {
    let resultObj = await this.ctx.model.Artifacts.getPersonalJobByUserId(query);
    const helper = this.ctx.helper;
    resultObj.rows.forEach((element, index)=>{
      element.profileImage = helper.signatureUrl(helper.imagePath + element.profileImage, "thumb_360_360");

      for (let subElement of element.artifact_assets){
        subElement.profileImage = helper.signatureUrl(helper.imagePath + subElement.profileImage, "thumb_1000");

        if (subElement.type == 2 && subElement.mediaFile != null){
          subElement.mediaFile = helper.signatureUrl(helper.pdfPath + subElement.mediaFile);
        }
        else if (subElement.type == 3 && subElement.mediaFile != null){
          subElement.mediaFile = helper.signatureUrl(helper.rar_zipPath + subElement.mediaFile);
        }
        else if (subElement.type == 4 && subElement.mediaFile != null){
          subElement.mediaFile = helper.signatureUrl(helper.videoPath + subElement.mediaFile);
        }
      }

    });
    return resultObj;
  }

  async transferArtifacts() {
    let data = await this.ctx.model.Artifacts.transferArtifacts();

    return data;
  }

  async transterInsertDataToES(idArray) {
    const ctx = this.ctx;
    try{
      let esArray = await this.ctx.model.Artifacts.transferArtifacts(idArray);
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
      }
      return true;
    }
    catch(e){
      return false;
    }
  }

  async transterUpdateDataToES(idArray) {
    const ctx = this.ctx;
    try{
      let esArray = await this.ctx.model.Artifacts.transferArtifacts(idArray);
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
      }
      return true;
    }
    catch(e){
      return false;
    }
  }
}

module.exports = Artifacts;
