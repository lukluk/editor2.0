<?php
require_once('simple_html_dom.php');
function getxy($name,$t)
{				
				$t=str_replace($name, '', $t);
				$t=str_replace('(', '', $t);
				$t=str_replace(')', '', $t);
				$pos=explode(' ', $t);	
				return array('x'=>floatval($pos[0]),'y'=>floatval($pos[1]) );
}
function dotext($pdf,$name)
{
	$ret=array();
	$html=new simple_html_dom();
	//echo file_get_contents($name);
	$html->load(file_get_contents($name));
	$tspan=$html->find('tspan');
	//echo $html->plaintext;
	foreach ($tspan as $span) {
		# code...
		$trans=$span->parent->parent->transform;				
		//echo $span->parent->parent->outertext;
		$tr=explode(') ', $trans);
		foreach ($tr as $t) {
			# code...
			if(strpos('x'.$t, 'translate')>0)
			{
				
				$trxy=getxy('translate',$t);								
				$text0=$span->parent->transform;
				$tr0xy=getxy('translate',$text0);
				$x0=$trxy['x']+$tr0xy['x']+2;
		//		echo $trxy['x'].'-'.$tr0xy['x'];
				$y0=$trxy['y']+$tr0xy['y']+2;
			}else
			if(strpos('x'.strtolower($t), 'rotate')>0)
			{
				$rotate=getxy('rotate',$t);
				$r=$rotate['x'];
			}
		}
		$html=$span->plaintext;				
		
		$pdf->SetFont(str_replace("'", "", $span->parent->attr['font-family']));
		$pdf->SetFontSize($span->parent->attr['font-size']);
		$pdf->StartTransform();
		$pdf->Rotate($r, 0, 0);
		$pdf->writeHTMLCell($w=0, $h=0, $x=$x0, $y=$y0, $html, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
		$pdf->StopTransform();
	}
	return $ret;
}

?>
