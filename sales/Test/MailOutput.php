<?php
require_once(dirname(__FILE__).'/../Model/MessageDb.php');
$messageDb = new MessageDb();
for( $i = 0 ; $i != 1000 ; $i++ ){
	$messageDb->Add(
		array(
			array(
				"userId"=>10001,
				"message"=>"测试用",
				"state"=>1,
				"type"=>1
			)
		)
	);
}
?>