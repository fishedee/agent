<?PHP 
//¸ÃdemoµÄ¹¦ÄÜÊÇ×¢²áĞòÁĞºÅ¡£×¢ÒâĞòÁĞºÅÖ»Ğè×¢²áÒ»´Î£¬¼´¿ÉÊ¹ÓÃ¡£
//Èç¹ûÄúµÄÏµÍ³ÊÇUTF-8¡£Çë×ª³ÉGB2312ºó£¬ÔÙÌá½»¡£·ñÔò£¬¿ÉÄÜ»áÂÒÂë
//²Î¿¼´úÂë£ºiconv( "UTF-8", "gb2312//IGNORE" ,"ÄãºÃ£¬²âÊÔ¶ÌĞÅ")
$flag = 0; 
        //ÒªpostµÄÊı¾İ 
$argv = array( 
         'sn'=>'SDK-LHZ-010-00135', //Ìá¹©µÄÕËºÅ
		 'pwd'=>'242476', //´Ë´¦ÃÜÂëÎª6Î»Ã÷ÎÄ£¬µ«ÓĞµÄ·½·¨ĞèÒª¼ÓÃÜ ¼ÓÃÜ·½Ê½Îª md5(sn+password) 32Î»´óĞ´£¬¾ßÌåµÄÇë²Î¿¼½Ó¿ÚËµÃ÷¡£
		 'province'=> '¹ã¶«',//ĞèÒªÄúÌî×Ô¼ºµÄÊ¡·İ
		 'city'=>'ÉîÛÚ',//ĞèÒªÄúÌî×Ô¼ºµÄÊĞ
		 'trade'=>'IT',//ÇëÌîÄúµÄĞĞÒµ
		 'entname'=>'ÆóÒµÃû³Æ',//ÄúµÄÆóÒµÃû³Æ
		 'linkman'=>'ÁªÏµman',//ÁªÏµÈËĞÕÃû
		 'phone'=>'88888888',//ÁªÏµµç»°£¨×ù»ú£©
		 'mobile'=>'12333333333',//ÊÖ»ú
		 'email'=>'11@qq.com',//ÓÊÏäµØÖ·
		 'fax'=>'88888888',//´«Õæ
		 'address'=>'µØÖ·',//ËùÔÚµØÖ·
		 'postcode'=>'100000',//ÓÊ±à
		'sign'=>'¿¿¿¿¿¿¿¿¿',//ÆóÒµÇ©Ãû£¬Èç¹ûÃ»ÓĞ¿É²»Ìî
		 ); 
//¹¹ÔìÒªpostµÄ×Ö·û´® 
$params = "";
foreach ($argv as $key=>$value) { 
          if ($flag!=0) { 
                         $params .= "&"; 
                         $flag = 1; 
          } 
         $params.= $key."="; $params.= urlencode($value); 
         $flag = 1; 
          } 
         $length = strlen($params); 
                 //´´½¨socketÁ¬½Ó 
        $fp = fsockopen("sdk2.entinfo.cn",80,$errno,$errstr,10) or exit($errstr."--->".$errno); 
         //¹¹ÔìpostÇëÇóµÄÍ· 
         $header = "POST /webservice.asmx/Register HTTP/1.1\r\n"; 
         $header .= "Host:sdk2.entinfo.cn\r\n"; 
          $header .= "Content-Type: application/x-www-form-urlencoded\r\n"; 
         $header .= "Content-Length: ".$length."\r\n"; 
         $header .= "Connection: Close\r\n\r\n"; 
         //Ìí¼ÓpostµÄ×Ö·û´® 
         $header .= $params."\r\n"; 
         //·¢ËÍpostµÄÊı¾İ 
         fputs($fp,$header); 
         $inheader = 1; 
          while (!feof($fp)) { 
                         $line = fgets($fp,1024); //È¥³ıÇëÇó°üµÄÍ·Ö»ÏÔÊ¾Ò³ÃæµÄ·µ»ØÊı¾İ 
                         if ($inheader && ($line == "\n" || $line == "\r\n")) { 
                                 $inheader = 0; 
                          } 
                          if ($inheader == 0) { 
                                // echo $line; 
                          } 
          } 
		  //<string xmlns="http://tempuri.org/">-5</string>
	       $line=str_replace("<string xmlns=\"http://tempuri.org/\">","",$line);
	       $line=str_replace("</string>","",$line);
		   $result=explode(" ",$line);
		   //print_r( $result);
		if  ( $result[0]=="0")
echo "×¢²á³É¹¦£¡";
if ($result[0]=="-1")
echo "ÖØ¸´×¢²á";
		
?>
