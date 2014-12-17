<?php
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Model/BaseDb.php');
class UserDb extends BaseDb{
public function __construct(){
	GLOBAL $MYSQL_TABLE_USER_CONSTRAINT;
	parent::__construct(MYSQL_TABLE_USER,$MYSQL_TABLE_USER_CONSTRAINT);

}
}
?>