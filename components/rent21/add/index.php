<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Добавление обьявления");
?>
<? $APPLICATION->IncludeComponent(
"rent21:add",
".default",
Array(
),
false
);?>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>