<?php
unlink($_GET['path']);
unlink(str_replace('.pdf','.xml', $_GET['path']));
?>