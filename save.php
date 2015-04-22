<?php
error_reporting(0);
$svg=$_POST['svg'];
$json=$_POST['js'];
$user='test';
$name= str_replace('"', '', $_POST['name']);
$name= str_replace("'", "", $name);
$_POST['name']=$name;
$xname=$name;
if($_POST['mode']=='file')
{
	$fn='temp/'.$_POST['name'].'.xml';
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

	echo base64_encode($fn);
}else
{
	$fn='temp/'.$_POST['name'].'.svg';
	file_put_contents($fn, utf8_encode($svg));
	echo base64_encode($fn);
}

?>