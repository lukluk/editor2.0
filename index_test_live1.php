<?php
function toLang($s,$data){
	
	$r=$data[str_replace('.', '', str_replace(' ', '_', $s))];
	if(!$r)
	{
		echo $s;
		//file_put_contents('log/test.lang',file_get_contents('log/test.lang')."\n".'$data["'.str_replace('.', '', str_replace(' ', '_', $s)).'"]'."=".'"'.$s.'";'."\n");
	}else
	{
		echo $r;
	}


}

error_reporting(0);
session_start();
require_once('test.php');
if($_GET['live'])
{
$_SESSION['live']=$_GET['live'];
}
if($_SESSION['live']!='1')
{
echo "Our editor is under construction, please come back soon!";
exit();
}

require_once '../app/Mage.php';
Mage::init();
	require(Mage::getBaseDir().'/Nano/phpip2country.class.php');
	
	/**
	 * Newest data (SQL) avaliable on project website
	 * @link http://code.google.com/p/php-ip-2-country/ 
	 */
	$dbConfigArray = array(
		'host' => 'localhost', //example host name
		'port' => 3306, //3306 -default mysql port number
		'dbName' => 'mike_ips', //example db name
		'dbUserName' => 'mike_ips', //example user name
		'dbUserPassword' => '123123', //example user password
		'tableName' => 'ip_to_country', //example table name
	);
	if(!Mage::getSingleton('core/session')->getMyValue())
	{
		$phpIp2Country = new phpIp2Country($_SERVER['REMOTE_ADDR'],$dbConfigArray);    	

		$c=strtoupper($phpIp2Country->getInfo(IP_COUNTRY_ISO));		
		Mage::getSingleton('core/session')->setMyValue($c);
	}
	$c=strtoupper(Mage::getSingleton('core/session')->getMyValue());
?>
<html>
<head>
	<title><?php toLang('PDF Creator',$lang); ?> </title>
	<meta http-equiv="X-UA-Compatible" content="ie=8;chrome=1">
<link rel="stylesheet" href="css/win8/jqueryui.css"/>
<link rel="stylesheet" href="css/jqdlg.css"/>
<script src="js/jq.js"></script>
<script src="js/jqdlg.js"></script>
<script src="js/jqueryui.js"></script>

    <script src="js/jquery.Jcrop.js" type="text/javascript"></script>
    <link rel="stylesheet" href="css/jquery.Jcrop.css" type="text/css" />
<script src="lib/luk.js"></script>
<script type="text/javascript" src="js/jw.js"></script>
<script type="text/javascript" src="yep.js"></script>
<script src="html5slider.js"></script>
<script src="jquery.inputNumber.js"></script>
<link rel="stylesheet" href="inputNumber.css">
<script src="jquery.mousewheel.js"></script>
<?php	
include($_SERVER['DOCUMENT_ROOT'].'/lang/lang.'.$c.'.php');
if(!isset($lang))
{
	include($_SERVER['DOCUMENT_ROOT'].'/lang/lang.NL.php');
}

if(!$_GET['v'])
{
$_GET['v']='4.07';
}
class Config
{
    public $maxupload=10;
	public $maxsizeupload=512;
	public $maxpdfsize=10000;
	public $maxpdfslot=5;
}

if($_GET['template'])
{
$_SESSION['template']=$_GET['template'];
Mage::getSingleton('core/session')->setMyCustomData($_GET['template']);
}else
{
	if($_SESSION['template'])
	{
		$_GET['template']=$_SESSION['template'];
	}
}

if ($_GET['session']) {
			$ses=explode('|',base64_decode($_GET['session']));
            $userid = $ses[0];
            $cs = Mage::getModel('customer/customer')->load($userid);
            Mage::getSingleton('core/session')->setPage('editor');          	

            $username = $ses[1];;            
        } else {
        	if($_GET['guest'])
        	{
        		$guest=true;
        		$userid='guest';
        		$username='guest';
				
        	}else
        	{

				$_SESSION['page']='editor';
				Mage::getSingleton('core/session')->setPage('editor');          	
            	header ('location:../customer/account/login');
            	
        	}

        }
$orders = Mage::getResourceModel('sales/order_collection')
    ->addFieldToSelect('*')
    ->addFieldToFilter('customer_id', $userid);

foreach ($orders as $order) {
	# code...
	if($order->status=='complete')
	{
		$items=$order->getAllItems();
		foreach ($items as $item){
			
			$model = Mage::getModel('catalog/product'); //getting product model
 			$_product = $model->load($item->getProductId()); //gett			
 			if( $_product->getName()=='Upgrade (50MB)' )
 			{
 				$paket='50mb';
 			}
		}
	}
	
};
if(empty($paket))
{
	$paket='default';
}
	$config = Mage::getModel('a/config')->getCollection()
	->addFilter('name', $paket);
	if($config)
	{
	$myconfig=$config->getFirstItem();
	}else
	{
		$myconfig=new Config();
	}
	
	


