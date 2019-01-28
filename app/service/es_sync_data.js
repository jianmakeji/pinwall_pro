'use strict';

const Service = require('egg').Service;

class EsSyncData extends Service {

  async createEsSyncData(syncType, date) {
    return this.ctx.model.EsSyncData.createEsSyncData(syncType, date);
  }

  async getDateBySyncType(syncType) {
    return await this.ctx.model.EsSyncData.getDateBySyncType(syncType);
  }

  async update(syncType, date) {
    return await this.ctx.model.EsSyncData.updateDate(syncType, date);
  }

}

module.exports = EsSyncData;
