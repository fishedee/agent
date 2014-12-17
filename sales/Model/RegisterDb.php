<?php
require_once (dirname ( __FILE__ ) . '/../Model/BaseDb.php');
class RegisterDb extends BaseDb {

	public function __construct() {
		GLOBAL $MYSQL_TABLE_REGISTER_CONSTRAINT;
		parent::__construct ( MYSQL_TABLE_REGISTER, $MYSQL_TABLE_REGISTER_CONSTRAINT );
	}
}
?>