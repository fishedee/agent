<?php
require_once(dirname(__FILE__).'/../Model/MySql.php');
require_once(dirname(__FILE__).'/../Comm/Util.php');
$sql = MySql::GetInstance();
$mm = $sql->EasySelect("t_user");
var_dump($mm);
$sql->EasyInsert("t_user",
	array("name","phoneNumber","type","createTime","modifyTime"),
	array(array("fish1","13702347948",0,Util::Now(),Util::Now())));
$sql->EasyInsert("t_user",
	array("name","phoneNumber","type","createTime","modifyTime"),
	array(array("fish2","13702347949",0,Util::Now(),Util::Now())));
$sql->EasyInsert("t_user",
	array("name","phoneNumber","type","createTime","modifyTime"),
	array(array("fish3","13702347950",0,Util::Now(),Util::Now())));
$mm = $sql->EasySelect("t_user");
var_dump($mm);
$sql->EasyDelete("t_user",
	array("equal"=>
		array("name"=>"fish2")
	)
);
$sql->EasyUpdate("t_user",
	array("name"=>"李四"),
	array("in"=>
			array("name"=>array("fish3"))
		)
);
$sql->EasyUpdate("t_user",
	array("name"=>"张三"),
	array("like"=>
			array("name"=>"李")
		)
);
$mm = $sql->EasySelect("t_user");
$mm = $sql->EasySelect("t_user",array(),array(),1,1);
var_dump($mm);
?>