?>
<script type="text/javascript">
	var maxsizeerr='<?php toLang("Maximum files reached. Please delete one or more files",$lang); ?>';
	var filetolargeerr='<?php toLang("Sorry... this file is too large. Maximum file size is",$lang); ?>';
	var registermsg='<?php toLang("Please register first for save",$lang); ?>';
	var registerforupload='<?php toLang("Please register first for uploading",$lang); ?>';
	var registerforopen='<?php toLang("Please register first for open",$lang); ?>';
	var registerforsave='<?php toLang("Please register first for save data",$lang); ?>';
	var maxfilereach='<?php toLang("Maximum files reached. Please delete one or more files",$lang); ?>';
	var nofile='<?php toLang("No Saved File Found",$lang); ?>';
	var areyousure='<?php toLang("Are you sure?",$lang); ?>';
	var areyousuresave='<?php toLang("Warning! If you close this page your none saved data will be lost.",$lang); ?>';
	var filenamemsg='<?php toLang("enter file name",$lang); ?>';

</script>
<?php
function owned($e,$userid)
{
$ar=explode('-',$e);
if($ar[0]=='uid'.$userid)
{
	return true;
}

}
function general($e)
{

if(strpos('xx'.$e,'uid')!=2)
{
return true;
}

}
if ($handle = opendir('fonts')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && strpos($entry,".js") > 0 && owned($entry,$userid) ) {						
		
            echo "<script src='fonts/$entry'></script>\n";
        }else
        if ($entry != "." && $entry != ".." && strpos($entry,".js") > 0 && general($entry) ) {						
            echo "<script src='fonts/$entry'></script>\n";
        }
		
    }


    closedir($handle);
}
?>
<style>
	.row{
		position:relative;
		width:300px;
		height:50px;
		clear:both;		
		padding:5px;
		
	}
	.colom{
		float:left;		
		padding:2px;
	}
	.name{
		font-weight:bold;
	}
	.label{
		
		vertical-align:middle;
	}
	.gui input[type=number]{
		width:50px;
	}
	.gui div
	{
		vertical-align:middle;
		
	}
</style>
</style>
<?php
	echo "<style>";
			$ttfInfo = new ttfInfo; 
if ($handle = opendir('fonts')) {

    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && strpos($entry,".ttf") > 0 && owned($entry,$userid) ) {						
		$x=str_replace('.ttf', '', $entry);
        	$font=str_replace('uid'.$userid.'-','',$x);
$ttfInfo->setFontFile('fonts/'.$entry); 
    // dump the info 
    $a=$ttfInfo->getFontInfo();			
	if($a[1])
	{
		$font=$a[1];
	}
            echo "@font-face {
	font-family: '$font';	
	src: 
	     url('fonts/$entry')  format('truetype')	     
	}";
        }else
if ($entry != "." && $entry != ".." && strpos($entry,".ttf") > 0 && general($entry) ) {						
$x=str_replace('.ttf', '', $entry);
        	$font=str_replace('uid'.$userid.'-','',$x);
            echo "@font-face {
	font-family: '$font';	
	src: 
	     url('fonts/$entry')  format('truetype')	     
	}";
        }		
    }
    
    closedir($handle);
}
if ($handle = opendir('fonts')) {

    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && strpos($entry,".otf") > 0 && owned($entry,$userid)) {						
$x=str_replace('.ttf', '', $entry);
        	$font=str_replace('uid'.$userid.'-','',$x);
            echo "@font-face {
	font-family: '$font';	
	src: 
	     url('fonts/$entry')  format('truetype')	     
	}";
        }else
        if ($entry != "." && $entry != ".." && strpos($entry,".otf") > 0 && general($entry)) {						
        	$font=str_replace('.otf', '',$entry);        	
            echo "@font-face {
	font-family: '$font';	
	src: 
	     url('fonts/$entry')  format('truetype')	     
	}";
        }		
    }
    
    closedir($handle);
}

echo "</style>";
?>
<script type="text/javascript" src="js/cycle.js"></script>
<link rel="stylesheet" type="text/css" href="uploadifive.css">
<script src="jquery.uploadifive-v1.0.js" type="text/javascript"></script>

<script type="text/javascript">
// <![CDATA[
$(document).ready(function() {
     
});
// ]]>
</script>
<link rel="stylesheet" href="css/colorpicker.css" type="text/css"/>
<link rel="stylesheet" media="screen" type="text/css" href="css/layout.css"/>
<script type="text/javascript" src="js/colorpicker.js"></script>
<script type="text/javascript" src="js/eye.js"></script>
<script type="text/javascript" src="js/utils.js"></script>
<script type="text/javascript" src="js/layout.js?ver=1.0.2"></script>
<link rel="stylesheet" href="main.css?s<?php echo $_GET['v']; ?>"/>
<style>
  .uploadify-button {
        background-color: transparent;
        border: none;
        padding: 0;
    }
    .uploadify:hover .uploadify-button {
        background-color: transparent;
    }	
    .demo {margin-left: 40px;}
    .demo img{height: 100px;}   
	.column { width: 170px; float: left; padding-bottom: 100px;}
	.portlet { margin: 0px 1em 1em 0; }
	.portlet-header { margin: 0.3em; padding-bottom: 4px; padding-left: 0.2em; }
	.portlet-header .ui-icon { float: right; }
	.portlet-content { padding: 0.4em; }
	.ui-sortable-placeholder { border: 1px dotted black; visibility: visible !important; height: 50px !important; }
	.ui-sortable-placeholder * { visibility: hidden; }
