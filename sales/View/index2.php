<?php
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Model/UserDb.php');
if( isset($_GET['userId']) == false ){
	header("Location: /public/h5_2/fail.html?msg=请重新登录，url参数有误");
	return;
}
$m_userDb = new UserDb();
$userId = urlencode($_GET['userId']);
$user = $m_userDb->Get(
	array(
		"equal"=>array(
			"userId"=>$userId
		)
	)
);
var_dump($user);
if( count($user) == 0 ){
	//未注册
	header("Location: /public/h5_2/reg.html?userId=$userId");
	return;
}
if( $user[0]['state'] == USER_STATE_INVALID ){
	//未审核
	header("Location: /public/h5_2/fail.html?msg=您的用户资料暂时还未审核，请耐心等候审核结果");
	return;
}
if( $user[0]['state'] != USER_STATE_VALID ){
	//审核未通过，或已注销
	header("Location: /public/h5_2/fail.html?msg=你的用户资料审核未通过或已注销");
	return;
}
header("Location: /public/h5_2/index.html?userId=$userId");
?>
