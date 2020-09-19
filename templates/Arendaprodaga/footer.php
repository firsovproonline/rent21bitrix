</div>
   </div>

   <div id="footer">
		<div class="footertop">
			<div class="footertopleft">
	<?$APPLICATION->IncludeComponent("bitrix:main.include", ".default", array(
	"AREA_FILE_SHOW" => "file",
	"PATH" => "/include/copyright.php",
	"EDIT_TEMPLATE" => ""
	),
	false
);?>
			</div>  
			<div class="footertopright">
					<?$APPLICATION->IncludeComponent("bitrix:main.include", ".default", array(
	"AREA_FILE_SHOW" => "file",
	"PATH" => "/include/subsc.php",
	"EDIT_TEMPLATE" => ""
	),
	false
);?>
						
						<?$APPLICATION->IncludeComponent("bitrix:subscribe.form", "subscr", Array(
	
	),
	false
);?>
			</div>
			<div class="footertopmid">
			<?$APPLICATION->IncludeComponent("bitrix:menu", "botmenu", Array(
	"ROOT_MENU_TYPE" => "bottom",	// Тип меню для первого уровня
	"MENU_CACHE_TYPE" => "N",	// Тип кеширования
	"MENU_CACHE_TIME" => "3600",	// Время кеширования (сек.)
	"MENU_CACHE_USE_GROUPS" => "Y",	// Учитывать права доступа
	"MENU_CACHE_GET_VARS" => "",	// Значимые переменные запроса
	"MAX_LEVEL" => "1",	// Уровень вложенности меню
	"CHILD_MENU_TYPE" => "left",	// Тип меню для остальных уровней
	"USE_EXT" => "N",	// Подключать файлы с именами вида .тип_меню.menu_ext.php
	"DELAY" => "N",	// Откладывать выполнение шаблона меню
	"ALLOW_MULTI_SELECT" => "N",	// Разрешить несколько активных пунктов одновременно
	),
	false
);?>
			<?$APPLICATION->IncludeComponent("bitrix:menu", "botmenu", array(
	"ROOT_MENU_TYPE" => "bottom1",
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
			<?$APPLICATION->IncludeComponent("bitrix:menu", "botmenu", array(
	"ROOT_MENU_TYPE" => "bottom2",
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
			<?$APPLICATION->IncludeComponent("bitrix:menu", "botmenu", array(
	"ROOT_MENU_TYPE" => "bottom3",
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
		<div class="footerbot">
			<div class="footerbotleft">
	<?$APPLICATION->IncludeComponent("bitrix:main.include", ".default", array(
	"AREA_FILE_SHOW" => "file",
	"PATH" => "/include/logo2.php",
	"EDIT_TEMPLATE" => ""
	),
	false
);?>
			</div>
			<div class="footerbotrihgt">
				<table cellpadding="0" cellspacing="0" border="0" class="banners3">
					<tr>
						<td>
				<?if(CModule::IncludeModule('advertising')):?>
				<?$APPLICATION->IncludeComponent("bitrix:advertising.banner", "lefttwo", array(
	"TYPE" => "BOTTOM",
	"NOINDEX" => "N",
	"CACHE_TYPE" => "A",
	"CACHE_TIME" => "0"
	),
	false
);?></td><td>
				<?$APPLICATION->IncludeComponent("bitrix:advertising.banner", "lefttwo", array(
	"TYPE" => "BOTTOM",
	"NOINDEX" => "N",
	"CACHE_TYPE" => "A",
	"CACHE_TIME" => "0"
	),
	false
);?></td><td>
				<?$APPLICATION->IncludeComponent("bitrix:advertising.banner", "lefttwo", array(
	"TYPE" => "BOTTOM",
	"NOINDEX" => "N",
	"CACHE_TYPE" => "A",
	"CACHE_TIME" => "0"
	),
	false
);?>
				<?endif;?>
				</td>
				<tr>
				</table>
			</div>			
		</div>
	</div>
  </div>
 </body>
</html>