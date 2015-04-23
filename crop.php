<?php
function file_newname($path, $filename){
    if ($pos = strrpos($filename, '.')) {
           $name = substr($filename, 0, $pos);
           $ext = substr($filename, $pos);
    } else {
           $name = $filename;
    }

    $newpath = $path.'/'.$filename;
    $newname = $filename;
    $counter = 0;
	$newname = $name .'_'. $counter . $ext;
	$newpath = $path.'/'.$newname;
	
    while (file_exists($newpath)) {
			$counter++;
			
           $newname = $name .'_'. $counter . $ext;
           $newpath = $path.'/'.$newname;
           
		   		
     }

    return $newname;
}
$filename = $_GET['src'];

$nfn=str_replace('store/','',$filename);
$nfn='store/'.file_newname('store',$nfn);
$png=false;
if((strpos(strtolower($filename),'jpg')>0) || (strpos(strtolower($filename),'jpeg')>0))
{
$image = imagecreatefromjpeg($_GET['src']);
}else
{
  $image = imagecreatefrompng($_GET['src']);
  $png=true;
  imagealphablending($image, true);
}



$width = imagesx($image);
$height = imagesy($image);
$dw=$width/floatval(700);
list($width, $height, $type, $attr) = getimagesize($_GET['src']);

$x=700/$width;
$h=$height*$x;
$dh=$height/floatval($h);

$thumb_width = ((intval($_GET['x2'])*$dw)-(intval($_GET['x'])*$dw));
$thumb_height = ((intval($_GET['y2'])*$dh)-(intval($_GET['y'])*$dh));

$thumb = imagecreatetruecolor( $thumb_width, $thumb_height );
if($png){
imagesavealpha($thumb, true);
imagealphablending($thumb, false);
$transparent = imagecolorallocatealpha($thumb, 0, 0, 0, 127);
imagefill($thumb, 0, 0, $transparent);

}
// Resize and crop
imagecopyresampled($thumb,
                   $image,
                   0,0,
                   (intval($_GET['x'])*$dw),
                   (intval($_GET['y'])*$dh),
                   $thumb_width,$thumb_height,
                   $thumb_width,$thumb_height);
unlink($filename);
if((strpos(strtolower($filename),'jpg')>0) || (strpos(strtolower($filename),'jpeg')>0))
{
  $ext='.jpg';
  
  imagejpeg($thumb, $nfn, 90);

}
if($png)
{
  $ext='.png';
  
  imagepng($thumb, $nfn, 9);
  
}

echo $nfn;
?>