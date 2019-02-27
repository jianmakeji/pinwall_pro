# Host: 192.168.3.110  (Version 5.6.28-log)
# Date: 2019-02-27 18:02:16
# Generator: MySQL-Front 6.0  (Build 2.25)


#
# Structure for table "artifact_assets"
#

CREATE TABLE `artifact_assets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `artifactId` int(11) NOT NULL DEFAULT '0',
  `position` smallint(6) NOT NULL DEFAULT '0',
  `name` varchar(130) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `description` text,
  `type` smallint(3) DEFAULT NULL,
  `profileImage` varchar(120) DEFAULT NULL,
  `mediaFile` varchar(120) DEFAULT NULL,
  `viewUrl` varchar(130) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `artifactId` (`artifactId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "artifact_assets"
#


#
# Structure for table "artifact_comments"
#

CREATE TABLE `artifact_comments` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `artifactId` int(11) DEFAULT NULL,
  `commenterId` int(11) DEFAULT NULL,
  `content` text,
  `commentAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `visible` bit(1) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `artifactId` (`artifactId`,`commenterId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "artifact_comments"
#


#
# Structure for table "artifact_medal_like"
#

CREATE TABLE `artifact_medal_like` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `tag` tinyint(3) NOT NULL DEFAULT '0' COMMENT '1:勋章 2:点赞',
  `userId` int(11) DEFAULT NULL,
  `artifactId` int(11) DEFAULT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `artifactId` (`artifactId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "artifact_medal_like"
#


#
# Structure for table "artifact_scores"
#

CREATE TABLE `artifact_scores` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `artifactId` int(11) NOT NULL DEFAULT '0',
  `scorerId` int(11) NOT NULL DEFAULT '0',
  `score` smallint(6) DEFAULT NULL,
  `createAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `artifactId` (`artifactId`,`scorerId`),
  KEY `scorerId` (`scorerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "artifact_scores"
#


#
# Structure for table "artifact_term"
#

CREATE TABLE `artifact_term` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `artifactId` int(11) NOT NULL DEFAULT '0',
  `termId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `artifactId` (`termId`),
  KEY `artifactId_2` (`artifactId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "artifact_term"
#


#
# Structure for table "artifacts"
#

CREATE TABLE `artifacts` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0',
  `name` varchar(130) NOT NULL DEFAULT '',
  `description` text,
  `profileImage` varchar(110) NOT NULL DEFAULT '',
  `visible` tinyint(3) DEFAULT '0',
  `jobTag` tinyint(3) DEFAULT '0' COMMENT '1：作业  2：作品集',
  `medalCount` int(11) DEFAULT '0',
  `likeCount` int(11) DEFAULT '0',
  `commentCount` int(11) DEFAULT '0',
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "artifacts"
#


#
# Structure for table "es_sync_data"
#

CREATE TABLE `es_sync_data` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `syncType` smallint(6) NOT NULL DEFAULT '0' COMMENT '1:同步pinwall索引数据，2：同步suggest数据',
  `lastSyncTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#
# Data for table "es_sync_data"
#

INSERT INTO `es_sync_data` VALUES (1,1,'2019-02-26 19:33:10');

#
# Structure for table "roles"
#

CREATE TABLE `roles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

#
# Data for table "roles"
#

INSERT INTO `roles` VALUES (1,'user','user can create artifact'),(2,'vip','vip can create topic'),(3,'admin','admin can do anything'),(4,'user','user can create artifact'),(5,'vip','vip can create topic'),(6,'admin','admin can do anything');

#
# Structure for table "sms_message"
#

CREATE TABLE `sms_message` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `mobile` varchar(15) NOT NULL DEFAULT '',
  `code` varchar(6) DEFAULT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

#
# Data for table "sms_message"
#

INSERT INTO `sms_message` VALUES (1,'18684799929','601301','2019-02-27 00:36:27');

#
# Structure for table "terms"
#

CREATE TABLE `terms` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "terms"
#


#
# Structure for table "topic_artifact"
#

CREATE TABLE `topic_artifact` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `topicId` int(11) NOT NULL DEFAULT '0',
  `artifactId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `artifactId` (`artifactId`),
  KEY `topicId` (`topicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "topic_artifact"
#


#
# Structure for table "topic_term"
#

CREATE TABLE `topic_term` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `topicId` int(11) NOT NULL DEFAULT '0',
  `termId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `termId` (`termId`),
  KEY `topicId` (`topicId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "topic_term"
#


#
# Structure for table "topics"
#

CREATE TABLE `topics` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` text,
  `status` smallint(6) DEFAULT NULL,
  `jobTag` tinyint(3) DEFAULT '0' COMMENT '1:作业荚 2：毕业设计',
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "topics"
#


#
# Structure for table "user_role"
#

CREATE TABLE `user_role` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL DEFAULT '0',
  `roleId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `userId` (`userId`,`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "user_role"
#


#
# Structure for table "users"
#

CREATE TABLE `users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(30) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `password` varchar(64) NOT NULL DEFAULT '',
  `openId` varchar(64) DEFAULT NULL,
  `unionId` varchar(64) DEFAULT NULL,
  `nickname` varchar(30) DEFAULT NULL,
  `avatarUrl` varchar(200) DEFAULT NULL,
  `gender` tinyint(3) DEFAULT NULL,
  `province` varchar(20) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `wxActive` tinyint(1) DEFAULT NULL,
  `commentCount` int(11) NOT NULL DEFAULT '0',
  `medalCount` mediumint(9) NOT NULL DEFAULT '0',
  `artifactCount` int(11) NOT NULL DEFAULT '0',
  `likeCount` mediumint(9) NOT NULL DEFAULT '0',
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmedAt` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "users"
#

