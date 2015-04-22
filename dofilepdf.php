<?php
error_reporting(0);
$name=base64_decode($_GET['data']);

$data=file_get_contents($name);
$data=str_replace('\"', '"', $data);
file_put_contents($name, $data);

set_time_limit(0);

require_once('tcpdf/config/lang/eng.php');
require_once('tcpdf/tcpdf.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
// set document information
$pdf->SetCreator(Fabreasy.com);
$pdf->SetAuthor('Fabreasy drag-and-drop');
$pdf->SetTitle('Letterhead PDF');
$pdf->SetSubject('www.fabreasy.com');
$pdf->SetKeywords('letterhead pdf,febreasy tool, drag and drop');

// remove default header/footer
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

//set margins
$pdf->SetMargins(0, 0, 0);

//set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

//set image scale factor
$pdf->setImageScale(6.37);


// ---------------------------------------------------------

// add a page
$pdf->AddPage();

// NOTE: Uncomment the following line to rasterize SVG image using the ImageMagick library.
//$pdf->setRasterizeVectorImages(true);
if($_GET['debug']==1)
{
echo $name.'='.file_get_contents($name);
}
$pdf->ImageSVG($file=$name, $x=0, $y=0, $w=2480, $h=3507, $align='', $palign='', $border=0, $fitonpage=false);
unlink($name);
mkdir("stock/users/".md5($_GET['email']));

$pdf->Output("stock/users/".md5($_GET['email']).'/'.$_GET['name'].'.pdf', 'F');


?>