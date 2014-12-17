<?php
class HeaderException extends Exception { 
private $m_errorCode;
private $m_errorMessage;
public function __construct($errorCode,$errorMessage){
	$this->m_errorCode = $errorCode;
	$this->m_errorMessage = $errorMessage;
}
public function ErrorCode(){
	return $this->m_errorCode;
}
public function ErrorMessage(){
	return $this->m_errorMessage;
}
}
?>
