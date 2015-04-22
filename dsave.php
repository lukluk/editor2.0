<?php
// Send the headers

header('Content-Type: text/xml');
$fb=explode("/", base64_decode($_GET['ID']));
header('Content-Disposition: attachment; filename="'.$fb[1].'"'); 
header('Content-Transfer-Encoding: binary');
echo file_get_contents(base64_decode($_GET['ID']));
unlink(base64_decode($_GET['ID']));
?>