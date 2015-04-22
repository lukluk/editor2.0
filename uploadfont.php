<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
//error_reporting(0);
/*
UploadiFive
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
*/
require_once('config.php');
require_once('../fb.php');
// Set the uplaod directory
$i=0;
require_once('test.php');
if ($handle = opendir('fonts')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {			
			/*** show the extension ***/
			if(strpos('x'.$entry,'uid'.$_GET['uid'])>0)
			{
//				$i++;
			}

        }
    }
    closedir($handle);
}
if($i<$_GET['max'])
{
	$uploadDir = '/editor/fonts/';

	if (!empty($_FILES)) {
		$tempFile   = $_FILES['Filedata']['tmp_name'][0];
		$uploadDir  = $_SERVER['DOCUMENT_ROOT'] . $uploadDir;
		$targetFile = strtolower($uploadDir . str_replace(' ','',$_FILES['Filedata']['name'][0]));

		// Validate the file type
		$fileTypes = array('ttf'); // Allowed file extensions
		$fileParts = pathinfo($_FILES['Filedata']['name'][0]);
		$d['ext']=strtolower($fileParts['extension']);
		
		// Validate the filetype
		//if (in_array($fileParts['extension'], strtolower($fileTypes))) 
		if($d['ext']=='ttf')
		if(filesize($tempFile)<=$_GET['maxsize'])
		{

			// Save the file
					$tr=str_replace('uid'.$_GET['uid'].'-','',$targetFile);
					
			
			move_uploaded_file($tempFile,$targetFile);
$a=getFontInfo($targetFile) ;
if(strlen($a[1])<1){
	$d['err']='FORMAT';
	echo json_encode($d);
	exit();
}
					require_once('tcpdf/config/lang/eng.php');
					require_once('tcpdf/tcpdf.php');			
					$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
		
					//if(!file_exists($ztr))c
					//echo $tr;
					{
					$x=$pdf->addTTFfont($targetFile, 'TrueType', 'ansi', 400);					
					require_once('tcpdf/fonts/'.$x.'.php');
					
					
					$pdf->addTTFfont($targetFile, $type, 'ansi', $desc['Flags']);
					
					
					rename($targetFile,$path.'/editor/fonts/uid'.$_GET['uid'].'-'.$x.'.ttf');
					
					}
$targetFile=$path.'/editor/fonts/uid'.$_GET['uid'].'-'.$x.'.ttf';					
exec('php -q '.$path.'/editor/generate/convert.php '.$targetFile.' -u "U+??" > '.str_replace('.ttf', '_400.font.js', $targetFile));


			$d['cufon']=str_replace($path.'/editor/','',str_replace('.ttf', '_400.font.js', $targetFile));
			$ttf=str_replace($path.'/editor/fonts/','',$targetFile);
			$fontx=str_replace('.ttf','',$ttf);
			$font=str_replace('uid'.$_GET['uid'].'-','',$fontx);
			$d['file']=$targetFile;
$font=str_replace(' ','',strtolower($font));	
$a=getFontInfo($targetFile) ;
if($a[1])
{
$font=$a[1];
}			

			$css="@font-face {
	font-family: '$font';	
	src: 
	     url('../fonts/$ttf')  format('truetype')	     
	}";
	$dcss="mycss/".$fontx.".css";
		file_put_contents($dcss,$css);
		$d['css']=$dcss;

		}else
		{
			$d['err']="OVER";
		}
		
	}
}else
{
	$d['err']="OUT";
}
echo json_encode($d);
?>
