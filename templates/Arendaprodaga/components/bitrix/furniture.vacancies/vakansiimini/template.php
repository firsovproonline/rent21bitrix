<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>
<ul>
<?
foreach ($arResult['ITEMS'] as $key=>$val):
?>
	<li class="point-faq"><a href="/vakansii/#<?=$val["ID"]?>"><?=$val['NAME']?></a></li>
<?
endforeach;
?>
</ul>