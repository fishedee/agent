<?php
require_once(dirname(__FILE__).'/../Model/SendDb.php');
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Comm/Util.php');
try{
	//防重入
	$cmd = 'ps aux |grep SendMail.php |wc -l';
	$isExist = exec($cmd);
	if( $isExist > 3 )
		exit(0);
	//拉取未发送的邮件
	$sendDb = new SendDb();
	$sends = $sendDb->Get(
		array(
			"equal"=>array(
				"state"=>"1",
				"type"=>"2"
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
				"type"=>"2"
			)
		)
	);
	foreach( $sends as $single ){
		try{
			$email = json_decode($single['data'],TRUE);
			var_dump($email);
			Util::SendMail( $email['addressList'],$email['subject'],$email['html'],$email['data']);
		}catch( Exception $e ){
		}
	}
}catch( Exception $e ){
}
?>