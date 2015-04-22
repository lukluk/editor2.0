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
function doSVG($svg)
{

	$html=new simple_html_dom();
	$html->load(file_get_contents($svg));	
	$txt=$html->find('tspan');
	$n=0;
	$t=$txt[0]->parent->transform;
	$xy=getxy('translate',$t);
	
	$lh=floatval($txt[0]->parent->attr['lineheight']);	
	$fs=floatval($txt[0]->parent->attr['font-size']);
	$c=count($txt);

	$ly=0;
	foreach ($txt as $tx) {
		# text
		if($n==0)
		{
			$tx->y=$fs+2.5;
			$ly=$tx->y;
		}else
		{			
			$tx->y=$ly+($fs)+(($lh-1)*3);
			$ly=$tx->y;
		}
		//$tx->x=3;
		$n++;
	}
	//$txt[0]->parent->transform='translate('.-$fs.','.(-$ly).')';
	
	file_put_contents($svg, $html->innertext);

}

?>