</style>
<script>
var needToConfirm = true;
	$(function() {
		$( "#top_right_menus button" ).button({icons:{primary:"ui-icon-circle-arrow-n"}            
            }).next().button({icons:{primary:"ui-icon-heart"} 
            }).next().button({icons:{primary:"ui-icon-trash"} 
            }).next().button({icons:{primary:"ui-icon ui-icon-arrowreturnthick-1-w"}
            }).next().button({icons:{primary:"ui-icon ui-icon-arrowreturnthick-1-e"}	
            });
	});
</script>
<script>
	$(function() {
        $( "#accordion img" ).draggable({
			appendTo: "body",
			helper: "clone",
            revert:"true"
		});
		$( "#accordion li.txt span" ).draggable({
					appendTo: "body",
					helper: "clone",
					revert:"true"
				});						
    });
</script>
<script>
	$(function() {
		$( "#footer_menu ul li" ).button({icons:{primary:"ui-icon-zoomin"},text:false}).next().button({icons:{primary:"ui-icon-zoomout"},text:false});
	});
</script>
<script>
	$(function() {
		$( ".column" ).sortable({
			connectWith: ".column"
		});
		$( ".portlet" ).addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
			.find( ".portlet-header" )
				.addClass( "ui-widget-header ui-corner-all" )
				.prepend( "<span class='ui-icon ui-icon-minusthick'></span>")
				.end()
			.find( ".portlet-content" );
		$( ".portlet-header .ui-icon" ).click(function() {
			$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
			$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
		});
		$( ".column" ).disableSelection();
	});
	</script>
<!--[if lt IE 9]>
      <script src="lib/excanvas.js"></script>
    <![endif]-->
<script>
      // polyfill by @paulirish
      if (!window.requestAnimationFrame ) {
        window.requestAnimationFrame = (function() {
          return window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
          };
        })();
      }
    </script>
</head>
<body>
	<div class="modal"></div>
<script src="js/Delicious_500.font.js"></script>

<div id="wait" style="z-index:1000;position:absolute; left:0px;top:0px;width:100%;height:100%;background:#fff;">
	<div style="position:absolute;
    top:40%;
    
    margin-left:-250px;
    width:500px;left:50%;" >
		<center><h2 id="msg" style="color:#888; font-size:10px;"><?php toLang('Starting online PDF Creator',$lang); ?></h2><img src='images/load.gif'></center>
	
	</div>
</div>

<div id="wrapper" >
	<!-- begin header-->
				<!--
	<div class='topmenu' style='position:absolute;left:50%;width:300px;margin-left:-150px;top:20px;z-index:999' >

			<button id='letter' class='btnactive'><?php toLang('Letterhead',$lang); ?></button>
			<button id='card'><?php toLang("business card",$lang); ?></button>
			<button id='amplop'><?php toLang("envelop",$lang); ?></button>		
			
	</div>	
-->
	<div id="headexr" style='position:relative;'>
		<div id="top_right_menus" style='margin-left:10px;'>			
			<button id='savetocloud'><?php toLang("Save",$lang); ?></button>
			<button id='mfile'><?php toLang("My Files",$lang); ?></button>
			<button id='clear'><?php toLang("Clear",$lang); ?></button>			
			
			
			<button id="undo" style='width:30px;'>&nbsp;</button>			
			<button id="redo" style='width:30px;'>&nbsp;</button>	

		</div>
		
		<div style='position:absolute;right:5px;top:10px;z-index:999'>
		<a href='/index.php'><button id='p1'><?php toLang("Letter head",$lang); ?></button></a>
		<a href='/index.php'><button id='p2'><?php toLang("Business cart",$lang); ?></button></a>
		<a href='/index.php'><button id='back'><?php toLang("Back To Templates",$lang); ?></button></a>
		
		<button id='setpdf'><?php toLang("Print PDF (vector)",$lang); ?></button>
		

		</div>
	</div>
	<!-- end header-->
	<!-- content-->
	<div id="content">
		<div id="left_content" style="position:relative">
			<div id="accordionResizer" style="padding:10px; width:180px; height:600px;">
				<div id="accordion">
					<h3 style=""><a href="#"><?php toLang("My Logo & Pictures",$lang); ?></a></h3>
					<div class='obj'>
						<button id='upload' style='margin-left:15px;'><?php toLang("Upload",$lang); ?></button>
						<ul id='store' style="margin-left:-40px">

							
						</ul>
						
					</div>					
				
					<h3 style=""><a href="#"><?php toLang("Vector Objects",$lang); ?></a></h3>
					<div class='obj'>
						<ul style="margin-left:-50px">														
