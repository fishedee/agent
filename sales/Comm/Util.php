<?php
require_once (dirname ( __FILE__ ) . '/../Comm/Constant.php');
require_once (dirname ( __FILE__ ) . '/../Comm/MyException.php');
require_once (dirname ( __FILE__ ) . '/../Comm/HeaderException.php');
require_once (dirname ( __FILE__ ) . '/../Comm/ExitException.php');
require_once (dirname ( __FILE__ ) . '/../Comm/Snoopy.php');
require_once (dirname ( __FILE__ ) . '/../Comm/class.phpmailer.php');
require_once dirname ( __FILE__ ) . '/../Comm/PHPExcel.php';
require_once dirname ( __FILE__ ) . '/../Model/SendDb.php';

class Util {
	public static $ms_exception;

	public static function Now() {
		return date ( 'Y-m-d H:i:s', time () );
	}

	public static function SetException($exception) {
		Util::$ms_exception = $exception;
	}

	public static function ThrowException($retCode, $retMessage) {
		throw new Util::$ms_exception ( $retCode, $retMessage );
	}

	public static function ExportExcel($fileName, $title, $columnName, $columnData) {
		// Create new PHPExcel object
		$objPHPExcel = new PHPExcel ();
		// Set document properties
		$objPHPExcel->getProperties ()->setCreator ( EXCEL_CREATOR )->setLastModifiedBy ( EXCEL_CREATOR )->setTitle ( $title )->setSubject ( $title )->setDescription ( $title )->setKeywords ( $title )->setCategory ( $title );
		// 设置Excel高度
		$columnIndex = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$objPHPExcel->setActiveSheetIndex ( 0 );
		for($i = 0; $i != count ( $columnName ); $i ++) {
			$curColumnIndex = substr ( $columnIndex, $i, 1 );
			$objPHPExcel->getActiveSheet ()->getColumnDimension ( $curColumnIndex )->setWidth ( $columnName [$i] ['width'] );
		}
		// 设置Excel头部
		for($i = 0; $i != count ( $columnName ); $i ++) {
			$curColumnIndex = substr ( $columnIndex, $i, 1 ) . '1';
			$objPHPExcel->getActiveSheet ()->setCellValue ( $curColumnIndex, $columnName [$i] ['name'] );
		}
		// 设置Excel数据
		for($i = 0; $i != count ( $columnData ); $i ++) {
			for($j = 0; $j != count ( $columnName ); $j ++) {
				$curColumnIndex = substr ( $columnIndex, $j, 1 ) . ($i + 2);
				$objPHPExcel->getActiveSheet ()->setCellValueExplicit ( $curColumnIndex, $columnData [$i] [$columnName [$j] ['id']], PHPExcel_Cell_DataType::TYPE_STRING );
			}
		}
		header ( 'Content-Type: application/vnd.ms-excel' );
		header ( 'Content-Disposition: attachment;filename="' . $fileName . '"' );
		header ( 'Cache-Control: max-age=0' );
		
		// If you're serving to IE over SSL, then the following may be needed
		header ( 'Expires: Mon, 26 Jul 1997 05:00:00 GMT' ); // Date in the past
		header ( 'Last-Modified: ' . gmdate ( 'D, d M Y H:i:s' ) . ' GMT' ); // always modified
		header ( 'Cache-Control: cache, must-revalidate' ); // HTTP/1.1
		header ( 'Pragma: public' ); // HTTP/1.0
		
		$objWriter = PHPExcel_IOFactory::createWriter ( $objPHPExcel, 'Excel5' );
		$objWriter->save ( 'php://output' );
		throw new ExitException ();
	}

	public static function GetPageContent($html, $data) {
		ob_start ();
		require_once ($html);
		$body = ob_get_contents ();
		ob_end_clean ();
		return $body;
	}

	public static function SendMail($addressList, $subject, $body) {
		Util::AsyncSendMail ( $addressList, $subject, $body );
	}

	public static function SendSms($phoneNumber, $content) {
		Util::AsyncSendSms ( $phoneNumber, $content );
	}

	public static function AsyncSendMail($addressList, $subject, $body) {
		$newAddressList = array ();
		foreach ( $addressList as $single ) {
			$tempSingle = array (
					"mail" => $single ['mail'],
					"name" => $single ['name'] 
			);
			$newAddressList [] = $tempSingle;
		}
		$sendDb = new SendDb ();
		$sendData = array (
				"addressList" => $newAddressList,
				"subject" => $subject,
				"body" => $body 
		);
		$sendDb->Add ( array (
				array (
						"type" => SEND_TYPE_MAIL,
						"state" => SEND_STATE_NOSEND,
						"data" => json_encode ( $sendData ) 
				) 
		) );
	}

