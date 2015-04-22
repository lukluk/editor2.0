<?php

require_once('test.php');

//error_reporting(0);
/*
UploadiFive
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
*/

// Set the uplaod directory

include("simple_html_dom.php");
$ttfInfo = new ttfInfo; 
	$dom= new simple_html_dom();
$path=str_replace('editor/doXML.php','',__file__ );
	
	$dom->load(file_get_contents($_GET['filename']));
	  
	$images=$dom->find("img");
	foreach ($images as $img) {
		# code...
		if(!file_exists("store/".$img->src))
		file_put_contents("store/".$img->src, base64_decode($img->title));
	}
	$newfont=null;
	$images=$dom->find("font");	
	$xx=null;
if ($handle = opendir('fonts')) {
    while (false !== ($entry = readdir($handle))) {	
        if ($entry != "." && $entry != ".." && strpos($entry,".js") > 0 ) {					
			$fnt=str_replace('_400.font.js', '.ttf', $entry);
			$fntx=str_replace('_400.font.js', '', $entry);

			$ar=explode('-',$fntx);
			if($ar[1]){
				$fntx=$ar[1];
			}else{
				$fntx=$ar[0];
			}
			$ttfInfo->setFontFile('fonts/'.$fnt);         	
			$a=$ttfInfo->getFontInfo();							
			$xx[]=$a[1];
			$xy[$fntx]=$a[1];
		}
}
}

		
	foreach ($images as $font) {

		if(!in_array($font->src,$xx)){

			$list = glob(strtolower("fonts/*".$font->src.'_400.font.js'));
			if(!$list)
			$list = glob(("fonts/*".$font->src.'_400.font.js'));
			
			if(!$list){
				$ret['error']=$ret['error'].$font->src.',';
			} 
		}
		
			
		
		
		
		//file_put_contents("fonts/".$font->src.'_400.font.js', base64_decode($font->title));


			$entry=$font->src.'_400.font.js';
			$name=str_replace(".js","",$entry);

			$name=str_replace("_400","",$name);
			$name=str_replace(".font","",$name);
			$name=trim($name);
			
			//echo $xy[$font->src];
			if($xy[$font->src]){
				$newfont['"fontFamily":"'.$font->src.'"']='"fontFamily":"'.$xy[$font->src].'","pdffont":'.'"'.$name.'"';
				$newfont['"fontFamily":"-'.strtolower($font->src).'"']='"fontFamily":"'.$xy[$font->src].'","pdffont":'.'"'.$name.'"';
			}else{
				$newfont['"fontFamily":"'.$font->src.'"']='"fontFamily":"'.$font->src.'","pdffont":'.'"'.$name.'"';
				$newfont['"fontFamily":"-'.strtolower($font->src).'"']='"fontFamily":"'.$font->src.'","pdffont":'.'"'.$name.'"';

			}


	}
	if($ret['error'])
	$ret['error']=substr($ret['error'],0,-1).' not found, please upload these font';
	$svgc=$dom->find("svg");	
	foreach ($svgc as $font) {
		# code...
		if(!file_exists("freesvg/".$font->src))
		file_put_contents("freesvg/".$font->src, base64_decode($font->title));
	}

	$con=$dom->find("json",0)->innertext;	
	//if(!strpos($con, 'pdffont'))
	foreach ($newfont as $key => $value) {
		# code...
		//"src":"fonts/uid7-frutiger.ttf"
//		echo $key.'=='.$value;
		$con=str_replace($key, $value, $con);

	}
	$ret['content']=$con;
	echo json_encode($ret);
	

?>