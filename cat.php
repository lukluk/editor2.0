<?php
error_reporting(0);
if ($handle = opendir('store')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {			
			/*** show the extension ***/
			if(strpos('x'.$entry,'uid'.$_GET['uid'].'-')>0)
			{
				if(pathinfo($entry, PATHINFO_EXTENSION)!='pdf')
				{
					echo "<li style='position:relative;max-height:150px;overflow-y:hidden;' id='".$entry."'><img class='delstore' style='display:none;position:absolute;left:0px;top:0px;' src='close.png'/><img class='crop' style='display:none;position:absolute;right:0px;top:0px;' src='images/crop.png'/> <img class='img' src='store/$entry' source='store/$entry' type='img' width=120 height=auto /></li>";
				}
			}
			/*else
			if(!strpos('x'.$entry,'uid'))
			{				
				if(pathinfo($entry, PATHINFO_EXTENSION)!='svg')
				{
					echo "<li style='position:relative;' id='".$entry."'><img class='delstore' style='display:none;position:absolute;left:0px;top:0px;' src='close.png'/> <img class='img' src='store/$entry' source='store/$entry' type='img' width=120 height=auto /></li>";
				}else
				{
					echo "<li style='position:relative;' id='".$entry."'><img class='delstore' style='display:none;position:absolute;left:0px;top:0px;' src='close.png'/><img class='img' src='store/$entry' source='store/$entry' type='svg' width=120 height=auto  /></li>";
				}

			}*/			
        }
    }
    closedir($handle);
}
?>