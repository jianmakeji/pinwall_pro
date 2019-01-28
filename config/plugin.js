'use strict';

// had enabled by egg
// exports.static = true;

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.passport = {
  enable: true,
  package: 'egg-passport',
};

exports.passportLocal = {
  enable: true,
  package: 'egg-passport-local',
};

exports.elasticsearch = {
  enable: true,
  package: 'egg-elasticsearch',
};

// exports.passportWeixin = {
//   enable: true,
//   package: 'egg-passport-weixin',
// };

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};
