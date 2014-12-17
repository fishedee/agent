<?php
require_once (dirname ( __FILE__ ) . '/../Model/SendDb.php');
require_once (dirname ( __FILE__ ) . '/../Comm/Constant.php');
require_once (dirname ( __FILE__ ) . '/../Comm/Util.php');
// 设置Daemon
set_time_limit ( 0 );
// 设置异常
Util::SetException ( "MyException" );
// 防重入
$cmd = 'ps aux |grep SendSms.php |wc -l';
$isExist = exec ( $cmd );
if ($isExist > 3)
	exit ( 0 );
while ( true ) {
	// 等待1s
	usleep ( 1000 * 1000 * 1 );
	// 拉取未发送的短信
	$sendDb = new SendDb ();
	$sends = $sendDb->Get ( array (
			"equal" => array (
					"state" => SEND_STATE_NOSEND,
					"type" => SEND_TYPE_SMS 
			) 
	) );
	if (count ( $sends ) == 0)
		continue;
		// 发送短信
	$sendResult = array ();
	foreach ( $sends as $single ) {
		try {
			$sms = json_decode ( $single ['data'], TRUE );
			Util::SyncSendSms2 ( $sms ['phoneNumber'], $sms ['content'] );
			$single ['state'] = SEND_STATE_SUCCESS;
		}
		catch ( MyException $e ) {
			$single ['result'] = $e->ErrorMessage ();
			$single ['state'] = SEND_STATE_FAIL;
		}
		$sendResult [] = $single;
	}
	// 设置发送结果
	foreach ( $sendResult as $single ) {
		$sendDb->Mod ( array (
				"state" => $single ['state'],
				"result" => $single ['result'] 
		), array (
				"equal" => array (
						"sendId" => $single ['sendId'] 
				) 
		) );
	}
	// 重置MySql实例
	MySql::DelInstance ();
}
?>
