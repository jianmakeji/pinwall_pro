'use strict';

let OSS = require('ali-oss');
const crypto = require('crypto');

module.exports = {

  aliConfig: () => {
    const alioss = exports = {};

    alioss.region = 'oss-cn-hangzhou';
    alioss.AccessKeyId = 'LTAIsvXXw2cmRUG2';
    alioss.AccessKeySecret = 'fs0sVuCJm0AeQi2XduYwdF0EqzL5Rc';
    alioss.endpoint = 'oss-cn-hangzhou.aliyuncs.com';
    alioss.PolicyFile = 'policy/all_policy.txt';
    alioss.RoleArn = 'acs:ram::1455326322404332:role/cidic-oss-role';
    alioss.TokenExpireTime = '3600';
    alioss.bucket = 'pinwall';

    return alioss;
  },

  jwtSlot: 'LTAIkUgFNkgDjcr8zklMJfJUoAgdcT',
  wx_secret: '4ba159f4548a64e8eb5567e860c4f067',
  wx_appid: 'wxe7bac3b26bdd1205',

  imagePath: 'images/',
  othersPath: 'others/',
  pdfPath: 'pdf/',
  rar_zipPath: 'rar_zip/',
  videoPath: 'video/',

  email_host:'smtp.exmail.qq.com',
  email_user:'d_seniors2-18@cidic.cn',
  email_pwd:'Yl2018',
  email_send_address:'admin@design-engine.org',
  email_verify_address:'https://beta.pinwall.design-engine.org/website/users/updateAcviveByActiveCodeAndEmail',
  wx_email_verify_address:'https://beta.pinwall.design-engine.org/website/users/updateWxActive',
  getBackPwd_email_verify_address:'https://beta.pinwall.design-engine.org/updatePwd',

  es_index:'pinwall',
  es_type:'artifacts',

  es_search_suggest_index:'pinwall_search_suggest',
  es_search_suggest_type:'pinwall_suggest',

  signatureUrl(objectPath,thumbName){
    const config = this.aliConfig();
    let client = new OSS({
      region: config.region,
      accessKeyId: config.AccessKeyId,
      accessKeySecret: config.AccessKeySecret,
      bucket: config.bucket,
    });

    if (typeof(thumbName) == "undefined"){
      return client.signatureUrl(objectPath, {expires: 3600});
    }
    else{
      return client.signatureUrl(objectPath, {expires: 3600,process : 'style/'+thumbName});
    }

  },

  async deleteOssObject(objectPath){
    const config = this.aliConfig();
    let client = new OSS({
      region: config.region,
      accessKeyId: config.AccessKeyId,
      accessKeySecret: config.AccessKeySecret,
      bucket: config.bucket,
    });

    return client.delete(objectPath);
  },

  async deleteOssMultiObject(objectArrayPath){
    const config = this.aliConfig();
    let client = new OSS({
      region: config.region,
      accessKeyId: config.AccessKeyId,
      accessKeySecret: config.AccessKeySecret,
      bucket: config.bucket,
    });

    return client.deleteMulti(objectArrayPath);
  },

  async putOssObject(objectName,stream){
    const config = this.aliConfig();
    let client = new OSS({
      region: config.region,
      accessKeyId: config.AccessKeyId,
      accessKeySecret: config.AccessKeySecret,
      bucket: config.bucket,
    });

    try {
      let result = await client.putStream(objectName, stream);
      console.log(result);
    } catch (e) {
      console.log(e)
    }
  },

  cryptoPwd:(password)=>{
    const prefix = '13640661';
    var sha1 = crypto.createHash('sha1');
    sha1.update(prefix + password);
    var pwd = sha1.digest('hex');
    return pwd;
  },

  randomString: (len)=> {
  　　len = len || 32;
  　　var $chars = 'ABCDEFGHJKMNPQRSTVUWXYZLIabcdefhijkmnpgqvurstwxyz123456789';
  　　var maxPos = $chars.length;
  　　var pwd = '';
  　　for (let i = 0; i < len; i++) {
  　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  　　}
  　　return pwd;
  },

  loginSuccess: (message,token,username,userId)=>{
    const result = {
      'status':200,
      'message':message,
      'token':token,
      'username':username,
      'userId':userId,
    };
    return result;
  },

  expireToken:(message,token)=>{
    const result = {
      'status':409,
      'message':message,
      'token':token
    };
    return result;
  },

  randomNumber:(num)=>{
    var str = '';
    for(var i = 0; i < num; i += 1){
      str += Math.floor(Math.random() * 10);
    }
    return str;
  },

  judgeImageStringInArrayObject:(str,array)=>{
    let  result = true;
    for(const updateAssets of array.artifact_assets){
      if (str == updateAssets.profileImage){
        result = false
      }
    }
    return result;
  },

  judgeMediaStringInArrayObject:(str,array)=>{
    let  result = true;
    for(const updateAssets of array.artifact_assets){
      if (str == updateAssets.mediaFile){
        result = false
      }
    }
    return result;
  }
}
