const LocalStrategy = require('passport-local').Strategy;
const WeixinStrategy = require('passport-weixin');

module.exports = app => {

  app.passport.use(new LocalStrategy({
    passReqToCallback: true,
  }, (req, username, password, done) => {
    // format user
    const user = {
      provider: 'local',
      message: '',
      success: false,
      username,
      password,
    };
    app.passport.doVerify(req, user, done);

  }));

  // 处理用户信息

  app.passport.verify(async (ctx, user) => {
    const existsUser = await ctx.service.users.loginFindByUserWithEmail(user.username);

    if (existsUser) {
      if (app.cryptoPwd(app.cryptoPwd(user.password)) == existsUser.password){
        existsUser.password = '';
        return existsUser;
      }
      else{
         return false;
       }
    }
    else {
      return false;
    }
  });

  app.passport.use('loginByWeixin', new WeixinStrategy({
    clientID: 'wxe7bac3b26bdd1205',
    clientSecret: '4ba159f4548a64e8eb5567e860c4f067',
    callbackURL: '/loginByWeixin',
    requireState: true,
    scope: 'snsapi_login',

  }, function(accessToken, refreshToken, profile, done) {

    const user = {
      Id:0,
      email:'',
      fullname:'',
    };
    user.openid = profile._json.openid;
    user.nickname = profile._json.nickname;
    user.sex = profile._json.sex;
    user.language = profile._json.language;
    user.city = profile._json.city;
    user.province = profile._json.province;
    user.country = profile._json.country;
    user.headimageurl = profile._json.headimgurl;
    user.unionid = profile._json.unionid;

    done(null,user);
  }));
  //
  // //微信客户端登录
  // //微信官网文档：http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
  // passport.use('loginByWeixinClient', new WeixinStrategy({
  //   clientID: 'CLIENTID',
  //   clientSecret: 'CLIENT SECRET',
  //   callbackURL: 'CALLBACK URL',
  //   requireState: false,
  //   authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize', //[公众平台-网页授权获取用户基本信息]的授权URL 不同于[开放平台-网站应用微信登录]的授权URL
  //   scope: 'snsapi_userinfo' //[公众平台-网页授权获取用户基本信息]的应用授权作用域 不同于[开放平台-网站应用微信登录]的授权URL
  // }, function(accessToken, refreshToken, profile, done) {
  //     app.passport.doVerify(req, profile, done);
  // }));

  // 将用户信息序列化后存进 session 里面，一般需要精简，只保存个别字段
  app.passport.serializeUser(async (ctx, user) => {
    // 处理 user
    // ...
    return user;
  });

  // 反序列化后把用户信息从 session 中取出来，反查数据库拿到完整信息
  app.passport.deserializeUser(async (ctx, user) => {
    // 处理 user
    // ...
    return user;
  });

};