<?php
if ($handle = opendir('freesvg')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && strpos($entry,".svg") > 0 ) {						
            echo "<li ><img src='freesvg/$entry' source='freesvg/$entry' type='svg' width=110 height=auto /></li>";
        }
    }
    closedir($handle);
}
?>

						</ul>
					</div>
				
					<h3 style=""><a href="#"><?php toLang("Basic Shapes",$lang); ?></a></h3>
					<div class='shapes'>
							
							<li style='height:80px;width:110px' ><img src='asset/linehor.svg' source='asset/linehor.svg' type='svg' pack="line" width=110  /></li>																			
							<li style='height:115px;width:110px'><img src='asset/rect1.svg' source='asset/rect1.svg' type='rect' width=110 /></li>
							<li style='height:110px;width:110px' ><img src='asset/circle.svg' source='asset/circle.svg' type='circle' width=110 /></li>
							<li style='height:90px' ><img src='asset/triangle.svg' source='asset/triangle.svg' type='triangle' width=110 /></li>
							


					</div>

					<h3 style=""><a href="#"><?php toLang("Text & Fonts",$lang); ?></a></h3>
					<div class='text'>
						<button id='uploadfont' style='margin-left:15px;'><?php toLang("UploadTTF",$lang); ?></button>					
						<h4 style=""><a href="#"><?php toLang("My Font",$lang);?> </a></h4>
<ul id='userfont' style="margin-left:-40px">

							
						</ul>									
						<h4 style=""><a href="#"><?php toLang("Standart Font",$lang);?></a></h4>						
						 <ul style="margin-left:-50px">
							

