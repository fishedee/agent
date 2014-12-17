<?php
require_once(dirname(__FILE__).'/../Model/BaseDb.php');
class ProjectDb extends BaseDb{
public function __construct(){
	GLOBAL $MYSQL_TABLE_PROJECT_CONSTRAINT;
	parent::__construct(MYSQL_TABLE_PROJECT,$MYSQL_TABLE_PROJECT_CONSTRAINT);
}
}
?>