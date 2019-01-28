const { Controller } = require('egg');

class BaseController extends Controller {

  getUser() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = {
      success: true,
      status:200,
      data:data,
    };
  }

  failure(data) {

    this.ctx.body = {
      success: true,
      status:500,
      data,
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}
module.exports = BaseController;
