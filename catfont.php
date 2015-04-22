<?php
require_once('test.php');
require_once('../.sec/key.php');
function owned($e,$userid)
{
$ar=explode('-',$e);
if($ar[0]=='uid'.$userid)
{
	return true;
}

}
		$ttfInfo = new ttfInfo; 
$email=$_GET['email'];
            $serial=file_get_contents('stock/users/'.md5($email).'/serial.key');
            $version=file_get_contents('stock/users/'.md5($email).'/version.key');
            $keyg=file_get_contents('stock/users/'.md5($email).'/user.key'); 
            $r=dekeygen($keyg,$email,$serial);
            if(!$r['error'])
            {
                if($r['age']>0)
                {
                    $paket='pro';
                }
            }else
            {
                $paket='default';

            }
if ($handle = opendir('fonts')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && strpos($entry,".ttf") > 0 && owned($entry,$_GET['uid']) ) {	

    $ttfInfo->setFontFile('fonts/'.$entry); 
    // dump the info 
    $a=$ttfInfo->getFontInfo();
	
            $font=str_replace('.ttf', '', $entry);
            $tfont=str_replace('uid'.$_GET['uid'].'-','',str_replace('.ttf', '', $entry));
            $name=$tfont;
			if($a[1])
			{
				$tfont=$a[1];
			}
            $x=explode(' ', $font);
            $fs=15;
            if(strpos($font, 'uid'))
            {
                if($paket=="default")
                {
                    echo "<li class='txt' ><img class='delstorefont' style='display:none;position:absolute;left:0px;top:0px;' src='close.png'/><span data-val='duality' src='fonts/duality.ttf' type='text' class='txt text' style='font-size:$fs"."px;font-family:$tfont;color:#f00;'>$a[1]</span></li>";
                }else
                {
                    echo "<li class='txt' ><img class='delstorefont' style='display:none;position:absolute;left:0px;top:0px;' src='close.png'/><span pdffont='$name' data-val='$tfont' src='fonts/$entry' type='text' class='txt text' style='font-size:$fs"."px;font-family:$tfont;'>$a[1]</span></li>";                    
                }
            }else
            {
            echo "<li class='txt' ><img class='delstorefont' style='display:none;position:absolute;left:0px;top:0px;' src='close.png'/><span pdffont='$name' data-val='$tfont' src='fonts/$entry' type='text' class='txt text' style='font-size:$fs"."px;font-family:$tfont;'>$a[1]</span></li>";
            }
        }
    }
    closedir($handle);
}

?>