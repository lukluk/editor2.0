<?php
   rename($_GET['path'].'/'.$_GET['name'].'.pdf',$_GET['path'].'/'.$_GET['newname'].'.pdf');
   rename($_GET['path'].'/'.$_GET['name'].'.xml',$_GET['path'].'/'.$_GET['newname'].'.xml');
?>