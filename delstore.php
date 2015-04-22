<?php
	unlink($_GET['file']);
	if(strpos($_GET['file'], 'fonts')>-1)
	{
		$f=str_replace('.ttf', '', $_GET['file']);

		unlink('tcpdf/fonts/'.$f.'.php');
		unlink('tcpdf/fonts/'.$f.'.z');
		unlink('tcpdf/fonts/'.$f.'.ctg.z');
	}
?>