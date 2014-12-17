#创建数据库
drop database wanke-sales;
create database wanke-sales;
use wanke-sales;
#创建表
#用户表
create table t_user(
	userId varchar(128) not null ,
	userCode integer not null auto_increment, 
	name char(32) not null,
	phoneNumber char(11) not null,
	identityNumber char(18) not null,
	identityUrl char(128) not null,
	bankNumber char(19) not null,
	remark char(128) not null,
	type integer not null,
	state integer not null,
	createTime datetime not null,
	modifyTime datetime not null,
	primary key( userCode ),
	unique key( userId ),
	index( name ),
	index( phoneNumber )
)engine=innodb default charset=utf8 auto_increment = 10001;
#管理员表
create table t_admin(
	adminId integer not null auto_increment,
	name char(32) not null,
	password  char(48) not null,
	phoneNumber char(11) not null,
	mail char(128) not null,
	type integer not null,
	createTime datetime not null,
	modifyTime datetime not null, 
	primary key( adminId ),
	unique key( name )
)engine=innodb default charset=utf8 auto_increment = 10001;
#注册中间表
create table t_register(
	registerId integer not null auto_increment,
	userId varchar(128) not null,
	phoneNumber char(11) not null,
	checkNumber char(6) not null,
	createTime datetime not null,
	modifyTime datetime not null,
	primary key( registerId )
)engine=innodb default charset=utf8 auto_increment = 10001;
#异步发送邮件和短信表
create table t_send(
	sendId integer not null auto_increment,
	data text not null,
	result char(64) not null,
	type integer not null,
	state integer not null,
	createTime datetime not null,
	modifyTime datetime not null,
	primary key( sendId )
)engine=innodb default charset=utf8 auto_increment = 10001;
#项目表
create table t_project(
	projectId integer not null auto_increment,
	title varchar(64) not null,
	description varchar(512) not null,
	stock integer not null ,
	pictureUrl varchar(128) not null,
	infoUrl varchar(128) not null,
	createTime datetime not null,
	modifyTime datetime not null,
	primary key( projectId )
)engine=innodb default charset=utf8 auto_increment = 10001;
#管理员权限表
create table t_admin_permiss(
	adminId integer not null,
	projectId integer not null,
	createTime datetime not null,
	modifyTime datetime not null, 
	primary key( adminId ,projectId ),
	index( projectId ),
	foreign key( adminId ) references t_admin( adminId ) on delete cascade,
	foreign key( projectId ) references t_project( projectId ) on delete cascade
)engine=innodb default charset=utf8 auto_increment = 10001;
#订单表
create table t_deal(
	dealId integer not null auto_increment,
	name char(32) not null,
	phoneNumber char(11) not null,
	projectId integer not null,
	middleManId varchar(128) not null,
	area char(32) not null,
	budget char(32) not null,
	price integer not null,
	state integer not null,
	state2 integer not null,
	createTime datetime not null,
	modifyTime datetime not null,
	primary key( dealId ),
	index( name ),
	index( phoneNumber ),
	index( middleManId ),
	foreign key( projectId ) references t_project( projectId ),
	foreign key( middleManId ) references t_user( userId ) on update cascade 
)engine=innodb default charset=utf8 auto_increment = 10001;
#订单状态表
create table t_deal_state(
	dealStateId integer not null auto_increment,
	dealId integer not null,
	state integer not null,
	name char(32) not null,
	createTime datetime not null,
	modifyTime datetime not null,
	primary key( dealStateId ),
	index( dealId ),
	foreign key( dealId ) references t_deal( dealId )
)engine=innodb default charset=utf8 auto_increment = 10001;
#订单申诉表
create table t_deal_appeal(
	dealAppealId integer not null auto_increment,
	dealId integer not null,
	message varchar(512) not null,
	replyMessage varchar(512) not null,
	state integer not null,
	createTime datetime not null,
	modifyTime datetime not null,
	primary key( dealAppealId ),
	foreign key( dealId ) references t_deal( dealId )
)engine=innodb default charset=utf8 auto_increment = 10001;
#消息表
create table t_message(
	messageId integer not null auto_increment,
	message varchar(512) not null,
	userId varchar(128) not null,
	type integer not null,
	state integer not null,
	createTime datetime not null,
	modifyTime datetime not null,
	primary key( messageId ),
	index( userId ),
	foreign key( userId ) references t_user( userId ) on update cascade 
)engine=innodb default charset=utf8 auto_increment = 10001;

