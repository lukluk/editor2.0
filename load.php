<?php
include('db.php');
$user='test';
$r=mysql_query("select * from  store where user='$user'");
echo "<table>";
while($b=mysql_fetch_array($r))
{
	$thumb=str_replace(' ','_',$b['name'].'.jpg');
	echo '<tr>';	
	echo "<td>";
	echo "<a href=# class='op' value='$b[id]' ><img src='svg.png' width=50px height=70px /></a>";
	echo "</td>";	
	echo '<td>';
	echo "<a href=# class='op' value='$b[id]' >$b[name]</a>";
	echo "</td>";	
	echo '</tr>';
}
echo "</table>";
?>