<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>
<div class="subscribe-form">
<form action="<?=$arResult["FORM_ACTION"]?>">

<?foreach($arResult["RUBRICS"] as $itemID => $itemValue):?>
	<div style="display:none;"><label for="sf_RUB_ID_<?=$itemValue["ID"]?>">
	<input type="checkbox" name="sf_RUB_ID[]" id="sf_RUB_ID_<?=$itemValue["ID"]?>" value="<?=$itemValue["ID"]?>"<?if($itemValue["CHECKED"]) echo " checked"?> /> <?=$itemValue["NAME"]?>
	</label><br /></div>
<?endforeach;?>

	<table border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td><input type="text" name="sf_EMAIL" size="20" value="<?=$arResult["EMAIL"]?>" title="<?=GetMessage("subscr_form_email_title")?>" class="subscrinp" /></td>
			<td align="right"><input type="submit" name="OK" value="Согласен" class="subscrbut"/></td> 
		</tr>
	</table>
</form>
</div>
