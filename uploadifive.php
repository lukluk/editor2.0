<?php
//error_reporting(0);
/*
UploadiFive
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
*/

// Set the uplaod directory
require_once("config.php");
$i=0;
if ($handle = opendir('store')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {			
			/*** show the extension ***/
			if(strpos('x'.$entry,'uid'.$_GET['uid'].'-')>0)
			{
				$i++;
			}

        }
    }
    closedir($handle);
}
if($i<$_GET['max'])
{
	$uploadDir = '/editor/store/';

	if (!empty($_FILES)) {
		$tempFile   = $_FILES['Filedata']['tmp_name'][0];
		$uploadDir  = $_SERVER['DOCUMENT_ROOT'] . $uploadDir;
		$targetFile = str_replace(' ','',str_replace('=','',str_replace('&','',strtolower($uploadDir . 'uid'.$_GET['uid'].'-'.$_FILES['Filedata']['name'][0]))));

		// Validate the file type
		$fileTypes = array('jpg', 'jpeg', 'gif', 'png'); // Allowed file extensions
		$fileParts = pathinfo($_FILES['Filedata']['name'][0]);
		$d['ext']=strtolower($fileParts['extension']);

		// Validate the filetype
		//if (in_array($fileParts['extension'], strtolower($fileTypes))) 
		if(filesize($tempFile)<=$_GET['maxsize'])
		{

			// Save the file
			move_uploaded_file($tempFile,$targetFile);
			
			if($d['ext']=='pdf')
			{
				$svg=str_replace('.pdf', '.pdf.svg', $targetFile);
				exec('inkscape -l "'.$svg.'" "'.$targetFile.'"');
				$d['log']='inkscape -l '.$svg.' '.$targetFile;
			}

			$d['file']=$targetFile;
			$d['url']=str_replace($path."/editor/",'',$targetFile);

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