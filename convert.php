<?php
$png=str_replace('.pdf','',str_replace('.svg','.png',$_GET[file]));
exec("convert '$_GET[file]' '$png'");
unlink($_GET[file]);
echo $png;
?>