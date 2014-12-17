<?php
	require_once (dirname ( __FILE__ ) . '/../Comm/Constant.php');
	require_once (dirname ( __FILE__ ) . '/../Model/UserDb.php');
	if (isset ( $_GET ['userId'] ) == false) {
		header ( "Location: /public/h5/fail.html?msg=请重新登录，url参数有误" );
		return;
	}
	$m_userDb = new UserDb ();
	$userId = urlencode ( $_GET ['userId'] );
	$user = $m_userDb->Get ( array (
			"equal" => array (
					"userId" => $userId 
			) 
	) );
	
	// var_dump($user);
	if (count ( $user ) == 0) {
		// 未注册
		echo file_get_contents ( "../public/mobile/reg.html" );
		// header("Location: /public/h5/reg.html?userId=$userId");
		return;
	}
	if ($user [0] ['state'] == USER_STATE_INVALID) {
		// 未审核
		header ( "Location: /public/h5/fail.html?msg=您的用户资料暂时还未审核，请耐心等候审核结果" );
		return;
	}
	if ($user [0] ['state'] != USER_STATE_VALID) {
		// 审核未通过，或已注销
		echo file_get_contents ( "../public/mobile/reg.html" );
		return;
	}
	echo file_get_contents ( "../public/mobile/index.html" );
	/*
	 * header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past header("Last-Modified: " . gmdate("D, d M Y H:i:s") . "GMT"); // always modified header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0"); // HTTP/1.1 header("Cache-Control: post-check=0, pre-check=0", false); header("Pragma: no-cache"); // HTTP/1.0 header("Location: /public/h5/index.html?userId=$userId");
	 */
?>
