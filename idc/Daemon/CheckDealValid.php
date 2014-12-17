<?php
require_once(dirname(__FILE__).'/../Model/DealDb.php');
require_once(dirname(__FILE__).'/../Comm/Constant.php');
try{
	$dealDb = new DealDb();
	$deals = $dealDb->Get(
		array(
			"equal"=>array(
				"state"=>DEAL_STATE_HAVE_REPORT
			)
		)
	);
	$failDeals = array();
	foreach( $deals as $single ){
		$createTime = strtotime($single['createTime']);
		if( time() > $createTime + DEAL_REPORT_EXPIRETIME ){
			$failDeals[] = $single['dealId'];
		}
	}
	if( count($failDeals) != 0 ){
		$dealDb->Mod(
			array(
				"state2"=>DEAL_STATE2_EXPIRE
			),
			array(
				"in"=>array(
					"dealId"=>$failDeals
				)
			)
		);
	}
}catch( Exception $e ){
}
?>