<?php
//file_put_contents('temp/test.txt', 'xxxxxxx');
echo "start";
if(file_exists('stock/users/3f490c8a5bd28525a26f9f35113d243f/sample.xml')){
	echo "exist";
}
$fh = fopen('stock/users/3f490c8a5bd28525a26f9f35113d243f/sample.xml','r');
while ($line = fgets($fh)) {
  // <... Do You work with the line ...>
	echo $line;
}
fclose($fh);
//file_put_contents('temp/test2.txt', $a);
?>