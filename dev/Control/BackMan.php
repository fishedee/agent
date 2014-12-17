<?php
require_once(dirname(__FILE__).'/../Comm/Util.php');
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Model/AdminDb.php');
require_once(dirname(__FILE__).'/../Model/AdminPermissDb.php');
require_once(dirname(__FILE__).'/../Model/UserDb.php');
require_once(dirname(__FILE__).'/../Model/DealDb.php');
require_once(dirname(__FILE__).'/../Model/DealStateDb.php');
require_once(dirname(__FILE__).'/../Model/DealAppealDb.php');
require_once(dirname(__FILE__).'/../Model/MessageDb.php');
require_once(dirname(__FILE__).'/../Model/ProjectDb.php');
class BackMan{ 
//Db类
private $m_userDb;
private $m_dealDb;
private $m_dealStateDb;
private $m_dealAppealDb;
private $m_messageDb;
private $m_projectDb;
private $m_adminDb;
private $m_adminPermissDb;
//人物属性
private $m_userId;
private $m_userType;
private $m_userName;
public function __construct(){
	session_start();
	$this->m_adminDb = new AdminDb();
	$this->m_adminPermissDb = new AdminPermissDb();
	$this->m_userDb = new UserDb();
	$this->m_dealDb = new DealDb();
	$this->m_dealStateDb = new DealStateDb();
	$this->m_dealAppealDb = new DealAppealDb();
	$this->m_messageDb = new MessageDb();
	$this->m_projectDb = new ProjectDb();
}
private function CheckMustLogin(){
	if( $this->CheckIsLogin() == false )
		Util::ThrowException(ERR_NO_LOGIN,"请先登陆");
}
private function CheckMustPermiss( $projectId ){
	$adminPermiss = $this->m_adminPermissDb->Get(
		array(
			"equal"=>array(
				"adminId"=>$this->m_userId,
				"projectId"=>$projectId,
			)
		)
	);
	if( count($adminPermiss) == 0 ){
		Util::ThrowException(ERR_NO_PERMISS,"你没有权限执行该楼盘的操作");
	}
}
private function GetUserPermiss(){
	$adminPermiss = $this->m_adminPermissDb->Get(
		array(
			"equal"=>array(
				"adminId"=>$this->m_userId
			)
		)
	);
	$data = array();
	foreach( $adminPermiss as $single ){
		$data[] = $single['projectId'];
	}
	return $data;
}
private function CheckIsLogin(){
	if( isset($_SESSION["login"]) && $_SESSION["login"] == "true"){
		$this->m_userId = $_SESSION["id"];
		$this->m_userType = $_SESSION["type"];
		$this->m_userName = $_SESSION["name"];
		return true;
	}else{
		return false;
	}
}
public function CheckLogin(){
	if( $this->CheckIsLogin() == false )
		Util::ThrowException(ERR_NO_LOGIN,"未登陆");
	return array();
}
public function Login($post_name,$post_pass){
	if( $this->CheckIsLogin() == true )
		Util::ThrowException(1,"你已经登录过了，请勿重复登录");
	//校验数据
	//Util::CheckValid( $post_name , "wordchar|1,32");
	//Util::CheckValid( $post_pass , "wordchar|1,32");
	unset($_SESSION["login"]);
	unset($_SESSION["id"]);
	unset($_SESSION["name"]);
	unset($_SESSION["type"]);
	//取出账号密码对应的用户
	$admin = $this->m_adminDb->Get(
		array(
			"equal"=>array(
				"name"=>$post_name,
				"password"=>SHA1($post_pass)
			)
		)
	);
	if( count($admin) == 0 )
		Util::ThrowException(1,"登录密码错误或不存在这样的用户");
	
	$_SESSION["login"] = "true";
	$_SESSION["type"] = $admin[0]["type"];
	$_SESSION["id"] = $admin[0]["adminId"];
	$_SESSION["name"] = $admin[0]["name"];
	$this->m_userId = $_SESSION["id"];
	$this->m_userType = $_SESSION["type"];
	$this->m_userName = $_SESSION["name"];
	return array();
}
public function Logout(){
	$this->CheckMustLogin();
	session_destroy();
	return array();
}
//管理员管理
public function AddAdmin($post_name,$post_pass,$post_type,$post_phoneNumber,$post_mail){
	//校验数据
	//Util::CheckValid( $post_name , "wordchar|1,32");
	//Util::CheckValid( $post_pass , "wordchar|1,32");
	//Util::CheckValid( $post_type , "enum|1,2,3");
	//Util::CheckValid( $post_phoneNumber , "digitchar|11,11");
	//Util::CheckValid( $post_mail , "mail");
	//检查登录态
	$this->CheckMustLogin();
	//检查是否为超级管理员
	if($this->m_userType != ADMIN_TYPE_SUPER)
		Util::ThrowException(1,"需要超级管理员权限");
	if($post_type == ADMIN_TYPE_SUPER)
		Util::ThrowException(1,"不能添加超级管理员");
	//校验管理员
	$admin = $this->m_adminDb->Get(
		array(
			"equal"=>array(
				"name"=>$post_name
			)
		)
	);
	if( count($admin) != 0 )
		Util::ThrowException(1,"已经存在相同名字的管理员，不能重复添加");
	//添加管理员
	$this->m_adminDb->Add(
		array(
			array(
				"name"=>$post_name,
				"password"=>SHA1($post_pass),
				"type"=>$post_type,
				"phoneNumber"=>$post_phoneNumber,
				"mail"=>$post_mail
			)
		)
	);
	return array();
}
public function DelAdmin($post_adminId){
	//校验数据
	//Util::CheckValid( $post_adminId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//检查是否为超级管理员
	if($this->m_userType != ADMIN_TYPE_SUPER)
		Util::ThrowException(1,"需要超级管理员权限");
	//检查权限
	$admin = $this->m_adminDb->Get(
		array(
			"equal"=>array(
				"adminId"=>$post_adminId
			)
		)
	);
	if( count($admin) == 0 )
		Util::ThrowException(1,"没有该管理员");
	if( $admin[0]["type"] == ADMIN_TYPE_SUPER )
		Util::ThrowException(1,"不能删除超级管理员");
	//删除管理员
	$this->m_adminDb->Del(
		array(
			"equal"=>array(
				"adminId"=>$post_adminId
			)
		)
	);
	return array();
}
public function ModAdmin($post_adminId ,$post_phoneNumber,$post_mail ){
	//校验数据
	//Util::CheckValid( $post_adminId , "integer|1,1000000000");
	//Util::CheckValid( $post_phoneNumber , "digitchar|11,11");
	//Util::CheckValid( $post_mail , "mail");
	//检查登录态
	$this->CheckMustLogin();
	//检查是否为超级管理员
	if($this->m_userType != ADMIN_TYPE_SUPER)
		Util::ThrowException(1,"需要超级管理员权限");
	//修改管理员信息
	$admin = $this->m_adminDb->Mod(
		array(
			"phoneNumber"=>$post_phoneNumber,
			"mail"=>$post_mail
		),
		array(
			"equal"=>array(
				"adminId"=>$post_adminId
			)
		)
	);
	return array();
}
public function GetAdminList($get_name = "",$get_pageFrom = 0 , $get_pageSize = 10){
	//校验数据
	//Util::CheckValid( $get_pageFrom , "integer|0,1000000000");
	//Util::CheckValid( $get_pageSize , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//检查是否为超级管理员
	if($this->m_userType != ADMIN_TYPE_SUPER)
		Util::ThrowException(1,"需要超级管理员权限");
	$where = array();
	if( empty($get_name) == false ){
		//Util::CheckValid( $get_name , "wordchar|1,32");
		$where["like"]["name"] = $get_name;
	}
	$admin = $this->m_adminDb->Get(
		$where,
		$get_pageFrom,
		$get_pageSize
	);
	$adminCount = $this->m_adminDb->Count(
		$where
	);
	global $ADMIN_TYPE_NAME;
	foreach( $admin as $key=>$value ){
		$admin[$key]["typeName"] = $ADMIN_TYPE_NAME[$admin[$key]["type"]];
		$admin[$key]["oper"] = 
			"<a href='#' data='".$value['adminId']."' class='view'>查看</a>|".
			"<a href='#' data='".$value['adminId']."' class='del'>删除</a>";
	}
	return array("data"=>$admin,"count"=>$adminCount[0]['count']);
}
public function GetAdminInfo($get_adminId){
	//校验数据
	//Util::CheckValid( $get_adminId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//检查是否为超级管理员
	if($this->m_userType != ADMIN_TYPE_SUPER)
		Util::ThrowException(1,"需要超级管理员权限");
	$admin = $this->m_adminDb->Get(
		array(
			"equal"=>array(
				"adminId"=>$get_adminId
			)
		)
	);
	if( count($admin) == 0 )
		Util::ThrowException(1,"不存在该金牌代理人");
	$admin = $admin[0];
	//填充名字
	global $ADMIN_TYPE_NAME;
	$admin["typeName"] = $ADMIN_TYPE_NAME[$admin["type"]];
	//填充权限
	$adminPermiss = $this->m_adminPermissDb->Get(
		array(
			"equal"=>array(
				"adminId"=>$get_adminId
			)
		)
	);
	//$admin["permiss"] = $adminPermiss;
	//return array("data"=>$admin);
	return array("data"=>$admin, "permise"=>$adminPermise);
	
}
//管理员权限管理
public function GetAdminPermissList($get_adminId){
	//校验数据
	//Util::CheckValid( $get_adminId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//检查是否为超级管理员
	if($this->m_userType != ADMIN_TYPE_SUPER)
		Util::ThrowException(1,"需要超级管理员权限");
	//添加这个楼盘的权限
	$adminPermiss = $this->m_adminPermissDb->Get(
		array(
			array(
				"adminId"=>$get_adminId
			)
		)
	);
	$adminProjects = array();
	foreach( $adminPermiss as $single ){
		$adminProjects[] = $single['projectId'];
	}
	//获取所有楼盘
	$project = $this->m_projectDb->Get(
	);
	//设置是否有数据
	foreach( $project as $key=>$value ){
		if( in_array($value['projectId'] , $adminProjects))
			$project[$key]['isSelected'] = true;
		else	
			$project[$key]['isSelected'] = false;
	}
	return array("data"=>$project);
}
public function ModAdminPermissList($post_adminId,$post_permissList=array()){
	//校验数据
	//Util::CheckValid( $post_adminId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//检查是否为超级管理员
	if($this->m_userType != ADMIN_TYPE_SUPER)
		Util::ThrowException(1,"需要超级管理员权限");
	//分析权限列表
	$project = $this->m_projectDb->Get();
	$addAdminPermissList = $post_permissList;
	$delAdminPermissList = array();
	foreach( $project as $single ){
		if( in_array($single['projectId'],$addAdminPermissList) == false )
			$delAdminPermissList[] = $single["projectId"];
	}
	//删除这个人原来的权限
	$this->m_adminPermissDb->Del(
		array(
			array(
				"adminId"=>$post_adminId
			)
		)
	);
	//添加权限
	if( count($addAdminPermissList) != 0 ){
		$addSql = array();
		foreach( $addAdminPermissList as $single ){
			$single2 = array();
			$single2['adminId'] = $post_adminId;
			$single2['projectId'] = $single;
			$addSql[] = $single2;
		}
		$this->m_adminPermissDb->Add(
			$addSql
		);
	}
	//删除权限
	if( count($delAdminPermissList) != 0 ){
		$delSql = array();
		$delSql["equal"]['adminId'] = $post_adminId;
		foreach( $delAdminPermissList as $single ){
			$delSql["in"]['projectId'][] = $single;
		}
		$this->m_adminPermissDb->Del(
			$delSql
		);
	}
	return array();
}
//帐号管理
public function DelAccount( $post_userId ){
	//校验数据
	//Util::CheckValid( $post_userId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//删除指定的用户
	$this->m_userDb->Del(
		array(
			"equal"=>array(
				"userId"=>$post_userId
			)
		)
	);
	return array();
}
public function ModAccount( $post_userId , $post_name , $post_phoneNumber ,$post_identityNumber , $post_bankNumber , $post_remark , $post_state){
	//目前只有金牌代理人一个角色
	$post_type = USER_TYPE_MIDDLE_MAN;
	//校验数据
	//Util::CheckValid( $post_userId , "integer|1,1000000000");
	//Util::CheckValid( $post_name , "wordchar|1,32");
	//Util::CheckValid( $post_phoneNumber , "digitchar|11,11");
	//Util::CheckValid( $post_identityNumber , "wordchar|15,18");
	//Util::CheckValid( $post_bankNumber , "wordchar|16,19");
	//Util::CheckValid( $post_remark , "wordchar|1,128");
	//Util::CheckValid( $post_type , "enum|1,2,3");
	//Util::CheckValid( $post_state , "enum|1,2");
	//检查登录态
	$this->CheckMustLogin();
	//校验是否有相同的手机号码
	$user = $this->m_userDb->Get(
		array(
			"equal"=>array(
				"phoneNumber"=>$post_phoneNumber
			),
			"in"=>array(
				"state"=>array(USER_STATE_INVALID,USER_STATE_VALID)
			)
		)
	);
	if( count($user) > 1 )
		Util::ThrowException(1,"已经有重复号码的用户了");
	//获取原来的用户信息
	$user = $this->m_userDb->Get(
		array(
			"equal"=>array(
				"userId"=>$post_userId
			)
		)
	);
	if( count($user) == 0 )
		Util::ThrowException(1,"不存在这样的用户");
	if( $user[0]['state'] == USER_STATE_VALID_FAIL )
		Util::ThrowException(1,"审核未通过的用户不能再修改了");
	if( $user[0]['state'] == USER_STATE_VALID_CANCEL )
		Util::ThrowException(1,"已经注销的用户不能再修改了");
	if( $user[0]['state'] == USER_STATE_VALID &&
		($post_state != USER_STATE_VALID_CANCEL && $post_state != USER_STATE_VALID) )
		Util::ThrowException(1,"审核通过的用户只能进行注销");
	//修改指定的用户
	$this->m_userDb->Mod(
		array(
			"name"=>$post_name,
			"phoneNumber"=>$post_phoneNumber,
			"identityNumber"=>$post_identityNumber,
			"bankNumber"=>$post_bankNumber,
			"remark"=>$post_remark,
			"type"=>$post_type,
			"state"=>$post_state,
		),
		array(
			"equal"=>array(
				"userId"=>$post_userId
			)
		)
	);
	//发送消息
	global $USER_STATE_NAME;
	if( $user[0]["state"] != $post_state ){
		//审核状态发生修改，发送信息
		if( $post_state == USER_STATE_VALID ){
			//审核通过
			$content = sprintf(SMS_VERTIFY_CONTENT,$user[0]['userCode']);
			$this->AddMessage( $post_userId,$content,MESSAGE_TYPE_PRIVATE);
			Util::SendSms($user[0]['phoneNumber'],$content);
		}else if( $post_state == USER_STATE_VALID_FAIL ){
			//审核未通过
			$newUserId = "cancel_".md5(uniqid().mt_rand(1,1000000)).'_'.$user[0]['userId'];
			$this->m_userDb->Mod(
				array(
					"userId"=>$newUserId
				),
				array(
					"equal"=>array("userCode"=>$user[0]['userCode'])
				)
			);
			$content = sprintf(SMS_VERTIFY_FAIL_CONTENT);
			Util::SendSms($user[0]['phoneNumber'],$content);
		}else if( $post_state == USER_STATE_VALID_CANCEL ){
			//注销金牌代理人
			$newUserId = "cancel_".md5(uniqid().mt_rand(1,1000000)).'_'.$user[0]['userId'];
			$this->m_userDb->Mod(
				array(
					"userId"=>$newUserId
				),
				array(
					"equal"=>array("userCode"=>$user[0]['userCode'])
				)
			);
			$content = sprintf(SMS_VERTIFY_CANCEL_CONTENT);
			Util::SendSms($user[0]['phoneNumber'],$content);
		}
	}
	return array();
}
public function GetAccountInfo( $get_userId ){
	//校验数据
	//Util::CheckValid( $get_userId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//获取指定用户的消息
	$data = $this->m_userDb->Get(
		array(
			"equal"=>array(
				"userId"=>$get_userId
			)
		)
	);
	if( count($data) == 0 )
		Util::ThrowException(1,"不存在此用户");
	//获取用户状态描述
	global $USER_STATE_NAME;
	foreach( $data as $key=>$value ){
		$data[$key]["stateName"] = $USER_STATE_NAME[ $data[$key]["state"]];
	}
	return array("data"=>$data[0]);
}
public function GetAccountListExcel( $get_phoneNumber = "" , $get_name = "" , $get_state = "" ){
	$data = $this->GetAccountList($get_phoneNumber,$get_name,$get_state,-1,-1);
	$excelData = $data['data'];
	$excelColumn = array(
		array(
			"id"=>"userCode",
			"name"=>"用户编码",
			"width"=>"25",
		),
		array(
			"id"=>"name",
			"name"=>"用户姓名",
			"width"=>"25",
		),
		array(
			"id"=>"phoneNumber",
			"name"=>"手机号码",
			"width"=>"25",
		),
		array(
			"id"=>"bankNumber",
			"name"=>"银行卡号码",
			"width"=>"25",
		),
		array(
			"id"=>"identityNumber",
			"name"=>"身份证号码",
			"width"=>"25",
		),
		array(
			"id"=>"remark",
			"name"=>"工作单位",
			"width"=>"25",
		),
		array(
			"id"=>"stateName",
			"name"=>"审核状态",
			"width"=>"25",
		),
		array(
			"id"=>"createTime",
			"name"=>"创建时间",
			"width"=>"25",
		),
		array(
			"id"=>"modifyTime",
			"name"=>"修改时间",
			"width"=>"25",
		),
	);
	Util::ExportExcel("用户列表.xls","userList",$excelColumn,$excelData);
	return array();
}
public function GetAccountList( $get_phoneNumber = "" , $get_name = "" ,$get_state = "" ,$get_pageFrom = 0 , $get_pageSize = 10 ){
	//目前只有金牌代理人一个角色
	$get_type = USER_TYPE_MIDDLE_MAN;
	//校验数据
	//Util::CheckValid( $get_pageFrom , "integer|0,1000000000");
	//Util::CheckValid( $get_pageSize , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//构造筛选条件
	$where = array();
	if( empty($get_phoneNumber) == false ){
		//Util::CheckValid( $get_phoneNumber , "digitchar|1,11");
		$where["like"]["phoneNumber"] = $get_phoneNumber;
	}
	if( empty($get_name) == false ){
		//Util::CheckValid( $get_name , "wordchar|1,32");
		$where["like"]["name"] = $get_name;
	}
	if( empty($get_type) == false ){
		//Util::CheckValid( $get_type , "enum|1,2,3");
		$where["equal"]["type"] = $get_type;
	}
	if( empty($get_state) == false ){
		$where["equal"]["state"] = $get_state;
	}
	//获取用户的消息列表
	$data = $this->m_userDb->Get(
		$where,
		$get_pageFrom,
		$get_pageSize,
		array("desc"=>"modifyTime")
	);
	$dataCount = $this->m_userDb->Count(
		$where
	);
	foreach($data as $key=>$val){
		global $USER_TYPE_NAME;
		$data[$key]['oper'] = "<a href='view.html?userId=".$val['userId']."'>编辑</a>";
			//	"<a  href='../customer/index.html?middleManId=".$val['userId']."'>查看客户</a>";
		$data[$key]["typeName"] = $USER_TYPE_NAME[$data[$key]["type"]];
	}
	//获取用户状态描述
	global $USER_STATE_NAME;
	foreach( $data as $key=>$value ){
		$data[$key]["stateName"] = $USER_STATE_NAME[ $data[$key]["state"]];
	}
	return array(
		"data"=>$data,
		"count"=>$dataCount[0]["count"]
	);
}
//订单管理
public function GetDealListExcel( $get_projectName = "", $get_name = "", $get_phoneNumber = "", $get_middleManName ="" ){
	$data = $this->GetDealList($get_projectName,$get_name,$get_phoneNumber,$get_middleManName,-1,-1);
	$excelData = $data['data'];
	$excelColumn = array(
		array(
			"id"=>"dealId",
			"name"=>"客户id",
			"width"=>"25",
		),
		array(
			"id"=>"projectName",
			"name"=>"项目名称",
			"width"=>"25",
		),
		array(
			"id"=>"area",
			"name"=>"预算面积",
			"width"=>"25",
		),
		array(
			"id"=>"budget",
			"name"=>"预算金额",
			"width"=>"25",
		),
		array(
			"id"=>"name",
			"name"=>"客户名称",
			"width"=>"25",
		),
		array(
			"id"=>"phoneNumber",
			"name"=>"客户联系电话",
			"width"=>"25",
		),
		array(
			"id"=>"middleManName",
			"name"=>"金牌代理人",
			"width"=>"25",
		),
		array(
			"id"=>"createTime",
			"name"=>"登记时间",
			"width"=>"25",
		),
		array(
			"id"=>"stateName",
			"name"=>"状态",
			"width"=>"25",
		),
		array(
			"id"=>"stateName2",
			"name"=>"有效性",
			"width"=>"25",
		),
		array(
			"id"=>"modifyTime",
			"name"=>"修改时间",
			"width"=>"25",
		),
	);
	Util::ExportExcel("客户列表.xls","dealList",$excelColumn,$excelData);
	return array();
}
public function GetDealList( $get_projectName = "", $get_name = "", $get_phoneNumber = "", $get_middleManName ="" , $get_pageFrom = 0 , $get_pageSize = 10 ){
	//校验数据
	//Util::CheckValid( $get_pageFrom , "integer|0,1000000000");
	//Util::CheckValid( $get_pageSize , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//构造筛选条件
	$where = array();
	if( !empty($get_middleManName) ){
		//Util::CheckValid( $get_middleManName , "wordchar|1,32");
		$user = $this->m_userDb->Get(
			array(
				"like"=>array(
					"name"=>$get_middleManName
				),
				"equal"=>array(
					"type"=>USER_TYPE_MIDDLE_MAN
				)
			)
		);
		if( count($user) == 0 )
			return array("data"=>array(),"count"=>0);
		foreach( $user as $single ){
			$where["in"]["middleManId"][] = $single["userId"];
		}
	}
	//获取权限列表
	$userPermiss = $this->GetUserPermiss();
	$where["in"]["projectId"] = array();
	if( !empty($get_projectName) ){
		//Util::CheckValid( $get_projectName , "wordchar|1,32");
		$project = $this->m_projectDb->Get(
			array(
				"like"=>array(
					"title"=>$get_projectName
				)
			)
		);
		if( count($project) == 0 )
			return array("data"=>array(),"count"=>0);
		foreach( $project as $single ){
			if( in_array($single['projectId'],$userPermiss) == true )
				$where["in"]["projectId"][] = $single["projectId"];
		}
	}else{
		$where["in"]["projectId"] = $userPermiss;
	}
	if( count($where["in"]['projectId']) == 0 )
		return array("data"=>array(),"count"=>0);
	if( !empty($get_name) ){
		//Util::CheckValid( $get_name , "wordchar|1,32");
		$where["like"]["name"] = $get_name;
	}
	if( !empty($get_phoneNumber) ){
		//Util::CheckValid( $get_phoneNumber , "digitchar|1,11");
		$where["like"]["phoneNumber"] = $get_phoneNumber;
	}
	//按照条件筛选出最终结果
	$deal = $this->m_dealDb->Get(
		$where,
		$get_pageFrom,
		$get_pageSize,
		array("desc"=>"modifyTime")
	);
	$dealCount = $this->m_dealDb->Count(
		$where
	);
	if( count($deal) == 0 ){
		return array(
			"data"=>$deal,
			"count"=>$dealCount[0]["count"]
		);
	}
	//获取订单的金牌代理人的名字
	$userIds = array();
	$projectIds = array();
	foreach( $deal as $single ){
		if( in_array($single["middleManId"],$userIds) == false )
			$userIds[] = $single["middleManId"];
		if( in_array($single["projectId"] , $projectIds ) == false )
			$projectIds[] = $single["projectId"];
	}
	//填充项目的名字
	$project = $this->m_projectDb->Get(
		array(
			"in"=>array(
				"projectId"=>$projectIds
			)
		)
	);
	$temp2 = array();
	foreach( $project as $single )
		$temp2[$single["projectId"]] = $single["title"];
	foreach( $deal as $key=>$single ){
		$deal[$key]["projectName"] = $temp2[$single["projectId"]];
	}
	//填充金牌代理人的名字
	$user = $this->m_userDb->Get(
		array(
			"in"=>array(
				"userId"=>$userIds
			)
		)
	);
	$temp2 = array();
	foreach( $user as $single )
		$temp2[$single["userId"]] = $single["name"];
	foreach( $deal as $key=>$single ){
		$deal[$key]["middleManName"] = $temp2[$single["middleManId"]];
	}
	//填充状态名字
	global $DEAL_STATE_NAME;
	global $DEAL_STATE2_NAME;
	foreach( $deal as $key=>$single ){
		$deal[$key]["stateName"] = $DEAL_STATE_NAME[$deal[$key]["state"]];
		$deal[$key]["stateName2"] = $DEAL_STATE2_NAME[$deal[$key]["state2"]];
		$deal[$key]["oper"] = "<a href='view.html?dealId=".$single['dealId']."'>查看</a>";
	}
	return array(
		"data"=>$deal,
		"count"=>$dealCount[0]["count"]
	);
}
public function GetDealInfo( $get_dealId ){
	//校验数据
	//Util::CheckValid( $get_dealId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//获取订单的信息
	$where = array();
	$where["equal"]["dealId"] = $get_dealId;
	$deal = $this->m_dealDb->Get(
		$where 
	);
	if( count($deal) == 0 )
		Util::ThrowException(1,"不存在此订单");
	$deal = $deal[0];
	$this->CheckMustPermiss($deal['projectId']);
	//获取订单的金牌代理人的名字
	$user = $this->m_userDb->Get(
		array(
			"in"=>array(
				"userId"=>array(
					$deal["middleManId"]
				)
			)
		)
	);
	foreach( $user as $single ){
		if( $single["userId"] == $deal["middleManId"])
			$deal["middleManName"] = $single["name"];
	}
	//填充项目的名字
	$project = $this->m_projectDb->Get(
		array(
			"equal"=>array(
				"projectId"=>$deal["projectId"]
			)
		)
	);
	$deal["projectName"] = $project[0]["title"];
	//填充状态名字
	global $DEAL_STATE_NAME;
	global $DEAL_STATE2_NAME;
	$deal["stateName"] = $DEAL_STATE_NAME[$deal["state"]];
	$deal["stateName2"] = $DEAL_STATE2_NAME[$deal["state2"]];
	//获取状态转移的时间
	$dealState = $this->m_dealStateDb->Get(
		array(
			"equal"=>array(
				"dealId"=>$get_dealId
			)
		)
	);
	foreach( $dealState as $key=>$value ){
		$dealState[$key]["stateName"] = $DEAL_STATE_NAME[$dealState[$key]["state"]];
	}
	$deal['stateInfo'] = $dealState;
	$deal['stateList'] = array_values($DEAL_STATE_NAME);
	return array("data"=>$deal);
}
public function ModDealState( $post_dealId , $post_state , $post_message = "" ){
	//校验数据
	//Util::CheckValid( $post_dealId , "integer|1,1000000000");
	//Util::CheckValid( $post_state , "enum|1,2,3,4,5,6");
	//检查登录态
	$this->CheckMustLogin();
	//校验订单信息
	$deal = $this->m_dealDb->Get(
		array(
			"equal"=>array(
				"dealId"=>$post_dealId
			)
		)
	);
	if( count($deal) == 0 )
		Util::ThrowException(1,"未知的订单，不可更新状态");
	//检查权限
	$this->CheckMustPermiss( $deal[0]['projectId']);
	$deal = $deal[0];
	if( $deal["state"] != $post_state - 1 )
		Util::ThrowException(1,"订单状态发生改变，请重新尝试");
	//按需更新订单状态，部分状态更新会更新订单的其它信息
	if( $post_state == DEAL_STATE_PAYING ){
		Util::CheckValid( "佣金",$post_message , "digitchar|1,6");
		$this->m_dealDb->Mod(
			array(
				"state"=> DEAL_STATE_PAYING,
				"price"=>$post_message
			),
			array(
				"equal"=>array(
					"state"=>DEAL_STATE_PAY_READY,
					"dealId"=>$post_dealId
				)
			)
		);
	}else{
		$this->m_dealDb->Mod(
			array(
				"state"=> $post_state,
			),
			array(
				"equal"=>array(
					"state"=>$post_state - 1,
					"dealId"=>$post_dealId
				)
			)
		);
	}
	//添加更新订单状态的时间
	$this->m_dealStateDb->Add(
		array(
			array(
				"dealId"=>$post_dealId,
				"state"=>$post_state,
				"name"=>$this->m_userName
			)
		)
	);
	//发送消息
	global $DEAL_STATE_NAME;
	$this->AddMessage( $deal["middleManId"],
		"你的订单编号为".$deal["dealId"]."的状态已更新为\"".$DEAL_STATE_NAME[$post_state]."\"请注意订单信息变更。",
		MESSAGE_TYPE_PRIVATE);
	return array();
}
//项目管理
public function AddProject( $post_title , $post_description , $post_stock , $file_pictureUrl , $post_infoUrl){
	//校验数据
	//Util::CheckValid( $post_title , "wordchar|1,256");
	//Util::CheckValid( $post_description , "contentchar|1,512");
	//Util::CheckValid( $post_stock , "integer|0,1000000000");
	//Util::CheckValid( $post_infoUrl , "contentchar|1,128");
	//检查登录态
	$this->CheckMustLogin();
	//添加图片
	$pictureUrl = Util::AddUploadFile($file_pictureUrl,UPLOAD_FILE_TYPE,UPLOAD_FILE_MAX_SIZE,"/Img");
	//添加项目
	$insertId = $this->m_projectDb->Add(
		array(
				array(
				"title"=>$post_title,
				"description"=>$post_description,
				"stock"=>$post_stock,
				"pictureUrl"=>$pictureUrl,
				"infoUrl"=>$post_infoUrl
			)
		)
	);
	//添加权限
	$this->m_adminPermissDb->Add(
		array(
			array(
				"adminId"=>$this->m_userId,
				"projectId"=>$insertId
			)
		)
	);
	//涉及文件上传，懒得做异步上传了。php进行跳转吧
	header("Location: /public/view/project/index.html");
	return array();
}
public function GetProject( $get_projectId ){
	//校验数据
	//Util::CheckValid( $get_projectId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//检查权限
	$this->CheckMustPermiss($get_projectId);
	//获取项目
	$project = $this->m_projectDb->Get(
		array(
			"equal"=>array(
				"projectId"=>$get_projectId
			)
		)
	);
	if( count($project) == 0 )
		Util::ThrowException(1,"不存在此项目");
	return array('data'=>$project[0]);
}
public function DelProject( $post_projectId ){
	//校验数据
	//Util::CheckValid( $post_projectId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//检查权限
	$this->CheckMustPermiss($post_projectId );
	//获取项目
	$project = $this->m_projectDb->Get(
		array(
			"equal"=>array(
				"projectId"=>$post_projectId
			)
		)
	);
	if( count($project) == 0 )
		Util::ThrowException(1,"不存在此项目");
	//删除项目
	$this->m_projectDb->Del(
		array(
			"equal"=>array(
				"projectId"=>$post_projectId
			)
		)
	);
	//删除图片
	Util::DelUploadFile($project[0]["pictureUrl"]);
	return array();
}
public function ModProject( $post_projectId , $post_title , $post_description , $post_stock , $file_pictureUrl ,$post_infoUrl ){
	//设置异常类型
	Util::SetException("HeaderException");
	//校验数据
	//Util::CheckValid( $post_projectId , "integer|1,1000000000");
	//Util::CheckValid( $post_title , "wordchar|1,256");
	//Util::CheckValid( $post_stock , "integer|0,1000000000");
	//Util::CheckValid( $post_description , "contentchar|1,512");
	//Util::CheckValid( $post_infoUrl , "contentchar|1,128");
	//检查登录态
	$this->CheckMustLogin();
	//检查权限
	$this->CheckMustPermiss($post_projectId);
	//获取项目
	$project = $this->m_projectDb->Get(
		array(
			"equal"=>array(
				"projectId"=>$post_projectId
			)
		)
	);
	if( count($project) == 0 )
		Util::ThrowException(1,"不存在此项目");
	//添加与删除图片
	$newPictureUrl = Util::AddUploadFile($file_pictureUrl,UPLOAD_FILE_TYPE,UPLOAD_FILE_MAX_SIZE,"/Img");
	Util::DelUploadFile($project[0]["pictureUrl"]);
	//更新项目
	$this->m_projectDb->Mod(
		array(
			"title"=>$post_title,
			"description"=>$post_description,
			"stock"=>$post_stock,
			"pictureUrl"=>$newPictureUrl,
			"infoUrl"=>$post_infoUrl
		),
		array(
			"equal"=>array(
				"projectId"=>$post_projectId
			)
		)
	);
	//涉及文件上传，懒得做异步上传了。php进行跳转吧
	header("Location: /public/view/project/index.html");
	return array();
}
public function GetProjectList( $get_title = "" , $get_pageFrom = 0 , $get_pageSize = 10 ){
	//校验数据
	//Util::CheckValid( $get_pageFrom , "integer|0,1000000000");
	//Util::CheckValid( $get_pageSize , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	$where = array();
	if( empty($get_title) == false ){
		//Util::CheckValid( $get_title , "wordchar|1,256");
		$where["like"]["title"] = $get_title;
	}
	//获取权限列表
	$userPermiss = $this->GetUserPermiss();
	if(count($userPermiss) == 0 )
		return array("data"=>array(),"count"=>0);
	$where["in"]["projectId"] = $userPermiss;
	//获取项目
	$projectList = $this->m_projectDb->Get(
		$where,
		$get_pageFrom,
		$get_pageSize,
		array("desc"=>"modifyTime")
	);
	$dataCount = $this->m_projectDb->Count(
		$where
	);
	foreach($projectList as $key=>$val){
		$projectList[$key]['pic'] = "<a target='_blank' href='".$val['pictureUrl']."'><img style='height:50px' src='".$val['pictureUrl']."' /></a>";
		$projectList[$key]['oper'] = "<a href='view.html?projectId=".$val['projectId']."'>查看</a>";//|<a href='#' data='".$val['projectId']."' class='del'>删除</a>";
	}
	return array("data"=>$projectList, "count"=>$dataCount[0]['count']);
}
//消息管理
public function AddMessage( $post_userId , $post_message , $post_type ){
	//校验数据
	//Util::CheckValid( $post_userId , "integer|1,1000000000");
	//Util::CheckValid( $post_message , "contentchar|1,512");
	//Util::CheckValid( $post_type , "enum|1,2");
	//检查登录态
	$this->CheckMustLogin();
	//添加消息
	$this->m_messageDb->Add(
		array(
			array(
				"userId"=>$post_userId,
				"message"=>$post_message,
				"type"=>$post_type,
				"state"=>MESSAGE_STATE_NO_READ
			)
		)
	);
	return array();
}
public function DelMessage( $post_messageId ){
	//校验数据
	//Util::CheckValid( $post_messageId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//删除消息
	$this->m_messageDb->Del(
		array(
			"equal"=>array(
				"messageId"=>$post_messageId
			)
		)
	);
	return array();
}
public function GetMessageList( $get_name = "",$get_pageFrom = 0 , $get_pageSize = 10 ){
	//校验数据
	//Util::CheckValid( $get_pageFrom , "integer|0,1000000000");
	//Util::CheckValid( $get_pageSize , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//构造筛选条件
	$where = array();
	if( !empty($get_name) ){
		//Util::CheckValid( $get_name , "wordchar|1,32");
		$user = $this->m_userDb->Get(
			array(
				"like"=>array(
					"name"=>$get_name
				)
			)
		);
		if( count($user) == 0 )
			return array("data"=>array(),"count"=>0);
		foreach( $user as $single ){
			$where["in"]["userId"][] = $single["userId"];
		}
	}
	//获取消息列表
	$message = $this->m_messageDb->Get(
		$where,
		$get_pageFrom,
		$get_pageSize,
		array("desc"=>"modifyTime")
	);
	$messageCount = $this->m_messageDb->Count(
		$where
	);
	//获取消息的类型
	$userIds = array();
	foreach( $message as $key=>$value ){
		if( in_array($value["userId"],$userIds) == false )
			$userIds[] = $value["userId"];
	}
	$user = $this->m_userDb->Get(
		array(
			"in"=>array(
				"userId"=>$userIds
			)
		)
	);
	$temp = array();
	foreach( $user as $single )
		$temp[$single["userId"]] = $single["name"];
	foreach( $message as $key=>$value ){
		$message[$key]["userName"] = $temp[$message[$key]["userId"]];
	}
	//获取消息状态的名字
	global $MESSAGE_TYPE_NAME;
	global $MESSAGE_STATE_NAME;
	foreach( $message as $key=>$value ){
		$message[$key]["stateName"] = $MESSAGE_STATE_NAME[$message[$key]["state"]];
		$message[$key]["typeName"] = $MESSAGE_TYPE_NAME[$message[$key]["type"]];
		$message[$key]["oper"] = '<a href="#" data="'.$value['messageId'].'"class="del">删除</a>';
	}
	return array("data"=>$message,"count"=>$messageCount[0]['count']);
}
//申诉管理
public function GetDealAppealList( $get_state = "" ,  $get_pageFrom = 0 , $get_pageSize = 10 ){
	//校验数据
	//Util::CheckValid( $get_pageFrom , "integer|0,1000000000");
	//Util::CheckValid( $get_pageSize , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//构造筛选条件
	$where = array();
	if( !empty($get_state) ){
		//Util::CheckValid( $get_state , "enum|1,2");
		$where["equal"]["state"] = $get_state;
	}
	$dealAppeal = $this->m_dealAppealDb->Get(
		$where,
		$get_pageFrom,
		$get_pageSize,
		array("desc"=>"modifyTime")
	);
	$dealAppealCount = $this->m_dealAppealDb->Count(
		$where
	);
	global $DEAL_APPEAL_NAME;
	foreach( $dealAppeal as $key =>$value ){
		$dealAppeal[$key]["stateName"] = $DEAL_APPEAL_NAME[$dealAppeal[$key]["state"]];
		$dealAppeal[$key]["oper"] = '<a href="view.html?dealAppealId='.$value['dealAppealId'].'">回复</a>';
	}
	return array("data"=>$dealAppeal,"count"=>$dealAppealCount[0]['count']);
}
public function GetDealAppealInfo( $get_dealAppealId ){
	//校验数据
	//Util::CheckValid( $get_dealAppealId , "integer|1,1000000000");
	//检查登录态
	$this->CheckMustLogin();
	//获取申诉数据
	$dealAppeal = $this->m_dealAppealDb->Get(
		array("equal"=>
			array("dealAppealId"=>$get_dealAppealId)
		)
	);
	if( count($dealAppeal) == 0 )
		Util::ThrowException(1,"不存在这样的申诉");
	$dealAppeal = $dealAppeal[0];
	//获取状态
	global $DEAL_APPEAL_NAME;
	$dealAppeal["stateName"] = $DEAL_APPEAL_NAME[$dealAppeal["state"]];
	//获取订单数据
	$deal = $this->GetDealInfo( $dealAppeal["dealId"]);
	$dealAppeal["deal"] = $deal["data"];
	return array("data"=>$dealAppeal);
}
public function ConfirmDealAppeal( $post_dealAppealId ,  $post_message ){
	//校验数据
	//Util::CheckValid( $post_dealAppealId , "integer|1,1000000000");
	//Util::CheckValid( $post_message , "contentchar|1,512");
	//检查登录态
	$this->CheckMustLogin();
	//获取申诉的数据
	$dealAppeal = $this->m_dealAppealDb->Get(
		array("equal"=>
			array("dealAppealId"=>$post_dealAppealId)
		)
	);
	if( count($dealAppeal) == 0 )
		Util::ThrowException(1,"不存在这样的申诉id");
	$dealAppeal = $dealAppeal[0];
	if( $dealAppeal["state"] != DEAL_APPEAL_STATE_NO_READ )
		Util::ThrowException(1,"这个申诉已经确认过了");
	//检查权限
	$deal = $this->m_dealDb->Get(
		array(
			"equal"=>array(
				"dealId"=>$dealAppeal["dealId"]
			)
		)
	);
	$this->CheckMustPermiss($deal[0]['projectId']);
	//更新申诉状态
	$this->m_dealAppealDb->Mod(
		array(
			"state"=>DEAL_APPEAL_STATE_HAVE_READ,
			"replyMessage"=>$post_message
		),
		array("equal"=>
			array("dealAppealId"=>$post_dealAppealId)
		)
	);
	$deal = $this->m_dealDb->Get(
		array(
			"equal"=>array(
				"dealId"=>$dealAppeal["dealId"]
			)
		)
	);
	$deal = $deal[0];
	//发送消息
	$this->AddMessage( $deal["middleManId"],"你的订单编号为".$deal["dealId"]."的申诉结果为：".$post_message,MESSAGE_TYPE_PRIVATE."。");
	return array();
}
}

?>
