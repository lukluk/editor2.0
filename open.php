<?php
include('db.php');
$r=mysql_query("select * from  store where id='$_GET[id]'");
$b=mysql_fetch_array($r);
echo $b['name'];
?>