<?php
require_once(dirname(__FILE__).'/../Comm/Util.php');
require_once(dirname(__FILE__).'/../Model/AdminDb.php');
function test(){
	ob_start();
	$data['columnName'] = array("项目","123");
	$data['columnData'] = array(
		array(1,2),
		array(2,3)
	);
	require_once('MailOutput.php');
	$content = ob_get_contents();
	ob_end_clean();
	Util::SendMail(
		array(
				array(
						'mail'=>'306766045@qq.com',
						'name'=>'fish'
					 )
		),
		"早上好",
		$content
	);
}
test();
?>
