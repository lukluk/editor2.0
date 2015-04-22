<?php
 $from='no-reply@fabreasy.com';
 $to=$_POST['to'];
 $first_name=$_POST['first_name'];
 $last_name=$_POST['last_name'];
 $link=$_POST['link'];
 $msg=$_POST['msg'];
 $tpl=file_get_contents('email/share.tpl');
 
 if($_POST['expire']!='99'){
 	$links=explode('share=', $link);
 	$l=$links[1];
 	file_put_contents('expirelink/'.md5($l), strtotime("+ $_POST[expire] months"));
 }
 foreach ($_POST as $key => $value) {
 	# code...
 	$tpl=str_replace('#'.$key, $$key, $tpl);
 }

$line=explode("\n", $tpl);
$subject = $line[0];
$tpl=str_replace($subject, '', $tpl);
$headers = "From: " . strip_tags($from) . "\r\n";
$headers .= "Reply-To: ". strip_tags($from) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
$message = '<html><body>';
$message.=$tpl;
$message .= '</body></html>';
mail($to, $subject, $message, $headers);

?>