<?php
require_once(dirname(__FILE__).'/../Comm/Util.php');
require_once(dirname(__FILE__).'/../Model/AdminDb.php');
/*
Util::SendMail(
	array(
			array(
					'mail'=>'306766045@qq.com',
					'name'=>'fish'
				 )
	),
	"早上好",
	"Hello Fish"
);
*/
$m_adminDb = new AdminDb();
$admin = $m_adminDb->Get(
		array(
			"in"=>array(
				"adminId"=>array(1,2)
			),
			"in"=>array(
				"type"=>array(3,4,5,6)
			)
		)
	);
var_dump($admin);
?>
