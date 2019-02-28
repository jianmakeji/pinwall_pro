'use strict';

const BaseController = require('../BaseController');
const { STS } = require('ali-oss');
const fs = require('fs');
const path = require('path');

class AliOSSController extends BaseController {

  async getSTSSignature() {

    const ctx = this.ctx;
    const aliConfigObj = ctx.helper.aliConfig();

    const fileType = ctx.params.fileType;

    let dir = '';
    if (fileType == 1){
      dir = ctx.helper.imagePath;
    }
    else if (fileType == 2){
      dir = ctx.helper.pdfPath;
    }
    else if (fileType == 3){
      dir = ctx.helper.rar_zipPath;
    }
    else if (fileType == 4){
      dir = ctx.helper.videoPath;
    }
    else{
      dir = ctx.helper.othersPath;
    }

    let host = "http://" + aliConfigObj.bucket + "." + aliConfigObj.endpoint;

    var policy = {
      "Version": "1",
      "Statement": [
        {
            "Effect": "Allow",
            "Action": [
            "oss:GetObject",
            "oss:PutObject"
            ],
            "Resource": [
            "acs:oss:*:*:pinwall-pro",
            "acs:oss:*:*:pinwall-pro/*"
            ]
        }
      ]
  };

    let roleSessionName = 'jianma-001';

    const client = new STS({
      accessKeyId: aliConfigObj.AccessKeyId,
      accessKeySecret: aliConfigObj.AccessKeySecret
    });

    await client.assumeRole(aliConfigObj.RoleArn, policy, aliConfigObj.TokenExpireTime, roleSessionName).then((result) => {
      result.credentials.host = host;
      result.credentials.dir = dir;
      ctx.body = result;
    }).catch((err) => {
      super.failure(err);
    });
  }

  async getUrlSignature(){
    const ctx = this.ctx;

    ctx.body = ctx.helper.signatureUrl(ctx.query.objectPath,ctx.query.thumbName);
  }
}

module.exports = AliOSSController;
