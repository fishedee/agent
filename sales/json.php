<?php
require_once (dirname ( __FILE__ ) . '/Comm/MyException.php');
require_once (dirname ( __FILE__ ) . '/Comm/HeaderException.php');
require_once (dirname ( __FILE__ ) . '/Comm/ExitException.php');
require_once (dirname ( __FILE__ ) . '/Comm/Util.php');
require_once (dirname ( __FILE__ ) . '/Control/ControlUtil.php');

header ( 'Content-type:text/json' );
Util::SetException ( "MyException" );
try {
	$url = $_SERVER ["REQUEST_URI"];
	if (strrpos ( $url, "?" ) != false)
		$url = substr ( $url, 0, strrpos ( $url, "?" ) );
	$vecUrl = explode ( "/", $url );
	if (count ( $vecUrl ) != 4)
		Util::ThrowException ( 1, "请输入两个伪地址" );
	$myClass = $vecUrl [2];
	$myClassPath = dirname ( __FILE__ ) . '/Control/' . $myClass . '.php';
	if (file_exists ( $myClassPath ) == false)
		Util::ThrowException ( 1, "找不到类路径" . $myClassPath );
	require_once ($myClassPath);
	$myMethod = $vecUrl [3];
	$object = new ControlUtil ( $myClass );
	$result = $object->Run ( $myMethod );
	$result ["retCode"] = 0;
	$result ["retMessage"] = "";
	$result ["name"] = $_SESSION ["name"];
	echo json_encode ( Util::XSSFilt ( $result ) );
}
catch ( MyException $e ) {
	$result = array ();
	$result ["retCode"] = $e->ErrorCode ();
	$result ["retMessage"] = $e->ErrorMessage ();
	$result ["name"] = $_SESSION ["name"];
	echo json_encode ( Util::XSSFilt ( $result ) );
}
catch ( HeaderException $e ) {
	$result = array ();
	$result ["retCode"] = $e->ErrorCode ();
	$result ["retMessage"] = $e->ErrorMessage ();
	$result ["name"] = $_SESSION ["name"];
	header ( "Location: /public/h5/fail.html?msg={$result['retMessage']}" );
}
catch ( ExitException $e ) {
	// 退出异常不做任何操作
}
catch ( Excpetion $e ) {
	$result = array ();
	$result ["retCode"] = 1;
	$result ["retMessage"] = $e->getMessage ();
	$result ["name"] = $_SESSION ["name"];
	echo json_encode ( Util::XSSFilt ( $result ) );
}
?>
