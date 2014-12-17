<?php
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Comm/MyException.php');
require_once(dirname(__FILE__).'/../Model/UserDb.php');
require_once(dirname(__FILE__).'/../Model/AdminDb.php');
require_once(dirname(__FILE__).'/../Model/RegisterDb.php');
class Man{
private $m_userDb;
private $m_adminDb;
private $m_registerDb;
public function __construct(){
	$this->m_userDb = new UserDb();
	$this->m_adminDb = new AdminDb();
	$this->m_registerDb = new RegisterDb();
}
public function RegisterRequest($post_userId , $post_phoneNumber){
	//校验参数
	Util::CheckValid( $post_phoneNumber , "digitchar|11,11");
	//检查是否有相同的用户
	$user = $this->m_userDb->Get(
		array(
			"equal"=>array(
				"userId"=>$post_userId
			)
		)
	);
	if( count($user) != 0 )
		Util::ThrowException(1,"这个微信Id已经被注册过了");
	//检查是否有冲突的用户
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
	if( count($user) != 0 )
		Util::ThrowException(1,"这个手机号码已经被注册过了");
	//检查注册请求是否太频繁
	$register = $this->m_registerDb->Get(
		array(
			array(
				"userId"=>$post_userId
			)
		),
		0,
		1,
		array("desc"=>"createTime")
	);
	if( count($register) != 0 ){
		$createTime = strtotime($register[0]['createTime']);
		if( time() - $createTime < CHECKNUMBER_LIMITTIME )
			Util::ThrowException(1,"您注册太频繁了，请稍后重试");
	}
	//生成手机校验码
	$chars = "0123456789";
	$charsLength = strlen($chars);
	$checkNumber = "";
	for( $i = 0 ; $i != CHECKNUMBER_LENGTH ; $i ++ )
		$checkNumber = $checkNumber.substr($chars,mt_rand()%$charsLength,1);
	//添加注册请求
	$registerId = $this->m_registerDb->Add(
		array(
			array(
				"userId"=>$post_userId,
				"phoneNumber"=>$post_phoneNumber,
				"checkNumber"=>$checkNumber
			)
		)
	);
	//发送短信验证码
	$content = sprintf(SMS_VALID_CONTENT,$checkNumber);
	Util::SendSms($post_phoneNumber,$content);
	return array("registerId"=>$registerId);
}
public function RegisterUser( $post_userId,$post_name , $post_phoneNumber, $post_identityNumber , $post_identityUrl ,  $post_remark ,$post_registerId ,$post_checkNumber ){
	//目前只有金牌代理人一个角色
	$post_type = USER_TYPE_MIDDLE_MAN;
	//设置异常类型
	Util::SetException("HeaderException");
	//校验参数
	Util::CheckValid( $post_phoneNumber , "digitchar|11,11");
	Util::CheckValid( $post_identityNumber , "digitchar|15,18");
	//验证用户短信
	$register = $this->m_registerDb->Get(
		array(
			"equal"=>array(
				"registerId"=>$post_registerId
			)
		)
	);
	if( count($register) == 0 )
		Util::ThrowException(1,"没有此验证id");
	$register = $register[0];
	if( strtotime($register["createTime"]) + CHECKNUMBER_EXPIRETIME <  time())
		Util::ThrowException(1,"校验码已经过期，请重新输入");
	if( $register["checkNumber"] != $post_checkNumber )
		Util::ThrowException(1,"验证码不正确");
	if( $register["phoneNumber"] != $post_phoneNumber )
		Util::ThrowException(1,"验证时的手机号码与注册时的手机号码不一致");
	if( $register["userId"] != $post_userId )
		Util::ThrowException(1,"验证时的用户id与注册时的用户id不一致");
	//检查是否有相同的用户
	$user = $this->m_userDb->Get(
		array(
			"equal"=>array(
				"userId"=>$post_userId
			)
		)
	);
	if( count($user) != 0 )
		Util::ThrowException(1,"这个微信Id已经被注册过了");
	//校验是否有冲突的手机号码
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
	if( count($user) != 0 )
		Util::ThrowException(1,"这个手机号码已经被注册过了");
	//校验图片
	Util::CheckUploadFile($post_identityUrl);
	//添加用户
	$this->m_userDb->Add(
		array(
			array(
				"userId"=>$post_userId,
				"name"=>$post_name,
				"phoneNumber"=>$post_phoneNumber,
				"identityNumber"=>$post_identityNumber,
				"identityUrl"=>$post_identityUrl,
				"bankNumber"=>$post_bankNumber,
				"remark"=>$post_remark,
				"type"=>$post_type,
				"state"=>USER_STATE_INVALID,
			)
		)
	);
	//涉及文件上传，懒得做异步上传了。php进行跳转吧
	header("Location: /public/h5/fail.html?msg=注册已成功, 待审核通过后发放代理人代码.");
	//发送短信表明注册成功
	Util::SendSms($post_phoneNumber,SMS_REGISTER_CONTENT);
	return array();
}
public function UploadImage($file_imageUrl){
	$newImageFileUrl = Util::AddUploadFile($file_imageUrl,UPLOAD_FILE_TYPE,UPLOAD_FILE_MAX_SIZE,"/Img");
	return array("data"=>$newImageFileUrl);
}

}

?>
