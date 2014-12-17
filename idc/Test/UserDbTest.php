<?php
require_once(dirname(__FILE__).'/../Model/UserDb.php');
try{
	$user = new UserDb();
	$temp = $user->Get();
	var_dump( $temp );
	$user->Add(
		array(
			array(
				"name"=>"fish1",
				"phoneNumber"=>"23702347948",
				"type"=>1
			),
			array(
				"name"=>"fish2",
				"phoneNumber"=>"23702347950",
				"type"=>1
			),
			array(
				"name"=>"fish3",
				"phoneNumber"=>"23702347951",
				"type"=>1
			)
		)
	);
	$temp = $user->Get();
	var_dump( $temp );
	$temp = $user->Del(
		array("equal"=>
			array("name"=>"fish2")
		)
	);
	$temp = $user->Mod(
		array("name"=>"黎锦伟"),
		array("equal"=>
			array("name"=>"fish3")
		)
	);
	$temp = $user->Mod(
		array("name"=>"张三"),
		array("like"=>
			array("name"=>"黎")
		)
	);
	$temp = $user->Get();
	var_dump( $temp );
	$temp = $user->Count();
	var_dump( $temp );
}catch( Exception $e ){
	var_dump($e);
}
?>