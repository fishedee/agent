<?php
require_once (dirname ( __FILE__ ) . '/../Comm/Constant.php');
require_once (dirname ( __FILE__ ) . '/../Model/BaseDb.php');
class MessageDb extends BaseDb {

	public function __construct() {
		GLOBAL $MYSQL_TABLE_MESSAGE_CONSTRAINT;
		parent::__construct ( MYSQL_TABLE_MESSAGE, $MYSQL_TABLE_MESSAGE_CONSTRAINT );
	}
}
?>