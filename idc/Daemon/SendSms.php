<?php
require_once(dirname(__FILE__).'/../Model/SendDb.php');
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Comm/Util.php');
try{
	//防重入
	$cmd = 'ps aux |grep SendSms.php |wc -l';
	$isExist = exec($cmd);
	if( $isExist > 3 )
		exit(0);
	//拉取未发送的短信
	$sendDb = new SendDb();
	$sends = $sendDb->Get(
		array(
			"equal"=>array(
				"state"=>"1",
				"type"=>"1"
			)
		)
	);
	if( count($sends) == 0 )
		return;
	//设置为已发送
	$sendDb->Mod(
		array(
			"state"=>"2"
		),
		array(
			"equal"=>array(
				"state"=>"1",
				"type"=>"1"
			)
		)
	);
	foreach( $sends as $single ){
		try{
			$sms = json_decode($single['data'],TRUE);
			Util::SendSms( $sms['phoneNumber'],$sms['content']);
		}catch( Exception $e ){
		}
	}
}catch( Exception $e ){
}
?>