#创建默认数据
insert into t_admin(name,password,phoneNumber,mail,type,createTime,modifyTime)values
("fish",SHA1("123"),18503082348,"306766045@qq.com",1,now(),now()),
#项目AE
("宋阳",SHA1("123"),18503082348,"songy11@vanke.com",3,now(),now()),
("岑再",SHA1("123"),18503082348,"cenzai@vanke.com",3,now(),now()),
("赵玥",SHA1("123"),18503082348,"zhaoy12@vanke.com",3,now(),now()),
("吕铮",SHA1("123"),18503082348,"lvz02@vanke.com",3,now(),now()),
("杨庆雨",SHA1("123"),18503082348,"yangqy02@vanke.com",3,now(),now()),
("张振哲",SHA1("123"),18503082348,"zhangzz01@vanke.com",3,now(),now()),
("吉林万科城",SHA1("123"),18503082348,"wangs10@vanke.com",3,now(),now()),
#项目财务
("于欣欣",SHA1("123"),18503082348,"xcsk1@vanke.com",4,now(),now()),
("杜珊",SHA1("123"),18503082348,"v-dushan@vanke.com",4,now(),now()),
("刘丽娜",SHA1("123"),18503082348,"v-liuln03@vanke.com",4,now(),now()),
("钱丽娜",SHA1("123"),18503082348,"v-qianln@vanke.com",4,now(),now()),
("支秀梅",SHA1("123"),18503082348,"v-zhixm@vanke.com",4,now(),now()),
("李红鹤",SHA1("123"),18503082348,"v-lihh03@vanke.com",4,now(),now()),
#经纪人专员
("吕铮经纪人专员",SHA1("123"),18503082348,"lvz02@vanke.com",5,now(),now()),
#经纪人秘书
("赵若珊",SHA1("123"),18503082348,"zhaors@vanke.com",6,now(),now()),
#项目秘书
("赵若杉",SHA1("123"),18503082348,"zhaors@vanke.com",7,now(),now()),
("关鑫桐",SHA1("123"),18503082348,"v-CCdaili@vanke.com",7,now(),now()),
("孙丽丽",SHA1("123"),18503082348,"sunll02@vanke.com",7,now(),now()),
("秦美玲",SHA1("123"),18503082348,"qinml@vanke.com",7,now(),now()),
("李佳姗",SHA1("123"),18503082348,"lijx05@vanke.com",7,now(),now()),
("刘畅",SHA1("123"),18503082348,"liuchang01@vanke.com",7,now(),now()),
("刘栩",SHA1("123"),18503082348,"liuxu@vanke.com",7,now(),now()),
("吕悦铭",SHA1("123"),18503082348,"v-ccsx06@vanke.com",7,now(),now()),
#测试项目秘书
("黎锦伟",SHA1("123"),18503082348,"306766045@qq.com",7,now(),now());
insert into t_user(userId,name,phoneNumber,identityNumber,identityUrl,bankNumber,remark,type,state,createTime,modifyTime)values
(10001,"朱洪波",18503082348,"440681199011014234","/Img/1.jpg","6214836551375499","我是一名好人",1,2,now(),now()),
(10002,"林炳锡",18503082349,"440681199011014234","/Img/1.jpg","6214836551375499","我是一名好人",1,2,now(),now()),
(10003,"陈厚兵",18503082350,"440681199011014234","/Img/1.jpg","6214836551375499","我是一名好人",1,2,now(),now()),
(10004,"温俊强",18503082351,"440681199011014234","/Img/1.jpg","6214836551375499","我是一名好人",1,2,now(),now()),
(10005,"黎锦伟",18503082352,"440681199011014234","/Img/1.jpg","6214836551375499","我是一名好人",2,1,now(),now()),
(10006,"舒丑丑",18503082353,"440681199011014234","/Img/1.jpg","6214836551375499","我是一名好人",2,1,now(),now());
insert into t_project(title,description,pictureUrl,infoUrl,stock,createTime,modifyTime)values
("万科·蓝山","新城央，新蓝图","/Img/s1.jpg","http://wanke.leweike.com/discription01.html",100,now(),now()),
("长春万科城","百万平米都市生态城","/Img/s2.jpg","http://wanke.leweike.com/discription04.html",200,now(),now()),
("万科·金域长春","市府都心、公园之央","/Img/s3.jpg","http://wanke.leweike.com/discription03.html",300,now(),now()),
("万科·柏翠园","心生大境之园","/Img/s4.jpg","http://wanke.leweike.com/discription02.html",400,now(),now()),
("万科·惠斯勒小镇","北美山地小镇","/Img/s5.jpg","http://wanke.leweike.com/discription05.html",500,now(),now()),
("吉林万科城","吉林万科滨江城","/Img/s6.jpg","http://wanke.leweike.com/discription06.html",500,now(),now());
insert into t_admin_permiss(adminId,projectId,createTime,modifyTime)values
#超级管理员
(10001,10001,now(),now()),
(10001,10002,now(),now()),
(10001,10003,now(),now()),
(10001,10004,now(),now()),
(10001,10005,now(),now()),
(10001,10006,now(),now()),
#项目AE
(10002,10001,now(),now()),
(10003,10005,now(),now()),
(10004,10004,now(),now()),
(10005,10004,now(),now()),
(10006,10002,now(),now()),
(10007,10003,now(),now()),
(10008,10006,now(),now()),
#项目财务
(10009,10003,now(),now()),
(10010,10005,now(),now()),
(10011,10001,now(),now()),
(10012,10004,now(),now()),
(10013,10002,now(),now()),
(10014,10006,now(),now()),
#经纪人专员
(10015,10001,now(),now()),
(10015,10002,now(),now()),
(10015,10003,now(),now()),
(10015,10004,now(),now()),
(10015,10005,now(),now()),
(10015,10006,now(),now()),
#经纪人秘书
(10016,10001,now(),now()),
(10016,10002,now(),now()),
(10016,10003,now(),now()),
(10016,10004,now(),now()),
(10016,10005,now(),now()),
(10016,10006,now(),now()),
#项目秘书
(10017,10004,now(),now()),
(10018,10004,now(),now()),
(10019,10002,now(),now()),
(10020,10003,now(),now()),
(10021,10001,now(),now()),
(10022,10005,now(),now()),
(10023,10006,now(),now()),
(10024,10006,now(),now()),
#测试项目秘书
(10025,10001,now(),now()),
(10025,10002,now(),now()),
(10025,10003,now(),now()),
(10025,10004,now(),now()),
(10025,10005,now(),now()),
(10025,10006,now(),now());
insert into t_message(message,userId,type,state,createTime,modifyTime)values
("消息1",10001,1,1,now(),now()),
("消息2",10001,1,2,now(),now()),
("消息3",10001,2,1,now(),now()),
("消息4",10001,2,2,now(),now());
insert into t_deal(name,phoneNumber,projectId,middleManId,area,budget,state,state2,price,createTime,modifyTime)values
("客户1",18503082346,10001,10001,"100平方","500万",1,1,0,now(),now()),
("客户2",18503082346,10002,10002,"100平方","500万",1,1,0,now(),now()),
("客户3",18503082346,10003,10003,"100平方","500万",1,1,0,now(),now()),
("客户4",18503082346,10004,10004,"100平方","500万",1,1,0,now(),now()),
("客户5",18503082346,10005,10001,"100平方","500万",1,1,0,now(),now()),
("客户6",18503082346,10001,10001,"100平方","500万",1,1,0,now(),now()),
("客户7",18503082346,10001,10001,"100平方","500万",1,1,0,now(),now());
insert into t_deal_state(dealId,state,name,createTime,modifyTime)values
(10001,1,'fish',now(),now()),
(10002,1,'fish',now(),now()),
(10003,1,'fish',now(),now()),
(10004,1,'fish',now(),now()),
(10005,1,'fish',now(),now()),
(10006,1,'fish',now(),now()),
(10007,1,'fish',now(),now());
insert into t_deal_appeal(dealId,message,replyMessage,state,createTime,modifyTime)values
(10001,"哈哈，挂了吧","",1,now(),now()),
(10002,"哈哈，挂了吧","",1,now(),now()),
(10003,"哈哈，挂了吧","",1,now(),now());
insert into t_send(data,type,state,createTime,modifyTime)values
('{"phoneNumber":"18503082346","content":"测试"}',1,1,now(),now()),
('{"addressList":[{"mail":"18503082346@163.com","name":"fishedee"},{"mail":"306766045@qq.com","name":"fish"}],"subject":"abc","body":"Hello SB"}',2,1,now(),now());
select * from t_admin;
select * from t_user;
select * from t_project;
select * from t_message;
select * from t_deal;
select * from t_deal_state;
select * from t_deal_appeal;
select * from t_send;
