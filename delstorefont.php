<?php
echo $_GET['file'];
echo $_GET['file2'];
	unlink($_GET['file']);
	unlink(str_replace('.ttf','_400.font.js',$_GET['file']));
	
?>