	public static function AsyncSendSms($phoneNumber, $content) {
		$sendDb = new SendDb ();
		$sendData = array (
				"phoneNumber" => $phoneNumber,
				"content" => $content 
		);
		$sendDb->Add ( array (
				array (
						"type" => SEND_TYPE_SMS,
						"state" => SEND_STATE_NOSEND,
						"data" => json_encode ( $sendData ) 
				) 
		) );
	}

	public static function SyncSendMail($addressList, $subject, $body) {
		if (count ( $addressList ) == 0)
			return;
		$mail = new PHPMailer ();
		$mail->IsSMTP (); // telling the class to use SMTP
		$mail->SMTPAuth = true; // enable SMTP authentication
		$mail->Host = MAIL_HOST; // sets the SMTP server
		$mail->Port = MAIL_PORT; // set the SMTP port for the GMAIL server
		$mail->Username = MAIL_USER; // SMTP account username
		$mail->Password = MAIL_PASS; // SMTP account password
		$mail->Charset = 'UTF-8';
		$mail->IsHTML ( true );
		$mail->SetFrom ( MAIL_USER, MAIL_USER_NAME );
		$mail->AddReplyTo ( MAIL_USER, MAIL_USER_NAME );
		$mail->Subject = "=?utf-8?B?" . base64_encode ( $subject ) . "?=";
		$mail->MsgHTML ( $body );
		foreach ( $addressList as $single ) {
			$single ['name'] = "=?utf-8?B?" . base64_encode ( $single ['name'] ) . "?=";
			$mail->AddAddress ( $single ['mail'], $single ['name'] );
		}
		$result = $mail->Send ();
		if ($result == false)
			Util::ThrowException ( 1, "邮件发送失败，失败原因为：" . $mail->ErrorInfo );
	}

	public static function SyncSendSms($phoneNumber, $content) {
		$smsapi = "api.smsbao.com"; // 短信网关
		$charset = "utf8"; // 文件编码
		$user = SMS_USER; // 短信平台帐号
		$pass = md5 ( SMS_PASS ); // 短信平台密码
		
		$snoopy = new Snoopy ();
		$sendurl = "http://{$smsapi}/sms?u={$user}&p={$pass}&m={$phoneNumber}&c=" . urlencode ( $content );
		$snoopy->fetch ( $sendurl );
		$result = $snoopy->results;
		if ($result == 30)
			Util::ThrowException ( 1, "短信宝密码错误" );
		else if ($result == 40)
			Util::ThrowException ( 1, "短信宝帐号不存在" );
		else if ($result == 41)
			Util::ThrowException ( 1, "短信宝余额不足" );
		else if ($result == 42)
			Util::ThrowException ( 1, "短信宝帐号过期" );
		else if ($result == 43)
			Util::ThrowException ( 1, "短信宝IP地址限制" );
		else if ($result == 50)
			Util::ThrowException ( 1, "短信宝内容含有敏感词" );
		else if ($result == 51)
			Util::ThrowException ( 1, "手机号码不正确，发送短信失败" );
		else if ($result != 0)
			Util::ThrowException ( 1, "发送短信失败，请检查网路状况" );
	}

	public static function SyncSendSms2($phoneNumber, $content) {
		// 要post的数据
		$argv = array (
				'sn' => 'SDK-LHZ-010-00135', // //替换成您自己的序列号
				'pwd' => strtoupper ( md5 ( 'SDK-LHZ-010-00135' . '242476' ) ), // 此处密码需要加密 加密方式为 md5(sn+password) 32位大写
				'mobile' => $phoneNumber, // 手机号 多个用英文的逗号隔开 post理论没有长度限制.推荐群发一次小于等于10000个手机号
				'content' => urlencode ( $content . '[长春万科]' ), // 短信内容
				'ext' => '',
				'rrid' => '', // 默认空 如果空返回系统生成的标识串 如果传值保证值唯一 成功则返回传入的值
				'stime' => ''  // 定时时间 格式为2011-6-29 11:09:21
				);
		// 构造要post的字符串
		$params = "";
		$flag = 0;
		foreach ( $argv as $key => $value ) {
			if ($flag != 0) {
				$params .= "&";
				$flag = 1;
			}
			$params .= $key . "=";
			$params .= urlencode ( $value );
			$flag = 1;
		}
		$length = strlen ( $params );
		// 创建socket连接
		$fp = fsockopen ( "sdk2.entinfo.cn", 8060, $errno, $errstr, 10 );
		if ($fp == false)
			Util::ThrowException ( 1, "发送短信失败，fsockopen 打开失败" );
			// 构造post请求的头
		$header = "POST /webservice.asmx/mdSmsSend_u HTTP/1.1\r\n";
		$header .= "Host:sdk2.entinfo.cn\r\n";
		$header .= "Content-Type: application/x-www-form-urlencoded\r\n";
		$header .= "Content-Length: " . $length . "\r\n";
		$header .= "Connection: Close\r\n\r\n";
		// 添加post的字符串
		$header .= $params . "\r\n";
		// 发送post的数据
		fputs ( $fp, $header );
		$inheader = 1;
		while ( ! feof ( $fp ) ) {
			$line = fgets ( $fp, 1024 ); // 去除请求包的头只显示页面的返回数据
			if ($inheader && ($line == "\n" || $line == "\r\n")) {
				$inheader = 0;
			}
			if ($inheader == 0) {
				// echo $line;
			}
		}
		// 第三种，正则取
		preg_match ( '/<string xmlns=\"http:\/\/tempuri.org\/\">(.*)<\/string>/', $line, $str );
		$result = explode ( "-", $str [1] );
		if (count ( $result ) > 1)
			Util::ThrowException ( 1, "发送短信失败返回值为，错误码为:$line" );
	}