<?php
if ($handle = opendir('fonts')) {
    while (false !== ($entry = readdir($handle))) {
	
        if ($entry != "." && $entry != ".." && strpos($entry,".ttf") > 0 && strpos("xx".$entry,"uid")!=2) {						
            $font=str_replace('.ttf', '', $entry);
            $x=explode(' ', $font);
            $fs=15;
            echo "<li class='txt' ><span data-val='$font' type='text' class='txt text' style='font-size:$fs"."px;font-family:$font;'>$font</span></li>";
        }
    }
    closedir($handle);
}
?>
<?php
if ($handle = opendir('fonts')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && strpos($entry,".otf") > 0 && strpos("xx".$entry,"uid")!=2) {						
            $font=str_replace('.otf', '', $entry);
            $x=explode(' ', $font);
            $fs=25-(sizeof($x)*5);

            echo "<li class='txt' ><span data-val='$font' class='txt text' type='text' style='font-size:$fs"."px;font-family:$font;'>$font</span></li>";
        }
    }
    closedir($handle);
}
?>

						</ul>

					</div>
					<h3 style=""><a href="#"><?php toLang("Export & Import",$lang); ?></a></h3>
					<div class='advanced'>
						<button id='save'><?php toLang("Export File",$lang); ?></button><br/>
						<button id='openx'><?php toLang("Import File",$lang); ?></button><br/>
						<button id='preview'><?php toLang("To Png",$lang); ?></button><br/>	
						<!--<button id='preview2'><?php toLang("To TIFF",$lang); ?></button><br/>	-->
					</div>

				</div>
			</div>
		
			<div id="canvas">
				<div style='position:relative'>
					<div style='position:absolute;left:20px;top:0px;padding:5px;' id='page'>
					
					</div>
				
					<div id="status"></div>
				<div id="groption" style='display:none;width:200px;position:fixed;top:100px;right:100px;'>
					<div class="portlet">
						<div class="portlet-header">
							 <?php toLang("Objects",$lang); ?>
						</div>
						<div class="portlet-content">							
							<table>
								<tr>
									<td>
										<span class="title"><?php toLang("Align",$lang); ?> </span>
									</td>									
								</tr>

								<tr>
									<td>
										<table width="210px">
											<tr>
												<td width="30%">
													<a class='alink' id="objleft"><img src='images/objleft.jpg'/></a>

												</td>
												<td width="30%">
													<a class='alink' id="objcenter"><img src='images/objcenter.jpg'/></a>

												</td>
												<td width="30%">
													<a class='alink' id="objright"><img src='images/objright.jpg'/></a>

												</td>

											</tr>												
										</table>										
									</td>
								</tr>
								<tr>
									<td>
										<strong><?php toLang("Distribute",$lang); ?> </strong><br/>
										<table>
										<tr>
										<td width="40">
										<a href="#" id="samespace"><img src='images/same_space.jpg' /></a>
										</td>
										<td>
											<?php toLang("Same space between",$lang); ?>
										</td>
										</tr>
										<tr>
										<td width="40">
										<a href="#" id="samespaceH"><img src='images/same_obj.jpg' /></a>
										</td>
										<td>
											<?php toLang("all selected objects",$lang); ?>
										</td>
										</tr>										
										</table>
									</td>
								</tr>												

								<tr>
									<td class="break"></td>
								</tr>
							</table>
						</div>	
					</div>
				</div>		
				
				<div id="textoption">
					<div class="portlet">
						<div class="portlet-header">
							 <?php toLang("Edit Text",$lang); ?>
						</div>
						<div class="portlet-content">							
							<table>

								<tr>
									<td>
										<table width="210px">
											<tr>
												<td width="60%">
													<select id='font' style='width:100%'></select>
												</td>
												<td width="40%">
													<div class="label">
														<input type="number" value="11" class="fontsize" title="fontSize"/>
													</div>
													<div class="label">
														pt
													</div>
												</td>
											</tr>												
										</table>										
									</td>
								</tr>
								<tr>
									<td>
										<textarea id='txt' style='width:210px;height:75px;'></textarea>
									</td>
								</tr>												

								<tr>
									<td>
										<table width="210px">
											<tr>
												<td>
													<div id="colorSelector" style='margin-left:45px;'>
														<div id="textcolor" style="background-color: #000000;">
														</div>
													</div>	
												</td>						
												<td>
													<div id="colorSelector" style='margin-left:15px;'>
														<div class="bgborder" style="background-color: #ffffff;">
														</div>
													</div>
												</td>
												<td>
													<input type="number" step="1" title="strokeWidth" value='1' min="0" class='strokeWidth label'>
													<div class="label">
													pt
													</div>													

												</td>												
											</tr>
										</table>
									</td>
								</tr>
						
								<tr>
									<td>					
													<div id="font_fmt2">									
															
															<button id='fonti' style='height:30px;background:url("images/italic.ico") center no-repeat;margin-right:5px;'></button>															
															<button id='fontu' style='height:30px;background:url("images/underline.ico") center no-repeat;margin-right:5px;'></button>
															<button id='fonts' style='height:30px;background:url("images/shadow.ico") center no-repeat; margin-right:5px;'></button>
															
													</div>	
									</td>
								</tr>								
								<tr>
								<td>
													<div id="font_fmt">									
															<button id='fontla'  style='height:30px;background:url("images/left.ico") center no-repeat;' ></button>
															<button id='fontca' style='height:30px;background:url("images/center.ico") center no-repeat;' ></button>
															<button id='fontra' style='height:30px;background:url("images/right.ico") center no-repeat;' ></button>
															<img src="images/format-line-distance-2.ico"><input type="number" step="0.1" title="lineHeight" value='0' class='lineHeight label' style='margin-top:-20px'>
													</div>		
								</td>
								</tr>																
							
								<tr>
									<td class="break"></td>
								</tr>
								<tr>
									<td>
										<span class="title"><?php toLang("position (mm)",$lang); ?> </span>
									</td>									
								</tr>
								<tr>
									<td>
										<table width="220px">
											<tr>
												<td>
													<div class="label">
														X:
													</div>
													<input type="number" step="1" title="left" value='0' class='left label'>
												</td>
												<td>
													<div class="label">
														Y:
													</div>													
													<input type="number" step="1" title="top" value='0' class='top label'>
												</td>
												<td>
													<a class="alink btf label">
														<img src="images/btf.png"/>
													</a>													
												</td>
												<td>
													<a class="alink stb label">
														<img src="images/stb.png"/>
													</a>
													
												</td>
												
											</tr>												
										</table>
									</td>
								</tr>
								
								<tr>
									<td class="break"></td>
								</tr>
								<tr>
									<td>		
										<span class="title"><?php toLang("rotate",$lang); ?>  </span>
										<table width="200px">
											<tr>
												<td width="50%">
													<input type="number" step="1" title="angle" value='0' min=0 max=360 class='rotate label'>
													<div class="label">
													<?php toLang("deg",$lang); ?>
													</div>													

												</td>
												<td width="50%">
													<input type="range" step="1" title="angle" value='0' min=0 max=360 class='rotate'>
												</td>
											</tr>												
										</table>
										
									</td>
								</tr>								
								<tr>
									<td class="break">																				
									</td>
								</tr>
								<tr>
									<td>		
										<span class="title"><?php toLang("transparancy",$lang); ?> </span>
										<table width="200px">
											<tr>
												<td width="50%">
													<input type="number" step="1" title="opacity" min=0 max=100 value='100' class='opacity label'  >
													<div class="label">
														%
													</div>													

												</td>
												<td width="50%">
													<input type="range" step="1" title="opacity" min=0 max=100 value='100' class='opacity'>
												</td>
											</tr>												
										</table>
										
									</td>
								</tr>								
							</table>
						</div>
					</div>
				</div>				

				<div id="imgoption">
					<div class="portlet">
						<div class="portlet-header">
							 <?php toLang("Edit Image",$lang); ?>
						</div>
						<div class="portlet-content">							
							<table>
								<tr>
									<td>
										<span class="title"><?php toLang("position (mm)",$lang); ?> </span>
									</td>									
								</tr>
								<tr>
									<td>
										<table width="150px">
											<tr>
												<td>
													<div class="label">
														X:
													</div>
													<input type="number" step="1" title="left" value='0' class='left label'>
												</td>
												<td>
													<div class="label">
														Y:
													</div>													
													<input type="number" step="1" title="top" value='0' class='top label'>
												</td>
											</tr>												
										</table>
									</td>
								</tr>
								<tr>
									<td class="break"></td>
								</tr>
								<tr>
									<td>										
										<table width="220px">
											<tr>
												<td>
													<a class="alink btf label">
														<img src="images/btf.png"/>
													</a>
													<span class="label"><?php toLang("Forward",$lang); ?></span>
												</td>
												<td>
													<a class="alink stb label">
														<img src="images/stb.png"/>
													</a>
													<span class="label"><?php toLang("Backward",$lang); ?></span>
												</td>

											</tr>												
										</table>

									</td>
								</tr>								
								<tr>
									<td class="break"></td>
								</tr>
								<tr>
									<td>										
										<span class="title"><?php toLang("size (mm)",$lang); ?> </span>
										<table width="180px">
											<tr>
												<td>
													<div class="label">
														W:
													</div>
													<input type="number" step="1" title="width" value='0' class='width label'>
												</td>
												<td>
													<div class="label">
														H:
													</div>												
													<div class="label">	
														<input type="number" step="1" title="height" value='0' class='height label' >
													</div>
													<div class="label" style="width:20px;">
														<a class="alink lock" class="lock" data-val='lock'>
															<img src="images/lock.png">
														</a>														
													</div>
												</td>
												
											</tr>												
										</table>
										
									</td>
								</tr>								
								<tr>
									<td class="break"></td>
								</tr>
								<tr>
									<td>		
										<span class="title"><?php toLang("rotate",$lang); ?>  </span>
										<table width="200px">
											<tr>
												<td width="50%">
													<input type="number" step="1" title="angle" value='0' min=0 max=360 class='rotate label'>
													<div class="label">
													<?php toLang("deg",$lang); ?>
													</div>													

												</td>
												<td width="50%">
													<input type="range" step="1" title="angle" value='0' min=0 max=360 class='rotate'>
												</td>
											</tr>												
										</table>
										
									</td>
								</tr>								
								<tr>
									<td class="break">																				
									</td>
								</tr>
								<tr>
									<td>		
										<span class="title"><?php toLang("transparancy",$lang); ?> </span>
										<table width="200px">
											<tr>
												<td width="50%">
													<input type="number" step="1" title="opacity" min=0 max=100 value='100' class='opacity label'  >
													<div class="label">
														%
													</div>													

												</td>
												<td width="50%">
													<input type="range" step="1" title="opacity" min=0 max=100 value='100' class='opacity'>
												</td>
											</tr>												
										</table>
										
									</td>
								</tr>								
							</table>
						</div>
					</div>
				</div>

				<div id="objoption">
					<div class="portlet">
						<div class="portlet-header">
							 <?php toLang("Edit Shapes",$lang); ?>
						</div>
						<div class="portlet-content">							
							<div class="row" style='height:60px;'>
								<div class="colom" style='width:150px;'>
									<div class="name"><?php toLang("border",$lang); ?></div>		
									<div class="gui">
										<div class="colom" >
											<div id="colorSelector">
												<div class="bgborder" style="background-color: #ffffff;">
												</div>
											</div>		
										</div>
										<div class="colom">
											<input type="number" step="0.1" title="strokeWidth" value='0' class='strokeWidth label'>
											<div class="label">
												pt
											</div>			
										</div>
									</div>
								</div>
								
								<div class="colom fullshape1">
									<div class="name"><?php toLang("fill",$lang); ?></div>
									<div class="gui">
										<div id="colorSelector">
											<div class="bgcolor" style="background-color: #ffffff;">
											</div>
										</div>		
									</div>
								</div>		
							</div>	
							<div class="break"></div>
							<div class="row fullshape2" style='height:40px'>
								<div class="name"><?php toLang("corner roundness",$lang); ?></div>
								<div class="gui">
									<input type="number" step="3" title="rx" value='0' min=0 max=100 class='rx label'>											
									<span class="label"></span>	
								</div>	
							</div>
							
							<div class="row" >
								<div class="name"><?php toLang("position (mm)",$lang); ?></div>
								<div class="gui">
									<div class="colom">
										<div class="label">
										X:
										</div>
										<input type="number" step="1" title="left" value='0' class='left label'>
									</div>
									<div class="colom">
										<div class="label">
										Y:
										</div>
										<input type="number" step="1" title="top" value='0' class='top label'>
									</div>
									<div class="colom">
										<a class="alink btf label">
											<img src="images/btf.png"/>
										</a>
										
									</div>
									<div class="colom">
										<a class="alink stb label">
											<img src="images/stb.png"/>
										</a>
										
									</div>
									
								</div>
							</div>
							<div class="break"></div>
							<div class="row" >
								<div class="name"><?php toLang("size(mm)",$lang); ?></div>
								<div class="gui">
									<div class="colom">
										<div class="label">
											W:
										</div>
										<input type="number" step="1" title="width" value='0' class='width label'>			
									</div>
									<div class="colom">
										<div class="label">
											H:
										</div>												
										<div class="label">	
											<input type="number" step="1" title="height" value='0' class='height label' >
										</div>			
									</div>
									<div class="colom">
										<div class="label" style="width:20px;">
											<a class="alink lock" class="lock" data-val='lock' style='margin-top:15px;'>
												<img src="images/lock.png">
											</a>
										</div>			
									</div>				
								</div>
							</div>
							<div class="break"></div>
							<div class="row" >
								<div class="name"><?php toLang("rotate",$lang); ?></div>
								<div class="gui">
									<div class="colom" style='width:80px;'>
										<input type="number" step="1" title="angle" value='0' min=0 max=360 class='rotate label'>
										<div class="label">
											<?php toLang("deg",$lang); ?>
										</div>															
									</div>			
									<div class="colom">
										<input type="range" step="1" title="angle" value='0' min=0 max=360 class='rotate'>
									</div>		
								</div>
							</div>
							<div class="break"></div>
							<div class="row" >
								<div class="name"><?php toLang("transparancy",$lang); ?></div>
								<div class="gui">
									<div class="colom" style='width:80px;'>
										<input type="number" step="1" title="opacity" min=0 max=100 value='100' class='opacity label'  >
										<div class="label">
											%
										</div>															
									</div>			
									<div class="colom">
										<input type="range" step="1" title="opacity" min=0 max=100 value='100' class='opacity'>
									</div>		
								</div>
							</div>
							
							
						</div>
					</div>
				</div>

			</div>
				
			</div>			
		</div>
		<!--end right content-->
	</div>
	<!-- end content-->
	<!-- bottom -->
	<div id="bottom" style='position:relative'>
		<div id="footer">
			<div id="footer_menu">
				<ul>
					<li id='zoomin'><?php toLang("in",$lang); ?></li>
					<li id="zoomout"><?php toLang("out",$lang); ?></li>
				</ul>
			</div>
		</div>
		<div id="ceckbox">
		
			<input type="checkbox" id="ali" checked="checked" /><span><?php toLang("Show Alignment",$lang); ?></span>
		
			<input id='smargin' type="checkbox" style='margin-left:25px;'/><span><?php toLang("Show Margin(3mm)",$lang); ?></span>
				<input type="checkbox" id="grid"/><span><?php toLang("Show Grid",$lang); ?></span>
		</div>
		<div class='rightbottom' style="position:absolute;right:10px;top:0px;">
			<span style='font-size:13px;margin-top:-5px;'><?php echo toLang("Welcome",$lang)."<a target='_blank' href='account.php' style='color:#000;'><button>$username</button>"; ?></a></span>&nbsp;&nbsp;&nbsp;&nbsp;
		<a href='../customer/account/logout'><button id=''><?php if($_GET['guest']){echo 'Login';}else{echo toLang("Logout",$lang); } ?></button></a>
		</div>
		
	</div>
	<!--end bottom-->
