<?php
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Model/BaseDb.php');
class DealStateDb extends BaseDb{
public function __construct(){
	GLOBAL $MYSQL_TABLE_DEAL_STATE_CONSTRAINT;
	parent::__construct(MYSQL_TABLE_DEAL_STATE,$MYSQL_TABLE_DEAL_STATE_CONSTRAINT);
}
}
?>