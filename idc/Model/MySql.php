<?php
require_once(dirname(__FILE__).'/../Comm/Constant.php');
require_once(dirname(__FILE__).'/../Comm/MyException.php');
class MySql{
//单例模式
private static $ms_mysql;
public static function GetInstance(){
	if( MySql::$ms_mysql == null ){
		MySql::$ms_mysql = new Mysql(
			MYSQL_ADDRESS,
			MYSQL_PORT,
			MYSQL_USER,
			MYSQL_PASS,
			MYSQL_DB
		);
	}
	return MySql::$ms_mysql;
}
//mysql的基础操作
private $m_mysql;
public function MySql( $ip , $port , $user , $pass ,$db ){
	$this->m_mysql = mysqli_connect($ip,$user,$pass,$db);
	if( $this->m_mysql == false )
		Util::ThrowException(1,"mysql连接失败,请检查数据库网络状况".mysqli_error($this->m_mysql));
	$result = mysqli_set_charset ( $this->m_mysql , "utf8" );
	if( $result == false )
		Util::ThrowException(1,"mysql设置字符编码失败".mysqli_error($this->m_mysql));
}
public function Query( $sql ){
	$result = mysqli_query( $this->m_mysql,$sql);
	if( $result == false )
		Util::ThrowException(1,"mysql执行query失败,请检查数据库网络状况".mysqli_error($this->m_mysql));
	$resultSet = array();
	while($rows = mysqli_fetch_array($result,MYSQLI_ASSOC)){
        $resultSet[] = $rows;
	}
	mysqli_free_result( $result );
	return $resultSet;
}
public function Update( $sql ){
	$result = mysqli_query($this->m_mysql,$sql);
	if( $result == false )
		Util::ThrowException(1,"mysql执行update失败,请检查数据库网络状况".mysqli_error($this->m_mysql));
}
public function BeginTransit(){
	$this->Update("BEGIN");
	$this->Update("SET AUTOCOMMIT=0");
}
public function EndCommit(){
	$this->Update("COMMIT");
	$this->Update("SET AUTOCOMMIT=1");
}
public function EndRollBack(){
	$this->Update("ROLLBACK");
	$this->Update("SET AUTOCOMMIT=1");
}
public function GetLastInsertId(){
	$result = mysqli_insert_id ($this->m_mysql);
//	if( $result == false )
//		Util::ThrowException(1,"mysql 执行获取insert_id失败,请检查数据库网络状况".mysqli_error($this->m_mysql));
	return $result;
}
public function GetAffectedRows(){
	return mysqli_affected_rows($this->m_mysql);
}

}
?>