</div>
<div id="controls">
</div>
<div id="dialog-save" title="<?php toLang("Wait",$lang);?>">
	<p>
		<span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>
		<?php toLang("Your page saved successfully",$lang); ?>
	</p>
</div>
<div id="dialog-open" title="<?php toLang("Open Data",$lang);?>" style='width:300px;height:200px;overflow:auto;'>
	<p>		
	</p>
</div>
<div id="openxmldlg" title="<?php toLang("Open Saved XML",$lang);?>" style='width:300px;height:200px;overflow:auto;'>
	<p>		
		<input id="xmlload" name="file_upload" type="file" multiple="true" accept="image/*,application/pdf">
	</p>
	<div id='lbl'></div>
</div>
<div id="myfiledlg" title="<?php toLang("My Files",$lang);?>" style='width:500px;height:500px;overflow:auto;'>
		<div id='lists'></div><br>
		<strong style='font-family:verdana;font-size:12px;'><?php toLang("Your maximum slot is",$lang).' '.$myconfig->maxpdfslot.' '.toLang("files",$lang); ?></strong><br/>
		<?php if($paket=='default') { ?>
		<!--<a href='/upgrade-50mb.html' target='_blank'><button><?php toLang("upgrade your space to 50MB only $5",$lang); ?></button></a>-->
		<?php } ?>
