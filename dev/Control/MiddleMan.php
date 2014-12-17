<?php
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Comm/MyException.php');
require_once(dirname(__FILE__).'/../Comm/Util.php');
require_once(dirname(__FILE__).'/../Model/AdminPermissDb.php');
require_once(dirname(__FILE__).'/../Model/AdminDb.php');
require_once(dirname(__FILE__).'/../Model/UserDb.php');
require_once(dirname(__FILE__).'/../Model/DealDb.php');
require_once(dirname(__FILE__).'/../Model/DealStateDb.php');
require_once(dirname(__FILE__).'/../Model/DealAppealDb.php');
require_once(dirname(__FILE__).'/../Model/MessageDb.php');
require_once(dirname(__FILE__).'/../Model/ProjectDb.php');
class MiddleMan{
private $m_userDb;
private $m_dealDb;
private $m_dealStateDb;
private $m_dealAppealDb;
private $m_messageDb;
private $m_projectDb;
private $m_userCode;
private $m_userName;
private $m_userPhoneNumber;
private $m_adminDb;
private $m_adminPermissDb;
public function __construct(){
	$this->m_userDb = new UserDb();
	$this->m_dealDb = new DealDb();
	$this->m_dealStateDb = new DealStateDb();
	$this->m_dealAppealDb = new DealAppealDb();
	$this->m_messageDb = new MessageDb();
	$this->m_projectDb = new ProjectDb();
	$this->m_adminDb = new AdminDb();
	$this->m_adminPermissDb = new AdminPermissDb();
}
//获取需要发送邮箱的列表
private function GetDealMailList( $projectId){
	$adminPermiss = $this->m_adminPermissDb->Get(
		array(
			"equal"=>array("projectId"=>$projectId)
		)
	);
	if( count($adminPermiss) ==  0 )
		return array();
	$adminIds = array();
	foreach( $adminPermiss as $single )
		$adminIds[] = $single['adminId'];
	$admin = $this->m_adminDb->Get(
		array(
			"in"=>array(
				"adminId"=>$adminIds,
				"type"=>array(3,4,5,6,7)
			)
		)
	);
	return $admin;
}
//登录态管理
public function CheckMustValidUser( $get_userId ){
	$user = $this->m_userDb->Get(
		array(
			"equal"=>array(
				"userId"=>$get_userId
			)
		)
	);
	if( count($user) == 0 )
		Util::ThrowException(ERR_NO_REGISTER,"用户id未注册");
	if( $user[0]['type'] != USER_TYPE_MIDDLE_MAN)
		Util::ThrowException(ERR_NO_MIDDLE_MAN,"用户不是为金牌代理人用户");
	if( $user[0]['state'] != USER_STATE_VALID )
		Util::ThrowException(ERR_NO_VERTIFY,"用户未经过审核");
	$this->m_userName = $user[0]['name'];
	$this->m_userCode = $user[0]['userCode'];
	$this->m_userPhoneNumber = $user[0]['phoneNumber'];
	return array();
}
//订单管理
public function GetDealList($get_userId , $get_dealId = "" , $get_projectId = "" , $get_state = "" , $get_phoneNumber = "", $get_pageFrom = 0 , $get_pageSize = 10){
	//校验参数
	//Util::CheckValid( $get_userId , "integer|1,1000000000");
	//检查用户状态
	$this->CheckMustValidUser($get_userId);
	//构造筛选条件
	$where = array();
	if( empty( $get_dealId ) == false ){
		//Util::CheckValid( $get_dealId , "integer|1,1000000000");
		$where["equal"]["dealId"] = $get_dealId;
	}
	if( empty( $get_projectId ) == false ){
		//Util::CheckValid( $get_projectId , "integer|1,1000000000");
		$where["equal"]["projectId"] = $get_projectId;
	}
	if( empty( $get_type ) == false ){
		//Util::CheckValid( $get_type , "enum|1,2,3,4,5,6");
		$where["equal"]["state"] = $get_type;
	}
	if( empty( $get_phoneNumber ) == false ){
		//Util::CheckValid( $get_phoneNumber , "digitchar|1,11");
		$where["like"]["phoneNumber"] = $get_phoneNumber;
	}
	$where["equal"]["middleManId"] = $get_userId;
	//获取订单信息
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

public function GetDealInfo( $get_userId,$get_dealId ){
	//校验参数
	//Util::CheckValid( $get_userId , "integer|1,1000000000");
	//Util::CheckValid( $get_dealId , "integer|1,1000000000");
	//检查用户状态
	$this->CheckMustValidUser($get_userId);
	//获取订单的信息
	$deal = $this->m_dealDb->Get(
		array(
			"equal"=>array(
				"dealId"=>$get_dealId
			)
		)
	);
	if( count($deal) == 0 )
		return $deal;
	$deal = $deal[0];
	//校验金牌代理人的身份
	if( $deal["middleManId"] != $get_userId )
		Util::ThrowException(1,"只能查看金牌代理人自己的订单信息");
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
		if( $single["userId"] == $deal["middleManId"]){
			$deal["middleManName"] = $single["name"];
			$deal["middleManPhoneNumber"] = $single["phoneNumber"];
		}
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
public function AddDealRequest($get_userId){
	//检查用户状态
	$this->CheckMustValidUser($get_userId);
	//预算与面积的枚举值
	global $DEAL_BUDGET_LIST;
	global $DEAL_AREA_LIST;
	$result = array(
		"budgetList"=>$DEAL_BUDGET_LIST,
		"areaList"=>$DEAL_AREA_LIST
	);
	//校验是否满足一天只能申请两次的限制
	$deal = $this->m_dealDb->Get(
		array(
			"equal"=>array(
				"middleManId"=>$get_userId
			)
		),
		0,
		DEAL_LIMIT_ONE_DAY,
		array(
			"desc"=>"createTime"
		)
	);
	$todayDealCount = 0;
	foreach( $deal as $single ){
		$createTime = strtotime($single['createTime']);
		$createTimeDate = date('Y-m-d',$createTime);
		$nowTimeDate = date('Y-m-d',time());
		if( $createTimeDate == $nowTimeDate )
			$todayDealCount++;
	}
	if( $todayDealCount >= DEAL_LIMIT_ONE_DAY )
		Util::ThrowException(ERR_NO_TWO_CLIENT_ONE_DAY,"每天只能申请两次预订");
	return array("data"=>$result);
}
public function AddDeal( $post_userId,$post_projectId, $post_name ,$post_phoneNumber,$post_area,$post_budget){
	//校验参数
	Util::CheckValid( "客户手机号码",$post_phoneNumber , "digitchar|11,11");
	//Util::CheckValid( $post_projectId , "integer|1,1000000000");
	//Util::CheckValid( $post_area , "integer|1,1000000000");
	//Util::CheckValid( $post_budget , "integer|1,1000000000");
	//Util::CheckValid( $post_name , "wordchar|1,32");
	//Util::CheckValid( $post_phoneNumber , "wordchar|11,11");
	//检查用户状态
	$this->CheckMustValidUser($post_userId);
	//校验有足够库存
	$project = $this->m_projectDb->Get(
		array(
			"equal"=>array(
				"projectId"=>$post_projectId
			)
		)
	);
	if( count($project) == 0 )
		Util::ThrowException(1,"不存在这样的楼盘");
	if( $project[0]['stock'] == 0 )
		Util::ThrowException(1,"楼盘库存为空，不能再申请预订了");
	//校验是否满足一天只能申请两次的限制
	$deal = $this->m_dealDb->Get(
		array(
			"equal"=>array(
				"middleManId"=>$post_userId
			)
		),
		0,
		DEAL_LIMIT_ONE_DAY,
		array(
			"desc"=>"createTime"
		)
	);
	$todayDealCount = 0;
	foreach( $deal as $single ){
		$createTime = strtotime($single['createTime']);
		$createTimeDate = date('Y-m-d',$createTime);
		$nowTimeDate = date('Y-m-d',time());
		if( $createTimeDate == $nowTimeDate )
			$todayDealCount++;
	}
	if( $todayDealCount >= DEAL_LIMIT_ONE_DAY )
		Util::ThrowException(ERR_NO_TWO_CLIENT_ONE_DAY,"每天只能申请两次预订");
	//发送短信给客户
	$content = sprintf(SMS_DEAL_CONTENT,$this->m_userCode ,$project[0]['title'],$this->m_userPhoneNumber);
	Util::SendSms($post_phoneNumber,$content);
	//扣减楼盘库存
	$this->m_projectDb->Mod(
		array(
			'stock'=>$project[0]['stock'] - 1
		),
		array(
			"equal"=>array(
				"projectId"=>$post_projectId,
				'stock'=>$project[0]['stock']
			)
		)
	);
	//添加订单
	$dealId = $this->m_dealDb->Add(
		array(
			array(
				"projectId"=>$post_projectId,
				"name"=>$post_name,
				"phoneNumber"=>$post_phoneNumber,
				"middleManId"=>$post_userId,
				"area"=>$post_area,
				"budget"=>$post_budget,
				"state"=>DEAL_STATE_HAVE_REPORT,
				"state2"=>DEAL_STATE2_VALID,
				"price"=>0,
			)
		)
	);
	//添加订单状态
	$this->m_dealStateDb->Add(
		array(
			array(
				"dealId"=>$dealId,
				"name"=>$this->m_userName,
				"state"=>DEAL_STATE_HAVE_REPORT,
			)
		)
	);
	//发送邮件给相关负责人
	$mailList = $this->GetDealMailList($post_projectId); 
	$content = array( 
		"userCode"=>$this->m_userCode,
		"userPhoneNumber"=>$this->m_userPhoneNumber,
		"projectName"=>$project[0]['title'],
		"name"=>$post_name,
		"phoneNumber"=>$post_phoneNumber,
		"area"=>$post_area,
		"budget"=>$post_budget
	);
	$mailBody = Util::GetPageContent(MAIL_DEAL_CONTENT,$content);
	Util::SendMail($mailList,MAIL_USER_TITLE,$mailBody);
	return array();
}
//成就管理
public function GetDealAchievement($get_userId){
	//校验参数
	//Util::CheckValid( $get_userId , "integer|1,1000000000");
	//检查用户状态
	$this->CheckMustValidUser($get_userId);
	//获取其所有订单
	$deal = $this->m_dealDb->Get(
		array(
			"equal"=>array(
				"middleManId"=>$get_userId,
			)
		)
	);
	//统计业绩
	$result = array();
	$result["ClientHaveReport"] = 0;
	$result["ClientHaveLook"] = 0;
	$result["ClientHavePledge"] = 0;
	$result["ClientHaveDeal"] = 0;
	$result["ClientPayReady"] = 0;
	$result["ClientPaying"] = 0;
	$result["ClientHavePay"] = 0;
	$result["RequestPay"] = 0;
	$result["HavePay"] = 0;
	foreach( $deal as $single ){
		if( $single["state"] >= 1 )
			$result["ClientHaveReport"]++;
		if( $single["state"] >= 2 )
			$result["ClientHaveLook"]++;
		if( $single["state"] >= 3 )
			$result["ClientHavePledge"]++;
		if( $single["state"] >= 4 )
			$result["ClientHaveDeal"]++;
		if( $single["state"] >= 5 )
			$result["ClientPayReady"]++;
		if( $single["state"] >= 6 )
			$result["ClientPaying"]++;
		if( $single["state"] >= 7 )
			$result["ClientHavePay"]++;
		if( $single["state"] == 6 )
			$result["RequestPay"] += $single["price"];
		if( $single["state"] == 7 )
			$result["HavePay"] += $single["price"];
	}
	global $DEAL_STATE_NAME;
	$result['stateList'] = array_values($DEAL_STATE_NAME);
	return array("data"=>$result);
	
}
//申诉管理
public function AddDealAppeal( $post_userId,$post_dealId , $post_message ){
	//校验参数
	//Util::CheckValid( $post_userId , "integer|1,1000000000");
	//Util::CheckValid( $post_dealId , "integer|1,1000000000");
	//Util::CheckValid( $post_message , "contentchar|1,512");
	//检查用户状态
	$this->CheckMustValidUser($post_userId);
	//获取订单的信息
	$deal = $this->m_dealDb->Get(
		array(
			"equal"=>array(
				"dealId"=>$post_dealId
			)
		)
	);
	if( count($deal) == 0 )
		Util::ThrowException(1,"不存在这样的订单");
	$deal = $deal[0];
	if( $deal["middleManId"] != $post_userId )
		Util::ThrowException(1,"只能申诉属于自己的订单");
	//申诉订单
	$this->m_dealAppealDb->Add(
		array(
			array(
				"dealId"=>$post_dealId,
				"message"=>$post_message,
				"replyMessage"=>"",
				"state"=>DEAL_APPEAL_STATE_NO_READ
			)
		)
	);
	//反馈给用户已申诉
	$this->m_messageDb->Add(
		array(
			array(
				"userId"=>$post_userId,
				"message"=>"订单编号为".$post_dealId."的申诉已受理，请稍候注意查看消息，以便知悉申诉受理结果",
				"type"=>MESSAGE_TYPE_PRIVATE,
				"state"=>MESSAGE_STATE_NO_READ,
			)
		)
	);
	return array();
}
//消息管理
public function GetMessageList($get_userId , $get_type , $get_pageFrom = 0 , $get_pageSize = 10){
	//校验参数
	//Util::CheckValid( $get_userId , "integer|1,1000000000");
	//Util::CheckValid( $get_type , "enum|1,2");
	//检查用户状态
	$this->CheckMustValidUser($get_userId);
	$where = array(
		"equal"=>array(
			"userId"=>$get_userId,
			"type"=>$get_type
		)
	);
	//获取其所有消息
	$messages = $this->m_messageDb->Get(
		$where,
		$get_pageFrom,
		$get_pageSize,
		array("desc"=>"modifyTime")
	);
	$dataCount = $this->m_messageDb->Count(
		$where
	);

	return array('data'=>$messages, 'count'=>$dataCount[0]['count']);
}
public function ConfirmMessage( $post_userId , $post_messageId ){
	//校验参数
	//Util::CheckValid( $post_userId , "integer|1,1000000000");
	//Util::CheckValid( $post_messageId , "integer|1,1000000000");
	//检查用户状态
	$this->CheckMustValidUser($post_userId);
	//获取消息
	$message = $this->m_messageDb->Get(
		array(
			"equal"=>array(
				"messageId"=>$post_messageId,
			)
		)
	);
	if( count($message) == 0 )
		Util::ThrowException(1,"不存在这样的消息,无法确认");
	$message = $message[0];
	if( $message["userId"] != $post_userId )
		Util::ThrowException(1,"只能确认金牌代理人自己的消息");
	if( $message["state"] != MESSAGE_STATE_NO_READ)
		Util::ThrowException(1,"消息已经确认过了，不要重复确认");
	//更新消息状态
	$this->m_messageDb->Mod(
		array(
			"state"=>MESSAGE_STATE_HAVE_READ
		),
		array(
			"equal"=>array(
				"messageId"=>$post_messageId,
				"state"=>MESSAGE_STATE_NO_READ
			)
		)
	);
	return array();
}
//项目管理
public function GetProjectList($get_userId,$get_pageFrom = 0 , $get_pageSize = 10){
	//校验参数
	//Util::CheckValid( $get_userId , "integer|1,1000000000");
	//检查用户状态
	$this->CheckMustValidUser($get_userId);
	$projects = $this->m_projectDb->Get(
		array(),
		$get_pageFrom,
		$get_pageSize,
		array("desc"=>"modifyTime")
	);
	$dataCount = $this->m_projectDb->Count(
		array()
	);
	return array('data'=>$projects, 'count'=>$dataCount[0]['count']);
}

}
?>
