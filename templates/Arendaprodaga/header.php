<!DOCTYPE html>
<html>
 <head>
<?$APPLICATION->ShowHead();?>
<?CUtil::InitJSCore(Array("jquery"))?> 
<title><?$APPLICATION->ShowTitle()?></title>
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans:400,400italic,600,600italic,700,700italic|Playfair+Display:400,700&subset=latin,cyrillic">
    <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.css">
    <script src="//yastatic.net/jquery/3.3.1/jquery.min.js"></script>

<link rel="stylesheet" href="<?=SITE_TEMPLATE_PATH?>/js/custom-form-elements/custom-form-elements.css" type="text/css" media="screen"  charset="utf-8"/>
    <script src="//api-maps.yandex.ru/2.1/?apikey=fdb945b0-aaa5-4b5d-a837-383abb24dfc4&lang=ru_RU" type="text/javascript"></script>

<script src="//unpkg.com/vue/dist/vue.js"></script>
<script src="//unpkg.com/vue-router/dist/vue-router.js"></script>
<script src="//unpkg.com/vuex"></script>

 </head>
 <body>
<?$APPLICATION->ShowPanel()?> 	
<?
/*
if(!$_SESSION[RegionRedirect]){
	CModule::IncludeModule("statistic");
	$rzGuest = CGuest::GetByID($_SESSION[SESS_GUEST_ID]);
	$arGuest=$rzGuest->fetch();
	CModule::IncludeModule("iblock");
	$arSelect = Array("ID", "NAME","PROPERTY_REGION"); 
	$arFilter = Array("IBLOCK_ID"=>13, "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y","PROPERTY_REGION"=>$arGuest[REGION_NAME]);
	$res = CIBlockElement::GetList(Array(), $arFilter, false, false, $arSelect);
	if($ob = $res->GetNextElement())
	{
		$arFields = $ob->GetFields();
	 	$_SESSION[RegionRedirect]=$arFields[NAME];
			
	}else{
		$arFilter = Array("IBLOCK_ID"=>13, "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y","PROPERTY_REGION"=>"");
		$res = CIBlockElement::GetList(Array(), $arFilter, false, false, $arSelect);
		if($ob = $res->GetNextElement())
			{
				$arFields = $ob->GetFields();
	 			$_SESSION[RegionRedirect]=$arFields[NAME];
			}
	}
}

if($_SESSION[RegionRedirect]!=$_SERVER[HTTP_HOST]){
	LocalRedirect("http://".$_SESSION[RegionRedirect].$_SERVER[REQUEST_URI]);
}*/
?> 	
  <div id="container">  
   <div id="header">  
 	<div class="htop">
  		<div class="htopleft">
  			<a href="/" title="Главная страница" class="htopleft1"></a>
  			<a href="/obratnaya-svyaz/" title="Написать нам" class="htopleft2"></a>  
  			<a href="/karta-sayta/" title="Карта сайта" class="htopleft3"></a>
  		</div>
  		<div class="htopright">
  		<?$APPLICATION->IncludeComponent("bitrix:menu", "g_menu", array(
			"ROOT_MENU_TYPE" => "top",
			"MENU_CACHE_TYPE" => "N",
			"MENU_CACHE_TIME" => "3600",
			"MENU_CACHE_USE_GROUPS" => "Y",
			"MENU_CACHE_GET_VARS" => array(
			),
			"MAX_LEVEL" => "1",
			"CHILD_MENU_TYPE" => "left",
			"USE_EXT" => "N",
			"DELAY" => "N",
			"ALLOW_MULTI_SELECT" => "N"
			),
			false
		);?>
	</div>
  	</div>	
   	<div class="clear"></div>
	<div class="hbot">
		<div class="hbotleft">
			<div class="hbotlefttop">
				<?$APPLICATION->IncludeComponent("bitrix:main.include", ".default", array(
	"AREA_FILE_SHOW" => "file",
	"PATH" => "/include/logo.php",
	"EDIT_TEMPLATE" => ""
	),
	false
);?>
			</div>

		</div>
	</div>


   </div>

   <div id="content"> 
		<div class="contenttop">
			
	<?
	if($APPLICATION->GetDirProperty("filter")=="Y"){
	$APPLICATION->IncludeComponent("bitrix:main.include", ".default", array(
	"AREA_FILE_SHOW" => "file",
	"PATH" => "/include/search.php",
	"EDIT_TEMPLATE" => ""
	),
	false
);		
	}?>
		</div>
		<div class="contentworkarea" id="workarea">

