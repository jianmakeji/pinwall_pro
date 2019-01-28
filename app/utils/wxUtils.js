const request = require('request');

module.exports.getAccessToken = (wx_appid, wx_secret, wx_code) => {

  return new Promise((resolve, reject) => {
    const requestUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wx_appid}&secret=${wx_secret}&code=${wx_code}&grant_type=authorization_code`;
    request(requestUrl, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

module.exports.getUserInfo = (wx_access_token, openId) => {

  return new Promise((resolve, reject) => {
    const requestUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${wx_access_token}&openid=${openId}`;
    request(requestUrl, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