	public static function CheckUploadFile($file) {
		$file = dirname ( __FILE__ ) . '/../' . $file;
		if (is_file ( $file ) == false)
			Util::ThrowException ( 1, "请先上传图片文件" );
		if (@getimagesize ( $file ) == false)
			Util::ThrowException ( 1, "请确认上传的文件是图片" );
	}

	public static function AddPostFile($file, $file_type, $file_size, $folder) {
		$ex = explode ( ",", $file );
		$filter = explode ( '/', trim ( $ex [0], ';base64' ) );
		$s = base64_decode ( str_replace ( $filter [1], '', $ex [1] ) );
		$fileName = md5 ( uniqid () . mt_rand ( 1, 1000000 ) ) . "." . $filter [1];
		$fileAddress = dirname ( __FILE__ ) . '/../' . $folder . "/" . $fileName;
		$fileUrl = $folder . "/" . $fileName;
		$file = fopen ( $fileAddress, 'wb' );
		if ($file == false)
			Util::ThrowException ( 1, "打开上传文件失败" );
		$data = fwrite ( $file, $s );
		if ($data == false)
			Util::ThrowException ( 1, "写入上传文件失败" );
		fclose ( $file );
		return $fileUrl;
	}

	public static function AddUploadFile($file, $file_type, $file_size, $folder) {
		if ($file ["error"] == 1)
			Util::ThrowException ( 1, "上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值" );
		else if ($file ["error"] == 2)
			Util::ThrowException ( 1, "上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值" );
		else if ($file ["error"] == 3)
			Util::ThrowException ( 1, "文件只有部分被上传" );
		else if ($file ["error"] == 4)
			Util::ThrowException ( 1, "没有文件被上传" );
		else if ($file ["error"] != 0)
			Util::ThrowException ( 1, "上传文件出错,错误码为:" . $file ["error"] );
			// if( $file["type"] != $file_type )
			// Util::ThrowException(1,"不支持的文件类型，只支持".$file_type."类型");
		if ($file ["size"] == 0 || $file ["size"] > $file_size)
			Util::ThrowException ( 1, "不支持的文件大小，只支持少于" . $file_size . "字节的文件" );
		if (is_uploaded_file ( $file ["tmp_name"] ) == false)
			Util::ThrowException ( 1, "非支持的上传文件，请勿攻击" );
		if (filesize ( $file ["tmp_name"] ) != $file ["size"])
			Util::ThrowException ( 1, "文件大小校验失败" );
		if (@getimagesize ( $file ["tmp_name"] ) == false)
			Util::ThrowException ( 1, "请上传图片文件" );
		$fileName = md5 ( uniqid () . mt_rand ( 1, 1000000 ) ) . "." . pathinfo ( $file ["name"], PATHINFO_EXTENSION );
		$fileAddress = $folder . "/" . $fileName;
		if (move_uploaded_file ( $file ["tmp_name"], substr ( $fileAddress, 1 ) ) == false)
			Util::ThrowException ( 1, "保存上传文件失败" );
		return $fileAddress;
	}

	public static function DelUploadFile($fileAddress) {
		unlink ( substr ( $fileAddress, 1 ) );
	}

