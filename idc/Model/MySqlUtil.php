<?php
require_once(dirname(__FILE__).'/../Comm/MyException.php');
class MySqlUtil{
public function __construct( $constraint ){
}
private function GenerateWhereSql( $where ){
	$sql = "";
	if( count($where) != 0 ){
		$sql = $sql."where ";
		$isFirst = true;
		foreach( $where as $key=>$value ){
			if( $key == "equal"){
				foreach( $value as $key2=>$value2 ){
					if( $isFirst == false )
						$sql = $sql."and ";
					$sql = $sql.addslashes($key2)." = '".addslashes($value2)."' ";
					$isFirst = false;
				}
			}else if( $key == "like"){
				foreach( $value as $key2=>$value2 ){
					if( $isFirst == false )
						$sql = $sql."and ";
					$sql = $sql.addslashes($key2)." like '%".addslashes($value2)."%' ";
					$isFirst = false;
				}
			}else if( $key == "in"){
				foreach( $value as $key2=>$value2 ){
					if( $isFirst == false )
						$sql = $sql."and ";
					$setSql= "";
					foreach( $value2 as $single ){
						if( empty($setSql) == false )
							$setSql = $setSql.",";
						$setSql = $setSql."'".addslashes($single)."'";
					}
					$sql = $sql.addslashes($key2)." in (".$setSql.") ";
					$isFirst = false;
				}
			}else{
				Util::ThrowException(1,"未知的where操作类型".$key);
			}
		}
	}
	return $sql;
}
private function GenerateLimitSql( $pageFrom , $pageSize ){
	$sql = "";
	if( $pageFrom >= 0 && $pageSize > 0 ){
		$sql = $sql."limit ".$pageFrom.",".$pageSize;
	}
	return $sql;
}
private function GenerateOrderSql( $sortColumn ){
	$sql = "";
	if( count($sortColumn) != 0 ){
		foreach( $sortColumn as $key=>$value ){
			$sql = $sql."order by ".addslashes($value)." ".$key." ";
		}
	}
	return $sql;
}
public function GenerateSelectSql( $table , $type = "data" , $column = array(), $where = array() , $pageFrom = -1, $pageSize = -1,$sortColumn = array()){
	$sql = "select ";
	if( $type == "data" ){
		if( count($column) == 0 ){
			$sql = $sql."* ";
		}else{
			for( $i = 0 ; $i != count($column) ; $i++ ){
				if( $i != 0 )
					$sql = $sql.",";
				$sql = $sql.$column[$i];
			}
		}
	}else if( $type == "count"){
		$sql = $sql."count(*) as count ";
	}else{
		Util::ThrowException(1,"未知的select的type类型".$type);
	}
	$sql = $sql."from ".addslashes($table)." ";
	$sql = $sql.$this->GenerateWhereSql($where);
	$sql = $sql.$this->GenerateOrderSql($sortColumn);
	$sql = $sql.$this->GenerateLimitSql($pageFrom,$pageSize);
	return $sql;
}
public function GenerateUpdateSql( $table , $set  , $where = array()){
	$sql = "update ".addslashes($table)." set ";
	$isFirst = true;
	foreach( $set as $key=>$value ){
		if( $isFirst == false )
			$sql = $sql.", ";
		if( is_null($value) == false )
			$sql = $sql.addslashes($key)." = '".addslashes($value)."' ";
		else
			$sql = $sql.addslashes($key)." = null ";
		$isFirst = false;
	}
	$sql = $sql.$this->GenerateWhereSql($where);
	return $sql;
}
public function GenerateInsertSql( $table , $column , $values ){
	$sql = "insert into ".addslashes($table);
	if( count($column) != 0 ){
		$sql = $sql."(";
		for( $i = 0 ; $i != count($column) ; $i ++ ){
			if( $i != 0 )
				$sql = $sql.",";
			$sql = $sql.addslashes($column[$i]);
		}
		$sql = $sql.")";
	}
	$sql = $sql."values ";
	for( $i = 0 ; $i != count($values) ; $i++ ){
		if( $i != 0 )
			$sql = $sql.",";
		$sql = $sql."(";
		for( $j = 0 ; $j != count($values[$i]) ; $j++ ){
			if($j != 0 )
				$sql = $sql.",";
			$sql = $sql."'".addslashes($values[$i][$j])."' ";
		}
		$sql = $sql.")";
	}
	return $sql;
}
public function GenerateDeleteSql( $table , $where = array() ){
	$sql = "delete from ".addslashes($table)." ";
	$sql = $sql.$this->GenerateWhereSql($where);
	return $sql;
}
}
?>
