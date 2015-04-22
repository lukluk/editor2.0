<?php

error_reporting(0);

    $units = explode(' ', 'B KB MB GB TB PB');
    $SIZE_LIMIT = $_POST['maxpdfsize']; // 5 GB
    


function foldersize($path) {
    $total_size = 0;
    $files = scandir($path);
    $cleanPath = rtrim($path, '/'). '/';

    foreach($files as $t) {
        if ($t<>"." && $t<>"..") {
            $currentFile = $cleanPath . $t;
            if (is_dir($currentFile)) {
                $size = foldersize($currentFile);
                $total_size += $size;
            }
            else {
                $size = filesize($currentFile);
                $total_size += $size;
            }
        }   
    }

    return $total_size;
}


function format_size($size) {
    global $units;

    $mod = 1024;

    for ($i = 0; $size > $mod; $i++) {
        $size /= $mod;
    }

    $endIndex = strpos($size, ".")+3;

    return substr( $size, 0, $endIndex).' '.$units[$i];
}
$disk_used = foldersize("stock/users/".md5($_POST['email']));
$disk_remaining = $SIZE_LIMIT - $disk_used;
$i=0;
if ($handle = opendir('stock/users/'.md5($_POST['email']))) {

    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {			
			if(strpos('x'.$entry,'.pdf')>0)
			{

				$i++;
			}
			
        }
		
    }
    closedir($handle);
}

if($i<$_POST['maxpdf'])
{
if($disk_remaining>0)
{

$svg=$_POST['svg'];
$json=$_POST['js'];
$user='test';
$name= str_replace('"', '', $_POST['name']);
$name= str_replace("'", "", $name);
$_POST['name']=$name;
$xname=$name;
mkdir("stock/users/".md5($_POST['email']));
//file_put_contents("stock/users/".md5($_POST['email']).'/user.key', 'demo');
	$fn='stock/users/'.md5($_POST['email']).'/'.$_POST['name'].'.xml';
	$xml="<xml><json>".$_POST['js']."</json>";
	$fnts=explode(',',$_POST['fonts']);
	$imgs=explode(',',$_POST['images']);
	$svgc=explode(',',$_POST['svgc']);
	$xml.="<fonts>";
	foreach ($fnts as $font) {
		# code...
		if(strlen($font)>3)
		{
			$f="fonts/".str_replace(" ", "_", $font)."_400.font.js";
			$f=file_get_contents($f);
			$xml.="<font src='$font' title='".base64_encode($f)."' />";
		}
	}
	$xml.="</fonts>";
	$xml.="<images>";
	foreach ($imgs as $font) {
		# code...		
		if(strlen($font)>3)
		{
			$f=file_get_contents($font);
			$u=pathinfo($font);
			$font=$u['filename'].'.'.$u['extension'];
			$xml.="<img src='$font' title='".base64_encode($f)."'/>";
		}
	}
	$xml.="</images>";
	$xml.="<svgs>";
	foreach ($svgc as $font) {
		# code...		
		if(strlen($font)>3)
		{
			$f=file_get_contents($font);
			$u=pathinfo($font);
			$font=$u['filename'].'.'.$u['extension'];
			$xml.="<svg src='$font' title='".base64_encode($f)."'/>";
		}
	}
	$xml.="</svgs>";

	$xml.="</xml>";
	file_put_contents($fn, utf8_encode($xml));
	
	$fn='temp/'.$_POST['name'].'.svg';
	file_put_contents($fn, utf8_encode($svg));
	echo base64_encode($fn);
}else
{
	echo "ERR";
}
}else
{
	echo "OVER";	
}
?>