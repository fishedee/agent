<?php
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Model/MySql.php');
require_once(dirname(__FILE__).'/../Model/MySqlUtil.php');
require_once(dirname(__FILE__).'/../Comm/Util.php');
class BaseDb{
private $m_tableName;
private $m_mysqlUtil;
public function __construct( $tableName , $tableConstraint ){
	$this->m_tableName = $tableName;
	$this->m_mysqlUtil = new MySqlUtil($tableConstraint);
}
public function Count( $where = array() ){
	$sql = $this->m_mysqlUtil->GenerateSelectSql(
		$this->m_tableName,
		"count",
		array(),
		$where,
		-1,
		-1
	);
	return MySql::GetInstance()->Query(
		$sql
	);
}
public function Get( $where = array() ,$pageFrom = -1 , $pageSize = -1 ,$sortColumn = array() ){
	$sql = $this->m_mysqlUtil->GenerateSelectSql(
		$this->m_tableName,
		"data",
		array(),
		$where,
		$pageFrom,
		$pageSize,
		$sortColumn
	);
	return MySql::GetInstance()->Query(
		$sql
	);
}
public function Add( $data ){
	if( count($data) == 0 )
		return;
	$column = array_keys($data[0]);
	$column[] = "createTime";
	$column[] = "modifyTime";
	$values = array();
	foreach( $data as $single ){
		$single = array_values($single);
		$single[] = Util::Now();
		$single[] = Util::Now();
		$values[] = $single;
	}
	$sql = $this->m_mysqlUtil->GenerateInsertSql(
		$this->m_tableName,
		$column,
		$values
	);
	MySql::GetInstance()->Update(
		$sql
	);
	return MySql::GetInstance()->GetLastInsertId();
}
public function Del( $where ){
	$sql = $this->m_mysqlUtil->GenerateDeleteSql(
		$this->m_tableName,
		$where
	);
	MySql::GetInstance()->Update(
		$sql
	);
	return MySql::GetInstance()->GetAffectedRows();
}
public function Mod( $data , $where ){
	$data["modifyTime"] = Util::Now();
	$sql = $this->m_mysqlUtil->GenerateUpdateSql(
		$this->m_tableName,
		$data,
		$where
	);
	MySql::GetInstance()->Update(
		$sql
	);
	return MySql::GetInstance()->GetAffectedRows();
}

}
?>