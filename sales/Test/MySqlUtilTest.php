<?php
require_once(dirname(__FILE__).'/../Model/UserDb.php');
try{
$userDb = new UserDb();
$result = $userDb->Get(
	array(
		"in"=>array(
			"userId"=>array()
		)
	)
);
var_dump( $result );
}catch( Exception $e ){
	var_dump( $e);
}
?>