</div>

<div id="dialog-upload" title="<?php toLang("My Logo & Pictures",$lang);?>" style='overflow:hidden'>
	<div style='position:relative;overflow:hidden'>	
		<div style='position:absolute;left:0px;top:0px;width:100%;z-index:1000' id='sos'>
		</div>
		<div style='height:294px;'>
		<div class='xhr'  data="myfile.php" style='height:294px;overflow-y:auto;overflow-x:hidden;width:851px'>
		<div style="position:relative;width:auto;height:1000px;" id="xhrcon">
			<ul  ></ul>			
			</div>
		</div>
		</div>
		<div style='height:50px;width:100%;position:relative;'>
			<div style='position:absolute;right:5px;top:0px;'>				
				
				<div style='float:left;'>
				<input id="file_upload" name="file_upload" type="file" multiple="true">
			</div>
			<div style='float:left;'>
				<input type='button' id='upload_done'>
			</div>
			</div>
		</div>
				
		
		
	</div>
</div>
<div id="dialog-upload-font" title="My Font" style='overflow:hidden'>
	<div style='position:relative;overflow:hidden'>	
		<div style='position:absolute;left:0px;top:0px;width:100%;z-index:1000' id='sosfont'>
		</div>
		<div style='height:294px;'>
		<div class="xhr" data="myfile.php" style="height:294px;overflow-y:auto;overflow-x:hidden;width:851px">


		<div style="position:relative;width:auto;height:1000px;" id="xhrfont">
			<ul></ul>			
			</div>
		</div>
		</div>
		<div style='height:50px;width:100%;position:relative;'>
			<div style='position:absolute;right:5px;top:0px;'>				
				
				<div style='float:left;'>
				<input id="file_upload_font" name="file_upload" type="file" multiple="true" >
			</div>
			<div style='float:left;'>
				<input type='button' id='upload_done_font'>
			</div>
			</div>
		</div>
				
		
		
	</div>
