<?php
require_once (dirname ( __FILE__ ) . '/../Comm/Constant.php');
require_once (dirname ( __FILE__ ) . '/../Model/BaseDb.php');
class DealDb extends BaseDb {

	public function __construct() {
		GLOBAL $MYSQL_TABLE_DEAL_CONSTRAINT;
		parent::__construct ( MYSQL_TABLE_DEAL, $MYSQL_TABLE_DEAL_CONSTRAINT );
	}
}
?>