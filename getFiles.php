<?php
error_reporting(-1);
ini_set('display_errors', true);
$i=0;
require_once('../.sec/key.php');
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
if ($handle = opendir('stock/users/'.md5($_GET['email']))) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
        	
 			if(strpos($entry,'.pdf')>-1)
			{
				if(file_exists('stock/users/'.md5($_GET['email']).'/'.str_replace('.pdf', '.pin',$entry))){
				$pin=file_get_contents('stock/users/'.md5($_GET['email']).'/'.str_replace('.pdf', '.pin',$entry));
				}else{
					$pin='0000';
				}
				$res.= 'stock/users/'.md5($_GET['email']).','.$entry.','.'http://fabreasy.com/editor/index.php?share='.base64_encode('stock/users/'.md5($_GET['email']).'/'.$entry.'|'.$pin.'|'.$_GET['userid'].'|'.$_GET['firstname'].'|'.$_GET['lastname'])."|";

				$i++;
				if($paket=='default' && $i==6)
				{
					break;
				}

			}
			

        }
    }
    echo substr($res, 0,-1);
    closedir($handle);
}

if($i<=0)
{
	echo 'NO';
}
?>