<?php
// Excel的默认设置
define ( "EXCEL_CREATOR", "TLandPartner" );
// 邮件接口的用户名密码
define ( "MAIL_HOST", "smtp.163.com" );
define ( "MAIL_PORT", "25" );
define ( "MAIL_USER", "18503082346@163.com" );
define ( "MAIL_PASS", "394246577" );
define ( "MAIL_USER_NAME", "长春万科金牌销售员平台" );
define ( "MAIL_USER_TITLE", "长春万科金牌销售员平台提醒邮件" );
define ( "MAIL_DEAL_CONTENT", dirname ( __FILE__ ) . '/../View/AddDealMail.php' );
// 短信接口的用户名密码
define ( "SMS_USER", "younggun2002" );
define ( "SMS_PASS", "rch19780602" );
define ( "SMS_VALID_CONTENT", "您的金牌销售员注册验证码为%s，请完成验证。如非本人操作，请忽略本短信。" );
define ( "SMS_DEAL_CONTENT", "恭喜您，您已经被%s号金牌销售员推荐至%s项目，金牌销售员电话%s，到访第一时间请出示本短信。" );
define ( "SMS_REGISTER_CONTENT", "您提交的金牌销售员信息注册已成功, 审核通过后将为您发送金牌销售员专属代码。" );
define ( "SMS_VERTIFY_CONTENT", "恭喜您成为万科金牌销售员，您的金牌销售员专属代码为%s。" );
define ( "SMS_VERTIFY_FAIL_CONTENT", "您提交的金牌销售员注册信息暂未通过审核，请您再次核实您提供的信息或致电0431-89188335详询。" );
define ( "SMS_VERTIFY_CANCEL_CONTENT", "您提交的金牌销售员注册信息已注销，如有疑问请致电0431-89188335详询。" );
// 数据库连接常量
define ( "MYSQL_ADDRESS", "203.195.180.176" );
define ( "MYSQL_PORT", 3306 );
define ( "MYSQL_USER", "root" );
define ( "MYSQL_PASS", "leweike_dev1508" );
define ( "MYSQL_DB", "wanke-sales" );
// 数据库表名常量
define ( "MYSQL_TABLE_USER", "t_user" );
define ( "MYSQL_TABLE_ADMIN", "t_admin" );
define ( "MYSQL_TABLE_SEND", "t_send" );
define ( "MYSQL_TABLE_ADMIN_PERMISS", "t_admin_permiss" );
define ( "MYSQL_TABLE_REGISTER", "t_register" );
define ( "MYSQL_TABLE_PROJECT", "t_project" );
define ( "MYSQL_TABLE_MESSAGE", "t_message" );
define ( "MYSQL_TABLE_DEAL", "t_deal" );
define ( "MYSQL_TABLE_DEAL_STATE", "t_deal_state" );
define ( "MYSQL_TABLE_DEAL_APPEAL", "t_deal_appeal" );
// 定义数据库字段约束
$MYSQL_TABLE_USER_CONSTRAINT = array (
		"userId|integer|1,1000000000",
		"name|wordchar|1,32",
		"phoneNumber|digitchar|11,11",
		"type|enum|1,2,3",
		"createTime|datetime",
		"modifyTime|datetime" 
);
$MYSQL_TABLE_ADMIN_CONSTRAINT = array (
		"adminId|integer|1,1000000000",
		"name|wordchar|1,32",
		"password|hexchar|40,40",
		"createTime|datetime",
		"modifyTime|datetime" 
);
$MYSQL_TABLE_REGISTER_CONSTRAINT = array (
		"registerId|integer|1,1000000000",
		"phoneNumber|digitchar|11,11",
		"checkNumber|digitchar|6,6",
		"createTime|datetime",
		"modifyTime|datetime" 
);
$MYSQL_TABLE_PROJECT_CONSTRAINT = array (
		"projectId|integer|1,1000000000",
		"title|wordchar|1,64",
		"description|contentchar|1,512",
		"pictureUrl|urlchar|1,128",
		"createTime|datetime",
		"modifyTime|datetime" 
);
$MYSQL_TABLE_DEAL_CONSTRAINT = array (
		"dealId|integer|1,1000000000",
		"name|wordchar|1,32",
		"phoneNumber|digitchar|11,11",
		"projectId|integer|1,1000000000",
		"middleManId|integer|1,1000000000",
		"state|enum|1,2,3,4,5,6",
		"price|enum|0,1000000000",
		"createTime|datetime",
		"modifyTime|datetime" 
);
$MYSQL_TABLE_DEAL_STATE_CONSTRAINT = array (
		"dealStateId|integer|1,1000000000",
		"dealId|integer|1,1000000000",
		"state|integer|1,2,3,4,5,6",
		"createTime|datetime",
		"modifyTime|datetime" 
);
$MYSQL_TABLE_DEAL_APPEAL_CONSTRAINT = array (
		"dealAppealId|integer|1,1000000000",
		"dealId|integer|1,1000000000",
		"message|contentchar|1,512",
		"replyMessage|contentchar|1,512",
		"state|enum|1,2",
		"createTime|datetime",
		"modifyTime|datetime" 
);
$MYSQL_TABLE_MESSAGE_CONSTRAINT = array (
		"messageId|integer|1,1000000000",
		"message|contentchar|1,512",
		"userId|integer|1,1000000000",
		"type|enum|1,2",
		"state|enum|1,2",
		"createTime|datetime",
		"modifyTime|datetime" 
);
// 管理员相关的枚举常量
define ( "ADMIN_TYPE_SUPER", 1 );
define ( "ADMIN_TYPE_NORMAL", 2 );
define ( "ADMIN_TYPE_AE", 3 );
define ( "ADMIN_TYPE_MONEY", 4 );
define ( "ADMIN_TYPE_PERFESSION", 5 );
define ( "ADMIN_TYPE_SECRETARY", 6 );
define ( "ADMIN_TYPE_SECRETARY2", 7 );
// 用户相关的枚举常量
define ( "USER_TYPE_MIDDLE_MAN", 1 );
define ( "USER_STATE_INVALID", 1 );
define ( "USER_STATE_VALID", 2 );
define ( "USER_STATE_VALID_FAIL", 3 );
define ( "USER_STATE_VALID_CANCEL", 4 );
// 订单相关的枚举常量
define ( "DEAL_STATE_HAVE_REPORT", 1 );
define ( "DEAL_STATE_HAVE_LOOK", 2 );
define ( "DEAL_STATE_HAVE_PLEDGE", 3 );
define ( "DEAL_STATE_HAVE_DEAL", 4 );
define ( "DEAL_STATE_PAY_READY", 5 );
define ( "DEAL_STATE_PAYING", 6 );
define ( "DEAL_STATE_HAVE_PAY", 7 );
define ( "DEAL_STATE_LENGTH", 7 );
// 订单相关的枚举常量2
define ( "DEAL_STATE2_VALID", 1 );
define ( "DEAL_STATE2_EXPIRE", 2 );
// 消息相关的枚举常量
define ( "MESSAGE_TYPE_PRIVATE", 1 );
define ( "MESSAGE_TYPE_PUBLIC", 2 );
define ( "MESSAGE_STATE_NO_READ", 1 );
define ( "MESSAGE_STATE_HAVE_READ", 2 );
// 申诉相关的枚举常量
define ( "DEAL_APPEAL_STATE_NO_READ", 1 );
define ( "DEAL_APPEAL_STATE_HAVE_READ", 2 );
// 异步发送相关的枚举变量
define ( "SEND_TYPE_SMS", 1 );
define ( "SEND_TYPE_MAIL", 2 );
define ( "SEND_STATE_NOSEND", 1 );
define ( "SEND_STATE_SUCCESS", 2 );
define ( "SEND_STATE_FAIL", 3 );
// 订单状态的相关常量
$DEAL_APPEAL_NAME = array (
		"1" => "未处理",
		"2" => "已处理" 
);
$ADMIN_TYPE_NAME = array (
		"1" => "超级管理员",
		"2" => "普通管理员",
		"3" => "项目AE",
		"4" => "项目财务",
		"5" => "金牌销售员专员",
		"6" => "金牌销售员秘书",
		"7" => "项目秘书" 
);
$USER_STATE_NAME = array (
		"1" => "未审核",
		"2" => "审核通过",
		"3" => "审核未通过",
		"4" => "已注销" 
);
$DEAL_STATE_NAME = array (
		"1" => "报备",
		"2" => "到访",
		"3" => "认购",
		"4" => "签约",
		"5" => "回款", // price
		"6" => "结佣中",
		"7" => "已结佣" 
);
$DEAL_STATE2_NAME = array (
		"1" => "有效",
		"2" => "已过期" 
);
$USER_TYPE_NAME = array (
		"1" => "金牌销售员" 
);
$MESSAGE_TYPE_NAME = array (
		"1" => "个人消息",
		"2" => "系统消息" 
);
$MESSAGE_STATE_NAME = array (
		"1" => "未读",
		"2" => "已读" 
);
$DEAL_AREA_LIST = array (
		"60平米以下",
		"60-80平米",
		"80-100平米",
		"100-120平米",
		"120-140平米",
		"140-160平米",
		"160-180平米",
		"180-240平米",
		"240平米以上" 
);
$DEAL_BUDGET_LIST = array (
		"20万以内",
		"20-30万",
		"30-40万",
		"40-50万",
		"50-100万",
		"100-200万",
		"200-300万",
		"300万以上" 
);
// 系统配置变量
define ( "CHECKNUMBER_LENGTH", 6 );
define ( "CHECKNUMBER_EXPIRETIME", 60 * 10 );
define ( "CHECKNUMBER_LIMITTIME", 60 );
define ( "UPLOAD_FILE_TYPE", "image/jpeg" );
define ( "UPLOAD_FILE_MAX_SIZE", 1024 * 1024 * 10 );
define ( "DEAL_REPORT_EXPIRETIME", 60 * 60 * 24 * 30 );
define ( "DEAL_LIMIT_ONE_DAY", 2 );
// 系统错误码常量
define ( "ERR_NO_LOGIN", 10002 );
define ( "ERR_NO_REGISTER", 10003 );
define ( "ERR_NO_VERTIFY", 10004 );
define ( "ERR_NO_MIDDLE_MAN", 10005 );
define ( "ERR_NO_PERMISS", 10006 );
define ( "ERR_NO_TWO_CLIENT_ONE_DAY", 10007 );
?>
