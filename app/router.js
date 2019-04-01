'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  const pageAuthCheck = app.middleware.pageAuthCheck();
  const ajaxAuthCheck = app.middleware.ajaxAuthCheck();
  const adminAuthCheck = app.middleware.adminAuthCheck();
  const vipAuthCheck = app.middleware.vipAuthCheck();

  router.get('/', controller.home.index);
  router.get('/index', controller.home.index);
  router.get('/login', controller.home.login);
  router.get('/relogin', controller.home.relogin);
  router.get('/wxRelogin', controller.home.wxRelogin);
  router.get('/wxRelogin', controller.home.wxRelogin);
  router.get('/wxCompleteInfo', controller.home.wxCompleteInfo);

  router.post('/login',app.passport.authenticate('local', {
       successReturnToOrRedirect : '/index',successFlash: true,
       failureRedirect: '/relogin',failureFlash: true }));

  router.get('/loginByWeixin',app.passport.authenticate('loginByWeixin', {
       successReturnToOrRedirect : '/website/users/bindWeixin',successFlash: true,
       failureRedirect: '/relogin',failureFlash: true,state: 'hello-pinwall', }));
  router.get('/logout', controller.home.logout);
  router.get('/wxLogin', controller.website.users.wxLogin);

  router.get('/upload', controller.home.upload);
  router.get('/uploadWork/:jobTag', pageAuthCheck, controller.home.uploadWork);
  router.get('/editUploadWork', controller.home.uploadWork);

  router.get('/project/:id', controller.home.project);
  router.get('/courseProjects', controller.home.topics);
  router.get('/graduationProjects', controller.home.topicsAbout);
  router.get('/users/:id', controller.home.users);
  router.get('/workFolder/:id', controller.home.workFolder);
  router.get('/userManager', pageAuthCheck, controller.home.userManager);
  router.get('/workManager', pageAuthCheck, controller.home.workManager);
  router.get('/commentManager', pageAuthCheck, controller.home.commentManager);
  router.get('/updateSE', pageAuthCheck, controller.home.updateSE);
  router.get('/topicsUpdate/:id', pageAuthCheck, controller.home.topicsUpdate);
  router.get('/children', controller.home.children);
  router.get('/search', controller.home.search);
  router.get('/resetInfo', controller.home.resetInfo);
  router.get('/forgetPwd', controller.home.forgetPwd);
  router.get('/register', controller.home.register);
  router.get('/createTopics', pageAuthCheck, controller.home.createTopics);
  router.get("/completeInfo", controller.home.completeInfo);
  router.get('/updatePwd',controller.home.updatePwd);
  router.get('/getSTSSignature/:fileType', ajaxAuthCheck, controller.website.alioss.getSTSSignature);
  router.get('/getUrlSignature', controller.website.alioss.getUrlSignature);
  router.get('/getCaptcha',controller.website.users.getCaptcha);
  router.get('/checkCaptcha',controller.website.users.checkCaptcha);
  router.get('/sms/createSmsMessage',controller.website.smsMessage.createSmsMessage);
  router.get('/sms/vertifySms',controller.website.smsMessage.vertifySms);

  //自定义接口
  router.get('/website/artifacts/getMedalDataByRandom/:limit', controller.website.artifacts.getMedalDataByRandom);
  router.get('/website/artifacts/getPersonalJob', ajaxAuthCheck, controller.website.artifacts.getPersonalJob);
  router.get('/website/artifacts/getPersonalJobByUserId', controller.website.artifacts.getPersonalJobByUserId);
  router.get('/website/artifacts/transterInsertDataToES', adminAuthCheck, controller.website.artifacts.transterInsertDataToES);
  router.get('/website/artifacts/transterUpdateDataToES', adminAuthCheck, controller.website.artifacts.transterUpdateDataToES);

  router.get('/website/artifactScores/findByArtifactIdWithPage', controller.website.artifactScores.findByArtifactIdWithPage);
  router.get('/website/artifactScores/findByScorerIdWithPage', controller.website.artifactScores.findByScorerIdWithPage);

  router.get('/website/artifactComment/findByArtifactIdWithPage', controller.website.artifactComment.findByArtifactIdWithPage);
  router.get('/website/artifactComment/setCommentVisible', ajaxAuthCheck, controller.website.artifactComment.setCommentVisible);

  router.put('website.users.updateAcviveByUserId', '/website/users/updateAcviveByUserId/:id', ajaxAuthCheck, controller.website.users.updateAcviveByUserId);

  router.get('website.users.bindWeixin', '/website/users/bindWeixin', controller.website.users.bindWeixin);
  router.post('website.users.bindWeixinInfoByMobile', '/website/users/bindWeixinInfoByMobile', controller.website.users.bindWeixinInfoByMobile);
  router.post('website.users.createWxUser', '/website/users/createWxUser', controller.website.users.createWxUser);
  router.post('website.users.createUser', '/website/users/createUser', controller.website.users.createUser);
  router.put('website.users.updatePwd', '/website/users/updatePwd', controller.website.users.updatePwd);
  router.put('website.users.updatePwdWithMobileAndSmsCode', '/website/users/updatePwdWithMobileAndSmsCode', controller.website.users.updatePwdWithMobileAndSmsCode);
  router.put('website.users.updateUserRole', '/website/users/updateUserRole', adminAuthCheck, controller.website.users.updateUserRole);
  router.get('website.users.searchByUsername', '/website/users/searchByUsername', controller.website.users.searchByUsername);
  router.get('website.users.searchByMobile', '/website/users/searchByMobile', adminAuthCheck, controller.website.users.searchByMobile);

  router.get('website.topics.getTopicAndArtifactById', '/website/topics/getTopicAndArtifactById', controller.website.topics.getTopicAndArtifactById);
  router.get('website.topics.findArtifactByTopicId', '/website/topics/findArtifactByTopicId', controller.website.topics.findArtifactByTopicId);
  router.get('website.topics.exportExcelByTopicId', '/website/topics/exportExcelByTopicId', controller.website.topics.exportExcelByTopicId);

  router.get('website.search.searchByKeywords','/website/search/searchByKeywords', controller.website.search.searchByKeywords);
  router.get('website.search.suggestKeyWords','/website/search/suggestKeyWords', controller.website.search.suggestKeyWords);
  router.get('website.search.suggestKeyWordsWithJobtag','/website/search/suggestKeyWordsWithJobtag', controller.website.search.suggestKeyWordsWithJobtag);
  router.get('website.search.searchByKeywordsAndJobtag','/website/search/searchByKeywordsAndJobtag', controller.website.search.searchByKeywordsAndJobtag);
  router.get('website.search.searchArtifactsByNameOrTermName','/website/search/searchArtifactsByNameOrTermName',adminAuthCheck, controller.website.search.searchArtifactsByNameOrTermName);
  router.get('website.artifactComment.searchComment','/website/artifactComment/searchComment',adminAuthCheck, controller.website.artifactComment.searchComment);

  router.get('website.search.transferData','/website/search/transferData', controller.website.search.transferData);

  router.put('website.topics.updateTopicStatus','/website/topics/updateTopicStatus', controller.website.topics.updateTopicStatus);

  router.get('website.artifactMedalLike.getMedalLikeDataByUserIdAndArtifactsId', '/website/artifactMedalLike/getMedalLikeDataByUserIdAndArtifactsId', ajaxAuthCheck, controller.website.artifactMedalLike.getMedalLikeDataByUserIdAndArtifactsId);


  //网站接口
  router.resources('website.users', '/website/users',  ajaxAuthCheck, controller.website.users);
  router.resources('website.artifactComment', '/website/artifactComment', ajaxAuthCheck, controller.website.artifactComment);
  router.resources('website.artifacts', '/website/artifacts', controller.website.artifacts);
  router.resources('website.roles', '/website/roles', ajaxAuthCheck, controller.website.roles);
  router.resources('website.terms', '/website/terms', controller.website.terms);
  router.resources('website.topics', '/website/topics', controller.website.topics);
  router.resources('website.artifactScores', '/website/artifactScores', vipAuthCheck, controller.website.artifactScores);
  router.resources('website.artifactMedalLike', '/website/artifactMedalLike', ajaxAuthCheck, controller.website.artifactMedalLike);

  //微信接口
  router.get('/wx/artifacts/getMedalDataByRandom/:limit', controller.wx.artifacts.getMedalDataByRandom);
  router.get('/wx/artifacts/getArtifactById/:id', controller.wx.artifacts.getArtifactById);
  router.get('/wx/artifacts/findCommentsByArtifactIdWithPage', controller.wx.artifacts.findCommentsByArtifactIdWithPage);
  router.get('/wx/artifacts/getMedalLikeDataByUserIdAndArtifactsId', controller.wx.artifacts.getMedalLikeDataByUserIdAndArtifactsId);

  router.get('/wx/topics/getTopicAndArtifactById', controller.wx.topics.getTopicAndArtifactById);
  router.get('/wx/topics/findArtifactByTopicId', controller.wx.topics.findArtifactByTopicId);
  router.post('wx.users.createWxUser', '/wx/users/createWxUser', controller.wx.users.createWxUser);
  router.post('wx.users.bindWeixinInfoByMobile', '/wx/users/bindWeixinInfoByMobile', controller.wx.users.bindWeixinInfoByMobile);
  router.get('wx.users.refreshUserInfo', '/wx/users/refreshUserInfo/:id', controller.wx.users.refreshUserInfo);

  router.get('/wx/users/getWxCode', controller.wx.users.getWxCode);
  router.post('/wx/artifacts/createComment', controller.wx.artifacts.createComment);
  router.post('/wx/artifacts/createScore', controller.wx.artifacts.createScore);
  router.post('/wx/artifacts/createLike', controller.wx.artifacts.createLike);
  router.get('/wx/artifacts/getPersonalJobByUserId', controller.wx.artifacts.getPersonalJobByUserId);

  router.resources('wx.topics', '/wx/topics',  controller.wx.topics);

};
