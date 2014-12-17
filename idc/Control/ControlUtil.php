<?php
require_once(dirname(__FILE__).'/../Comm/MyException.php');
class ControlUtil{
private $m_control;
private $m_controlInfo;
public function __construct( $className ){
	if( class_exists($className) == false )
		Util::ThrowException(1,"不存在这样的Controller对应的类,Controller名字为：".$className);
	$this->m_control = new $className();
	$this->m_controlInfo = $this->getClassInfo( $className );
}
private function getClassInfo($classname){
	$reflection = new ReflectionClass($classname); 
	$methods = array();
	foreach($reflection->getMethods() as $param){
		$methodName = $param->name;
		$methodArgv = array();
		$methodArgvDefaultValue = array();
		$args = array();
		foreach ($param->getParameters() as $single) {
			$methodArgv[] = $single->getName();
			if ($single->isOptional()) {
				$methodArgvDefaultValue[$single->getName()] = $single->getDefaultValue();
			}
		}
		$methods[$methodName]["argv"] = $methodArgv;
		$methods[$methodName]["argvDefault"] = $methodArgvDefaultValue;
	}
	return $methods;
}	
public function Run($methodName){
	//XSS过滤
	$_GET = Util::XSSFilt($_GET);
	$_POST = Util::XSSFilt($_POST);
	//整合出指定的方法
	if( !array_key_exists($methodName,$this->m_controlInfo) )
		Util::ThrowException(1,"不存在这样的方法".$methodName);
	$goMethod = array();
	$goMethod[] = $this->m_control;
	$goMethod[] = $methodName;
	//整合出指定的参数
	$goArgv = array();
	$methodInfo = $this->m_controlInfo[$methodName];
	foreach( $methodInfo["argv"] as $single ){
		if( strncmp($single,"get_",strlen("get_")) == 0 ){
			$argvName = substr( $single , strlen("get_"));
			$argvSource = $_GET;
		}else if( strncmp($single,"post_",strlen("post_")) == 0 ){
			$argvName = substr( $single , strlen("post_"));
			$argvSource = $_POST;
		}else if( strncmp($single,"file_",strlen("file_")) == 0 ){
			$argvName = substr( $single , strlen("file_"));
			$argvSource = $_FILES;
		}else if( strncmp($single,"request_",strlen("request_")) == 0 ){
			$argvName = substr( $single , strlen("request_"));
			$argvSource = $_REQUEST;
		}else{
			Util::ThrowException(1,"未知参数类型".$single);
		}
		if( array_key_exists($argvName,$argvSource) == false ){
			if( array_key_exists( $single , $methodInfo["argvDefault"] ) == false )
				Util::ThrowException(1,"缺少cgi参数".$argvName);
			$value = ($methodInfo["argvDefault"][$single]);
		}else{
			$value = ($argvSource[$argvName]);
		}
		$goArgv[] = $value;
	}
	return call_user_func_array( $goMethod,$goArgv );
}
}
?>