	public static function CheckValid($key, $value, $constraint) {
		$temp = explode ( "|", $constraint );
		$type = $temp [0];
		if (count ( $temp ) == 2) {
			$temp2 = explode ( ",", $temp [1] );
			$values = $temp2;
		}
		else {
			$values = array ();
		}
		if ($type == "digitchar") {
			$rule = '/^\d+$/';
			$result = preg_match ( $rule, $value );
			if ($result == 0)
				Util::ThrowException ( 1, $key . "需要输入全数字的格式" );
			if (isset ( $values [0] ) && intval ( $values [0] ) > strlen ( $value ))
				Util::ThrowException ( 1, $key . "至少为" . $values [0] . "位的数字" );
			if (isset ( $values [1] ) && intval ( $values [1] ) < strlen ( $value ))
				Util::ThrowException ( 1, $key . "至多为" . $values [1] . "位的数字" );
		}
		else {
			Util::ThrowException ( 1, $key . "未知的字段约束类型" );
		}
		/*
		 * if( $type == "integer"){ $rule = '/^[-0-9]+$/'; $result = preg_match($rule,$value); if( $result == 0 ) Util::ThrowException(1,$name."需要输入全数字的格式"); if( empty($values[0]) != false && intval($values[0]) > intval($value) ) Util::ThrowException(1,$name."至少为".$value."位的数字"); if( empty($values[1]) != false && intval($values[1]) > intval($value) ) Util::ThrowException(1,$name."至少为".$value."位的数字"); }else if( $type == "enum"){ $rule = '/^\d+$/'; $result = preg_match($rule,$value); if( $result == 0 ) Util::ThrowException(1,$key."不符合enum字段约束，请重新输入".$value); if( in_array($value,$values) == false ) Util::ThrowException(1,$key."是不合法的枚举常量:".$value); }else if( $type == "datetime"){ $rule = '/^\d{4}\-\d{1,2}\-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/'; $result = preg_match($rule,$value); if( $result == 0 ) Util::ThrowException(1,$key."不符合datetime字段约束，请重新输入".$value); }else if( $type == "digitchar"){ $rule = '/^\d+$/'; $result = preg_match($rule,$value); if( $result == 0 ) Util::ThrowException(1,$key."不符合digitchar字段约束，请重新输入".$value); if( isset($values[0])&& intval($values[0]) > strlen($value) ) Util::ThrowException(1,$key."太短了，请重新输入长一点的数据".$value); if( isset($values[1])&& intval($values[1]) < strlen($value) ) Util::ThrowException(1,$key."太长了，请重新输入短一点的数据".$value); }else if( $type == "hexchar"){ $rule = '/^[0-9a-f]+$/'; $result = preg_match($rule,$value); if( $result == 0 ) Util::ThrowException(1,$key."不符合hexchar字段约束，请重新输入".$value); if( isset($values[0])&& intval($values[0]) > strlen($value) ) Util::ThrowException(1,$key."太短了，请重新输入长一点的数据".$value); if( isset($values[1])&& intval($values[1]) < strlen($value) ) Util::ThrowException(1,$key."太长了，请重新输入短一点的数据".$value); }else if( $type == "wordchar"){ $rule = '/^[\x{4e00}-\x{9fa5}A-Za-z0-9_]+$/u'; $result = preg_match($rule,$value); if( $result == 0 ) Util::ThrowException(1,$key."不符合wordchar字段约束，请重新输入".$value); if( isset($values[0])&& intval($values[0]) > strlen($value) ) Util::ThrowException(1,$key."太短了，请重新输入长一点的数据".$value); if( isset($values[1])&& intval($values[1]) < strlen($value) ) Util::ThrowException(1,$key."太长了，请重新输入短一点的数据".$value); }else if( $type == "contentchar"){ if( isset($values[0])&& intval($values[0]) > strlen($value) ) Util::ThrowException(1,$key."太短了，请重新输入长一点的数据".$value); if( isset($values[1])&& intval($values[1]) < strlen($value) ) Util::ThrowException(1,$key."太长了，请重新输入短一点的数据".$value); }else if( $type == "urlchar"){ $rule = '/^\/([a-zA-Z0-9]+(\/)+)+([a-zA-Z0-9]+)\.([a-zA-Z]+)$/'; $result = preg_match($rule,$value); if( $result == 0 ) Util::ThrowException(1,$key."不符合URL字段约束，请重新输入".$value); if( isset($values[0])&& intval($values[0]) > strlen($value) ) Util::ThrowException(1,$key."太短了，请重新输入长一点的数据".$value); if( isset($values[1])&& intval($values[1]) < strlen($value) ) Util::ThrowException(1,$key."太长了，请重新输入短一点的数据".$value); }
		 */
	}

	public static function XSSFilt($data) {
		return $data;
		if (is_array ( $data )) {
			$result = array ();
			foreach ( $data as $key => $value )
				$result [$key] = Util::XSSFilt ( $value );
		}
		else {
			$result = htmlspecialchars ( $data );
		}
		return $result;
	}
}
?>
