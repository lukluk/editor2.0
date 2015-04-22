<?php
require_once('test.php');
$userid=$_GET['uid'];
function owned($e,$userid)
{
$ar=explode('-',$e);

if($ar[0]=='uid'.$userid)
{
	return true;
}

}
$ttfInfo = new ttfInfo; 
if ($handle = opendir('fonts')) {
    while (false !== ($entry = readdir($handle))) {
	
        if ($entry != "." && $entry != ".." && strpos($entry,".js") > 0 && owned($entry,$userid)) {			
		
        	$xxx=file_get_contents('fonts/'.$entry);
        	$xar=explode('","font-weight":', $xxx);
        	$xa=$xar[0];
        	$xaa=explode('"font-family":"', $xa);
        	$namex=$xaa[1];
			
			$name=str_replace(".js","",$entry);
			$name=str_replace("_400","",$name);
			$name=str_replace(".font","",$name);
			
			$name=trim($name);


$x=str_replace('.ttf', '', $entry);
        	$font=str_replace('uid'.$userid.'-','',$x);	
			$name=str_replace('uid'.$userid.'-','',$name);	
			$font=str_replace('_400.font.js','',$font);	

$fnt=str_replace('_400.font.js', '.ttf', $entry);
$ttfInfo->setFontFile('fonts/'.$fnt);         	
 $a=$ttfInfo->getFontInfo();							
 if($a[1]){
 	$namex=$a[1];
 }
			//$class=str_replace(".ttf","",$entry);
	
            echo "<option value='$namex' data-val='$name' >$name</option>";
        }
if ($entry != "." && $entry != ".." && strpos($entry,".js") > 0 && strpos('xx'.$entry,'uid')!=2) {			
    // dump the info 
		
        	$xxx=file_get_contents('fonts/'.$entry);
        	$xar=explode('","font-weight":', $xxx);
        	$xa=$xar[0];
        	$xaa=explode('"font-family":"', $xa);
        	$namex=$xaa[1];


			$name=str_replace(".js","",$entry);

			$name=str_replace("_400","",$name);
			$name=str_replace(".font","",$name);
			$name=trim($name);
$fnt=str_replace('_400.font.js', '.ttf', $entry);
$ttfInfo->setFontFile('fonts/'.$fnt);         	
 $a=$ttfInfo->getFontInfo();							
 if($a[1]){
 	$namex=$a[1];
 }
		

			//$class=str_replace(".ttf","",$entry);
echo "<option value='$namex' data-val='$name' >$name</option>";
        }		
    }
    closedir($handle);
}
?>