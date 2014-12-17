<?php
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Model/BaseDb.php');
class AdminDb extends BaseDb{
public function __construct(){
	GLOBAL $MYSQL_TABLE_ADMIN_CONSTRAINT;
	parent::__construct(MYSQL_TABLE_ADMIN,$MYSQL_TABLE_ADMIN_CONSTRAINT);
}
}
?>