</div>
<div id="dialog-pdf" title="<?php toLang("Export to Pdf Successfull!",$lang);?>" style='width:300px;height:100px;overflow:auto;'>
	<p>	
		<center><h2><a id="topdf" target='_blank'><?php toLang("Download",$lang); ?></a></h2></center>
		
	</p>
</div>
<div id='dcrop' title="<?php toLang("Croping Tool",$lang);?>" style='overflow:auto;'>
	<p id="concrop" style='align="center"'></p>
</div>
<input type="hidden" id="posx" value="" />
<input type="hidden" id="posy" value="" />
<script src="lib/centering_guidelines.js"></script>
<script src="lib/aligning_guidelines.js"></script>
<!--fucking-->

<script type="text/javascript">
//helllllllllllllllllllllow
 var userid='<?php echo $userid;?>';
 var email='<?php echo $cs->email; ?>';
 var maxupload=parseInt('<?php echo $myconfig->maxupload; ?>');
 var maxsizeupload=parseInt('<?php echo $myconfig->maxsizeupload; ?>')*1024;
 var maxpdfsize=parseInt('<?php echo $myconfig->maxpdfsize; ?>')*1024;
 var maxpdf=parseInt('<?php echo $myconfig->maxpdfslot; ?>');
 
</script>
<script src="app.js?x=<?php echo time(); ?>"></script>
<script>
var opens=1;
<?php

if($_GET['template'])
{

		$id=base64_decode($_GET['template']);
		$id=str_replace('tpl', '', $id);
	
		
		$pi = Mage::getModel('a/tpl')->getCollection();
	
		foreach ($pi as $tpl) {
			# code...
			if($tpl->id==$id)
			{
				$xml=$tpl->xml;
				
			}
		}
		?>
		$(document).ready(function(){
			$.get('doXML.php',{filename:'<?php echo "../media/".$xml; ?>'},function(data){
				jsonLoad('<?php echo str_replace("nano_a/","",$xml); ?>',data);
				saveexisting = 0;
				$('#wait').hide();
			});
		});
		<?php
				
	
}else
{
	echo 'opens=0;';
}
?>
var GF=false;	
</script>
  	<!--[if IE]> <![if !IE]> <![endif]-->
<script>
GF=true;
</script>
<!--[if IE]> <![endif]> <![endif]-->
<script>
function getInternetExplorerVersion()
// Returns the version of Windows Internet Explorer or a -1
// (indicating the use of another browser).
{
   var rv = -1; // Return value assumes failure.
   if (navigator.appName == 'Microsoft Internet Explorer')
   {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
         rv = parseFloat( RegExp.$1 );
   }
   return rv;
}


  window.onbeforeunload = confirmExit;
  function confirmExit()
  {
    if (needToConfirm)
      return "<?php toLang("Warning! If you close this page your none saved data will be lost.",$lang); ?>";
  }

      (function(){
		
      	$('#wrapper').fadeOut('fast').delay(2000).fadeIn(1000,function(){
		

			var isIe = !!window.ActiveXObject;
			if(isIe)
			{
				if(window.externalHost){
				$('#wait').fadeOut('slow');
				}else
				{
				needToConfirm=false;
				$('#msg').html("<?php toLang("Your Browser Not Support HTML5, you can ",$lang); ?><a href='http://www.google.com/chromeframe' ><?php toLang("download Chrome Frame Plugin",$lang); ?></a>");
				}
			}else
			{
				
					$('#wait').fadeOut('slow');
				
			}
		});
      	
      	
        var mainScriptEl = document.getElementById('main');
        if (!mainScriptEl) return;
        var el = document.createElement('pre');
        el.innerHTML = mainScriptEl.innerHTML;
        el.lang = 'javascript';
        el.className = 'prettyprint';
        document.getElementById('bd-wrapper').appendChild(el);
        prettyPrint();
      })();
    </script>


</body>
</html>
