<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
    function dirToArray($dir) {
       $result = array();
      $cdir = scandir($dir);
       foreach ($cdir as $key => $value)
       {
          if (!in_array($value,array(".","..")))
          {
             if (is_dir($dir . DIRECTORY_SEPARATOR . $value))
             {
                $result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);
             }
             else
             {
                $result[] = $value;
             }
          }
       }
       return $result;
    }

    if(isset($_GET['listphoto'])){
        $farr = dirToArray($_SERVER["DOCUMENT_ROOT"]."/local/components/rent21/image/".$_GET['listphoto']);
        $out = [];
        foreach ($farr as $value){
            $out[] = "/local/components/rent21/image/".$_GET['listphoto']."/".$value;
        }
        echo json_encode($out);
        return;
    }

use Bitrix\Main\Loader;
Loader::IncludeModule('highloadblock');
use Bitrix\Highloadblock as HL;
$hlblock = HL\HighloadBlockTable::getList([
    'filter' => ['=NAME' => "rent21ob"]
])->fetch();



if(isset($_GET['id'])){
    $entity = HL\HighloadBlockTable::compileEntity($hlblock); 
    $entity_data_class = $entity->getDataClass(); 
    
    $rsData = $entity_data_class::getList(array(
       "select" => array("*"),
       "order" => array("ID" => "ASC"),
       "filter" => array("ID"=>$_GET['id'])  // Задаем параметры фильтра выборки
    ));
    $out=[];
    while($arData = $rsData->Fetch()){
        foreach($arData as $key => $val){
            $out[str_replace("UF_RENT21_", "",$key)] = $val;         
        }
    }    
    header('Content-type: application/json');
    echo json_encode($out);    
    return;
}
if(isset($_POST['uid'])){
            $arCartFields = Array(
                'UF_RENT21_UID'=>Array(
                    'ENTITY_ID' => $UFObject,
                    'FIELD_NAME' => 'UF_RENT21_UID',
                    'USER_TYPE_ID' => 'string',
                    'MANDATORY' => 'Y',
                    "EDIT_FORM_LABEL" => Array('ru'=>'UID', 'en'=>'UID'), 
                    "LIST_COLUMN_LABEL" => Array('ru'=>'UID', 'en'=>'UID'),
                    "LIST_FILTER_LABEL" => Array('ru'=>'UID', 'en'=>'UID'), 
                    "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
                    "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
                ),
                'UF_RENT21_CATEGORY'=>Array(
                    'ENTITY_ID' => $UFObject,
                    'FIELD_NAME' => 'UF_RENT21_CATEGORY',
                    'USER_TYPE_ID' => 'string',
                    'MANDATORY' => 'Y',
                    "EDIT_FORM_LABEL" => Array('ru'=>'Категория по Cian', 'en'=>'Категория по Cian'), 
                    "LIST_COLUMN_LABEL" => Array('ru'=>'Категория по Cian', 'en'=>'Категория по Cian'),
                    "LIST_FILTER_LABEL" => Array('ru'=>'Категория по Cian', 'en'=>'Категория по Cian'), 
                    "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
                    "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
                )
                
            );            




if(!$hlblock){
    // блока нет

    $arLangs = Array(
        'ru' => 'Rent21ob',
        'en' => 'Rent21ob'
    );    
    $result = HL\HighloadBlockTable::add(array(
        'NAME' => 'Rent21ob',
        'TABLE_NAME' => 'rent21_ob', 
    ));    
    

    if ($result->isSuccess()) {
        $id = $result->getId();
        foreach($arLangs as $lang_key => $lang_val){
            HL\HighloadBlockLangTable::add(array(
                'ID' => $id,
                'LID' => $lang_key,
                'NAME' => $lang_val
            ));
            $arSavedFieldsRes = Array();
            foreach($arCartFields as $arCartField){
                $arCartField["ENTITY_ID"] = 'HLBLOCK_'.$id;
                $obUserField  = new CUserTypeEntity;
                $ID = $obUserField->Add($arCartField);
                $arSavedFieldsRes[] = $ID;
            }            
        }
    } else {
        $errors = $result->getErrorMessages();
        var_dump($errors);  
    }    

}else{
    // таблица есть - проверяем все ли есть поля
    $arCartFields = Array(
        'UF_RENT21_UID'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_UID',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => 'Y',
            "EDIT_FORM_LABEL" => Array('ru'=>'UID', 'en'=>'UID'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'UID', 'en'=>'UID'),
            "LIST_FILTER_LABEL" => Array('ru'=>'UID', 'en'=>'UID'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        'UF_RENT21_CATEGORY'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_CATEGORY',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => 'Y',
            "EDIT_FORM_LABEL" => Array('ru'=>'Категория по Cian', 'en'=>'Категория по Cian'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Категория по Cian', 'en'=>'Категория по Cian'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Категория по Cian', 'en'=>'Категория по Cian'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        'UF_RENT21_GLOBALTITLE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_GLOBALTITLE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => 'Y',
            "EDIT_FORM_LABEL" => Array('ru'=>'Заголовок', 'en'=>'Заголовок'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Заголовок', 'en'=>'Заголовок'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Заголовок', 'en'=>'Заголовок'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        

        'UF_RENT21_ROOMTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ROOMTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Тип комнаты', 'en'=>'Тип комнаты'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Тип комнаты', 'en'=>'Тип комнаты'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Тип комнаты', 'en'=>'Тип комнаты'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        
        'UF_RENT21_SPECIALTY'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_SPECIALTY',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Возможное назначение', 'en'=>'Возможное назначение'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Возможное назначение', 'en'=>'Возможное назначение'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Возможное назначение', 'en'=>'Возможное назначение'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        
        'UF_RENT21_HASBATHHOUSE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASBATHHOUSE',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть баня', 'en'=>'Есть баня'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть баня', 'en'=>'Есть баня'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть баня', 'en'=>'Есть баня'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        
        'UF_RENT21_HASGARAGE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASGARAGE',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть гараж', 'en'=>'Есть гараж'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть гараж', 'en'=>'Есть гараж'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть гараж', 'en'=>'Есть гараж'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        
        'UF_RENT21_HASPOOL'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASPOOL',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть бассейн', 'en'=>'Есть бассейн'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть бассейн', 'en'=>'Есть бассейн'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть бассейн', 'en'=>'Есть бассейн'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    

        
        'UF_RENT21_ISPENTHOUSE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ISPENTHOUSE',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Пентхаус', 'en'=>'Пентхаус'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Пентхаус', 'en'=>'Пентхаус'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Пентхаус', 'en'=>'Пентхаус'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    

        
        'UF_RENT21_ISAPARTMENTS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ISAPARTMENTS',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Апартаменты', 'en'=>'Апартаменты'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Апартаменты', 'en'=>'Апартаменты'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Апартаменты', 'en'=>'Апартаменты'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        
        'UF_RENT21_HASSHOPWINDOWS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASSHOPWINDOWS',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Витринные окна', 'en'=>'Витринные окна'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Витринные окна', 'en'=>'Витринные окна'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Витринные окна', 'en'=>'Витринные окна'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        
        'UF_RENT21_INPUTTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_INPUTTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => 'Y',
            "EDIT_FORM_LABEL" => Array('ru'=>'Вход', 'en'=>'Вход'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Вход', 'en'=>'Вход'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Вход', 'en'=>'Вход'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        
        'UF_RENT21_BUILDING_LIFTTYPES'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_LIFTTYPES',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => 'Y',
            "EDIT_FORM_LABEL" => Array('ru'=>'Лифт', 'en'=>'Лифт'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Лифт', 'en'=>'Лифт'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Лифт', 'en'=>'Лифт'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
  
        'UF_RENT21_ALLROOMSAREA'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ALLROOMSAREA',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Площадь комнат, м²', 'en'=>'Площадь комнат, м²'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Площадь комнат, м²', 'en'=>'Площадь комнат, м²'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Площадь комнат, м²', 'en'=>'Площадь комнат, м²'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    

  
        'UF_RENT21_BUILDING_SERIES'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_SERIES',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Серия дома', 'en'=>'Серия дома'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Серия дома', 'en'=>'Серия дома'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Серия дома', 'en'=>'Серия дома'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
  
        
        'UF_RENT21_BUILDING_MATERIALTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_MATERIALTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Тип дома', 'en'=>'Тип дома'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Тип дома', 'en'=>'Тип дома'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Тип дома', 'en'=>'Тип дома'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        'UF_RENT21_REPAIRTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_REPAIRTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Тип ремонта', 'en'=>'Тип ремонта'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Тип ремонта', 'en'=>'Тип ремонта'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Тип ремонта', 'en'=>'Тип ремонта'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    

        
        'UF_RENT21_BARGAINTERMS_UTILITIESTERMS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_UTILITIESTERMS',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Коммунальные услуги', 'en'=>'Коммунальные услуги'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Коммунальные услуги', 'en'=>'Коммунальные услуги'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Коммунальные услуги', 'en'=>'Коммунальные услуги'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    
        
        
        'UF_RENT21_GLOBALREM'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_GLOBALREM',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => 'Y',
            "EDIT_FORM_LABEL" => Array('ru'=>'Описание', 'en'=>'Описание'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Описание', 'en'=>'Описание'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Описание', 'en'=>'Описание'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),    


        'UF_RENT21_BUILDING_CARGOLIFTSCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_CARGOLIFTSCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество грузовых лифтов', 'en'=>'Количество грузовых лифтов'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество грузовых лифтов', 'en'=>'Количество грузовых лифтов'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество грузовых лифтов', 'en'=>'Количество грузовых лифтов'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BUILDING_PASSENGERLIFTSCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_PASSENGERLIFTSCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество пассажирских лифтов', 'en'=>'Количество пассажирских лифтов'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество пассажирских лифтов', 'en'=>'Количество пассажирских лифтов'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество пассажирских лифтов', 'en'=>'Количество пассажирских лифтов'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

        'UF_RENT21_COMBINEDWCSCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_COMBINEDWCSCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество совместных санузлов', 'en'=>'Количество совместных санузлов'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество совместных санузлов', 'en'=>'Количество совместных санузлов'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество совместных санузлов', 'en'=>'Количество совместных санузлов'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_SEPARATEWCSCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_SEPARATEWCSCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество раздельных санузлов', 'en'=>'Количество раздельных санузлов'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество раздельных санузлов', 'en'=>'Количество раздельных санузлов'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество раздельных санузлов', 'en'=>'Количество раздельных санузлов'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BALCONIESCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BALCONIESCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество балконов', 'en'=>'Количество балконов'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество балконов', 'en'=>'Количество балконов'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество балконов', 'en'=>'Количество балконов'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_LOGGIASCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_LOGGIASCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество лоджий', 'en'=>'Количество лоджий'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество лоджий', 'en'=>'Количество лоджий'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество лоджий', 'en'=>'Количество лоджий'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_FLATROOMSCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_FLATROOMSCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество комнат', 'en'=>'Количество комнат'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество комнат', 'en'=>'Количество комнат'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество комнат', 'en'=>'Количество комнат'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

        
        'UF_RENT21_USERID'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_USERID',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'ID пользователя', 'en'=>'ID пользователя'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'ID пользователя', 'en'=>'ID пользователя'),
            "LIST_FILTER_LABEL" => Array('ru'=>'ID пользователя', 'en'=>'ID пользователя'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        'UF_RENT21_BUILDING_FLOORSCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_FLOORSCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Этажей в доме', 'en'=>'Этажей в доме'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Этажей в доме', 'en'=>'Этажей в доме'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Этажей в доме', 'en'=>'Этажей в доме'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        'UF_RENT21_WATERPIPESCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_WATERPIPESCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Мокрых точек', 'en'=>'Мокрых точек'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Мокрых точек', 'en'=>'Мокрых точек'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Мокрых точек', 'en'=>'Мокрых точек'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        'UF_RENT21_FLOORNUMBER'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_FLOORNUMBER',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Этаж', 'en'=>'Этаж'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Этаж', 'en'=>'Этаж'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Этаж', 'en'=>'Этаж'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_BARGAINTERMS_PREPAYMONTHS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_PREPAYMONTHS',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Предоплата', 'en'=>'Предоплата'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Предоплата', 'en'=>'Предоплата'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Предоплата', 'en'=>'Предоплата'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        'UF_RENT21_BARGAINTERMS_MINLEASETERM'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_MINLEASETERM',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Минимальный срок аренды, мес', 'en'=>'Минимальный срок аренды, мес'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Минимальный срок аренды, мес', 'en'=>'Минимальный срок аренды, мес'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Минимальный срок аренды, мес', 'en'=>'Минимальный срок аренды, мес'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        'UF_RENT21_BARGAINTERMS_CLIENTFEE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_CLIENTFEE',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Комиссия от прямого клиента %', 'en'=>'Комиссия от прямого клиента %'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Комиссия от прямого клиента %', 'en'=>'Комиссия от прямого клиента %'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Комиссия от прямого клиента %', 'en'=>'Комиссия от прямого клиента %'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_BUILDING_CRANAGETYPES'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_CRANAGETYPES',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Крановое оборудование', 'en'=>'Крановое оборудование'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Крановое оборудование', 'en'=>'Крановое оборудование'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Крановое оборудование', 'en'=>'Крановое оборудование'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_BUILDING_GATESTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_GATESTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Ворота', 'en'=>'Ворота'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Ворота', 'en'=>'Ворота'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Ворота', 'en'=>'Ворота'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_FLOORMATERIALTYPETYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_FLOORMATERIALTYPETYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Материал пола', 'en'=>'Материал пола'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Материал пола', 'en'=>'Материал пола'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Материал пола', 'en'=>'Материал пола'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_BUILDING_COLUMNGRID'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_COLUMNGRID',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Сетка колонн', 'en'=>'Сетка колонн'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Сетка колонн', 'en'=>'Сетка колонн'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Сетка колонн', 'en'=>'Сетка колонн'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_BUILDING_WORKINGDAYSTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_WORKINGDAYSTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Рабочие дни', 'en'=>'Рабочие дни'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Рабочие дни', 'en'=>'Рабочие дни'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Рабочие дни', 'en'=>'Рабочие дни'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_BUILDING_OPENINGHOURS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_OPENINGHOURS',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Часы работы', 'en'=>'Часы работы'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Часы работы', 'en'=>'Часы работы'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Часы работы', 'en'=>'Часы работы'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        'UF_RENT21_AVAILABLEFROM'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_AVAILABLEFROM',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Дата освобождения', 'en'=>'Дата освобождения'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Дата освобождения', 'en'=>'Дата освобождения'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Дата освобождения', 'en'=>'Дата освобождения'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        

        
        'UF_RENT21_BUILDING_BUILDYEAR'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_BUILDYEAR',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Год постройки', 'en'=>'Год постройки'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Год постройки', 'en'=>'Год постройки'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Год постройки', 'en'=>'Год постройки'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        'UF_RENT21_BARGAINTERMS_VATTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_VATTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Налог', 'en'=>'Налог'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Налог', 'en'=>'Налог'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Налог', 'en'=>'Налог'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        'UF_RENT21_BUILDING_CLASSTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_CLASSTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Класс здания', 'en'=>'Класс здания'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Класс здания', 'en'=>'Класс здания'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Класс здания', 'en'=>'Класс здания'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        'UF_RENT21_BUILDING_TYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_TYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Тип здания', 'en'=>'Тип здания'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Тип здания', 'en'=>'Тип здания'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Тип здания', 'en'=>'Тип здания'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        'UF_RENT21_BUILDING_NAME'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_NAME',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Наименование здания', 'en'=>'Наименование здания'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Наименование здания', 'en'=>'Наименование здания'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Наименование здания', 'en'=>'Наименование здания'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_BARGAINTERMS_PAYMENTPERIOD'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_PAYMENTPERIOD',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Период оплаты', 'en'=>'Период оплаты'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Период оплаты', 'en'=>'Период оплаты'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Период оплаты', 'en'=>'Период оплаты'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_BARGAINTERMS_PRICETYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_PRICETYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Тип цены', 'en'=>'Тип цены'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Тип цены', 'en'=>'Тип цены'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Тип цены', 'en'=>'Тип цены'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        'UF_RENT21_BARGAINTERMS_CURRENCY'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_CURRENCY',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Валюта', 'en'=>'Валюта'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Валюта', 'en'=>'Валюта'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Валюта', 'en'=>'Валюта'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_FURNITUREPRESENCE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_FURNITUREPRESENCE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Мебель', 'en'=>'Мебель'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Мебель', 'en'=>'Мебель'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Мебель', 'en'=>'Мебель'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_CONDITIONTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_CONDITIONTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Состояние', 'en'=>'Состояние'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Состояние', 'en'=>'Состояние'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Состояние', 'en'=>'Состояние'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_ELECTRICITY_POSSIBLETOCONNECT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ELECTRICITY_POSSIBLETOCONNECT',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Возможно подключить Электроснабжение', 'en'=>'Возможно подключить Электроснабжение'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Возможно подключить Электроснабжение', 'en'=>'Возможно подключить Электроснабжение'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Возможно подключить Электроснабжение', 'en'=>'Возможно подключить Электроснабжение'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
   
        
        'UF_RENT21_FULLADRESSS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_FULLADRESSS',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'FULLADRESSS', 'en'=>'FULLADRESSS'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'FULLADRESSS', 'en'=>'FULLADRESSS'),
            "LIST_FILTER_LABEL" => Array('ru'=>'FULLADRESSS', 'en'=>'FULLADRESSS'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_PHOTOS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_PHOTOS',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Фото', 'en'=>'Фото'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Фото', 'en'=>'Фото'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Фото', 'en'=>'Фото'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

        
        'UF_RENT21_BUILDING_MANAGEMENTCOMPANY'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_MANAGEMENTCOMPANY',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Управляющая компания', 'en'=>'Управляющая компания'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Управляющая компания', 'en'=>'Управляющая компания'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Управляющая компания', 'en'=>'Управляющая компания'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

 
        'UF_RENT21_BUILDING_EXTINGUISHINGSYSTEMTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_EXTINGUISHINGSYSTEMTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Система пожаротушения', 'en'=>'Система пожаротушения'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Система пожаротушения', 'en'=>'Система пожаротушения'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Система пожаротушения', 'en'=>'Система пожаротушения'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BUILDING_HEATINGTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_HEATINGTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Отопление', 'en'=>'Отопление'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Отопление', 'en'=>'Отопление'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Отопление', 'en'=>'Отопление'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),



        'UF_RENT21_BUILDING_CONDITIONINGTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_CONDITIONINGTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Кондиционирование', 'en'=>'Кондиционирование'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Кондиционирование', 'en'=>'Кондиционирование'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Кондиционирование', 'en'=>'Кондиционирование'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BUILDING_VENTILATIONTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_VENTILATIONTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Вентиляция', 'en'=>'Вентиляция'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Вентиляция', 'en'=>'Вентиляция'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Вентиляция', 'en'=>'Вентиляция'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BUILDING_INFRASTRUCTURE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_INFRASTRUCTURE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Инфраструктура', 'en'=>'Инфраструктура'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Инфраструктура', 'en'=>'Инфраструктура'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Инфраструктура', 'en'=>'Инфраструктура'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

        
        'UF_RENT21_BUILDING_STATUSTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_STATUSTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Категория', 'en'=>'Категория'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Категория', 'en'=>'Категория'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Категория', 'en'=>'Категория'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_LAND'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_LAND',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Участок', 'en'=>'Участок'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Участок', 'en'=>'Участок'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Участок', 'en'=>'Участок'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

        
        'UF_RENT21_BUILDING_DEVELOPER'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_DEVELOPER',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Застройщик', 'en'=>'Застройщик'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Застройщик', 'en'=>'Застройщик'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Застройщик', 'en'=>'Застройщик'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        

        'UF_RENT21_BARGAINTERMS_INCLUDEDOPTIONS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_INCLUDEDOPTIONS',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Включено в ставку', 'en'=>'Включено в ставку'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Включено в ставку', 'en'=>'Включено в ставку'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Включено в ставку', 'en'=>'Включено в ставку'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_AREAPARTS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_AREAPARTS',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Сдача частей в аренду', 'en'=>'Сдача частей в аренду'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Сдача частей в аренду', 'en'=>'Сдача частей в аренду'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Сдача частей в аренду', 'en'=>'Сдача частей в аренду'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

        'UF_RENT21_GARAGE_STATUS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_GARAGE_STATUS',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Статус', 'en'=>'Статус'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Статус', 'en'=>'Статус'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Статус', 'en'=>'Статус'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),



        'UF_RENT21_GARAGE_TYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_GARAGE_TYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Тип', 'en'=>'Тип'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Тип', 'en'=>'Тип'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Тип', 'en'=>'Тип'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BARGAINTERMS_LEASETYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_LEASETYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Тип аренды', 'en'=>'Тип аренды'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Тип аренды', 'en'=>'Тип аренды'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Тип аренды', 'en'=>'Тип аренды'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BARGAINTERMS_BARGAINALLOWED'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_BARGAINALLOWED',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Возможен торг', 'en'=>'Возможен торг'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Возможен торг', 'en'=>'Возможен торг'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Возможен торг', 'en'=>'Возможен торг'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BUILDING_HASGARBAGECHUTE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_HASGARBAGECHUTE',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Мусоропровод', 'en'=>'Мусоропровод'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Мусоропровод', 'en'=>'Мусоропровод'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Мусоропровод', 'en'=>'Мусоропровод'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASRAMP'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASRAMP',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Пандус', 'en'=>'Пандус'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Пандуса', 'en'=>'Пандус'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Пандус', 'en'=>'Пандус'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASDISHWASHER'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASDISHWASHER',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть посудомоечная машина', 'en'=>'Есть посудомоечная машина'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть посудомоечная машина', 'en'=>'Есть посудомоечная машина'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть посудомоечная машина', 'en'=>'Есть посудомоечная машина'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

        'UF_RENT21_HASFRIDGE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASFRIDGE',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть холодильник', 'en'=>'Есть холодильник'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть холодильник', 'en'=>'Есть холодильник'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть холодильник', 'en'=>'Есть холодильник'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_CHILDRENALLOWED'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_CHILDRENALLOWED',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Можно с детьми', 'en'=>'Можно с детьми'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Можно с детьми', 'en'=>'Можно с детьми'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Можно с детьми', 'en'=>'Можно с детьми'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_PETSALLOWED'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_PETSALLOWED',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Можно с животными', 'en'=>'Можно с животными'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Можно с животными', 'en'=>'Можно с животными'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Можно с животными', 'en'=>'Можно с животными'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),



        'UF_RENT21_HASSHOWER'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASSHOWER',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть душевая кабина', 'en'=>'Есть душевая кабина'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть душевая кабина', 'en'=>'Есть душевая кабина'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть душевая кабина', 'en'=>'Есть душевая кабина'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASBATHTUB'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASBATHTUB',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть ванна', 'en'=>'Есть ванна'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть ванна', 'en'=>'Есть ванна'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть ванна', 'en'=>'Есть ванна'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASCONDITIONER'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASCONDITIONER',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть кондиционер', 'en'=>'Есть кондиционер'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть кондиционер', 'en'=>'Есть кондиционер'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть кондиционер', 'en'=>'Есть кондиционер'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASWASHER'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASWASHER',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть стиральная машина', 'en'=>'Есть стиральная машина'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть стиральная машина', 'en'=>'Есть стиральная машина'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть стиральная машина', 'en'=>'Есть стиральная машина'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),



        'UF_RENT21_HASTV'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASTV',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть телевизор', 'en'=>'Есть телевизор'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть телевизор', 'en'=>'Есть телевизор'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть телевизор', 'en'=>'Есть телевизор'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASKITCHENFURNITURE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASKITCHENFURNITURE',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть мебель на кухне', 'en'=>'Есть мебель на кухне'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть мебель на кухне', 'en'=>'Есть мебель на кухне'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть мебель на кухне', 'en'=>'Есть мебель на кухне'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASPHONE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASPHONE',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть телефон', 'en'=>'Есть телефон'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть телефон', 'en'=>'Есть телефон'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть телефон', 'en'=>'Есть телефон'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

        'UF_RENT21_HASINTERNET'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASINTERNET',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть интернет', 'en'=>'Есть интернет'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть интернет', 'en'=>'Есть интернет'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть интернет', 'en'=>'Есть интернет'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASHEATING'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASHEATING',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Отопление', 'en'=>'Отопление'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Отопление', 'en'=>'Отопление'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Отопление', 'en'=>'Отопление'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASLIGHT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASLIGHT',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Свет', 'en'=>'Свет'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Свет', 'en'=>'Свет'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Свет', 'en'=>'Свет'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_ISOCCUPIED'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ISOCCUPIED',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Помещение занято', 'en'=>'Помещение занято'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Помещение занято', 'en'=>'Помещение занято'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Помещение занято', 'en'=>'Помещение занято'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASTRANSPORTSERVICES'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASTRANSPORTSERVICES',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Транспортные услуги', 'en'=>'Транспортные услуги'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Транспортные услуги', 'en'=>'Транспортные услуги'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Транспортные услуги', 'en'=>'Транспортные услуги'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_ISCUSTOMS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ISCUSTOMS',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Таможня', 'en'=>'Таможня'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Таможня', 'en'=>'Таможня'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Таможня', 'en'=>'Таможня'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),

 
        'UF_RENT21_HASSAFECUSTODY'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASSAFECUSTODY',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Ответственное хранение', 'en'=>'Ответственное хранение'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Ответственное хранение', 'en'=>'Ответственное хранение'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Ответственное хранение', 'en'=>'Ответственное хранение'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
 
 
 
        'UF_RENT21_BARGAINTERMS_HASGRACEPERIOD'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_HASGRACEPERIOD',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Арендные каникулы', 'en'=>'Арендные каникулы'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Арендные каникулы', 'en'=>'Арендные каникулы'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Арендные каникулы', 'en'=>'Арендные каникулы'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_HASFURNITURE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_HASFURNITURE',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Есть мебель в комнатах', 'en'=>'Есть мебель в комнатах'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Есть мебель в комнатах', 'en'=>'Есть мебель в комнатах'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Есть мебель в комнатах', 'en'=>'Есть мебель в комнатах'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_ISLEGALADDRESSPROVIDED'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ISLEGALADDRESSPROVIDED',
            'USER_TYPE_ID' => 'boolean',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Юридический адрес', 'en'=>'Юридический адрес'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Юридический адрес', 'en'=>'Юридический адрес'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Юридический адрес', 'en'=>'Юридический адрес'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BUILDING_HOUSELINETYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_HOUSELINETYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Линия домов', 'en'=>'Линия домов'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Линия домов', 'en'=>'Линия домов'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Линия домов', 'en'=>'Линия домов'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BUILDING_PARKING'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_PARKING',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Парковка', 'en'=>'Парковка'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Парковка', 'en'=>'Парковка'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Парковка', 'en'=>'Парковка'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BUILDING_ACCESSTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_ACCESSTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Доступ', 'en'=>'Доступ'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Доступ', 'en'=>'Доступ'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Доступ', 'en'=>'Доступ'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_LAYOUT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_LAYOUT',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Планировка', 'en'=>'Планировка'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Планировка', 'en'=>'Планировка'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Планировка', 'en'=>'Планировка'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_REPAIRTYPE_AREA'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_REPAIRTYPE_AREA',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Тип ремонта', 'en'=>'Тип ремонта'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Тип ремонта', 'en'=>'Тип ремонта'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Тип ремонта', 'en'=>'Тип ремонта'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_BARGAINTERMS_BARGAINCONDITIONS'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_BARGAINCONDITIONS',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Условия торга', 'en'=>'Условия торга'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Условия торга', 'en'=>'Условия торга'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Условия торга', 'en'=>'Условия торга'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),
        
        
        'UF_RENT21_BARGAINTERMS_TENANTSTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_TENANTSTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Состав съемщиков', 'en'=>'Состав съемщиков'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Состав съемщиков', 'en'=>'Состав съемщиков'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Состав съемщиков', 'en'=>'Состав съемщиков'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),




        'UF_RENT21_SETTLEMENTNAME'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_SETTLEMENTNAME',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Название коттеджного поселка', 'en'=>'Название коттеджного поселка'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Название коттеджного поселка', 'en'=>'Название коттеджного поселка'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Название коттеджного поселка', 'en'=>'Название коттеджного поселка'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_WCLOCATIONTYPE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_WCLOCATIONTYPE',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'	Расположение санузла', 'en'=>'Расположение санузла'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Расположение санузла', 'en'=>'Расположение санузла'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Расположение санузла', 'en'=>'Расположение санузла'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        
        'UF_RENT21_CADASTRALNUMBER'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_CADASTRALNUMBER',
            'USER_TYPE_ID' => 'string',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Кадастровый номер', 'en'=>'Кадастровый номер'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Кадастровый номер', 'en'=>'Кадастровый номер'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Кадастровый номер', 'en'=>'Кадастровый номер'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),


        'UF_RENT21_BEDROOMSCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BEDROOMSCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество спален', 'en'=>'Количество спален'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество спален', 'en'=>'Количество спален'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество спален', 'en'=>'Количество спален'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_ROOMSCOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ROOMSCOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество комнат всего', 'en'=>'Количество комнат всего'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество комнат всего', 'en'=>'Количество комнат всего'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество комнат всего', 'en'=>'Количество комнат всего'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_ROOMSFORSALECOUNT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ROOMSFORSALECOUNT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Количество комнат в продажу/аренду', 'en'=>'Количество комнат в продажу/аренду'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Количество комнат в продажу/аренду', 'en'=>'Количество комнат в продажу/аренду'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Количество комнат в продажу/аренду', 'en'=>'Количество комнат в продажу/аренду'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_BARGAINTERMS_DEPOSIT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_DEPOSIT',
            'USER_TYPE_ID' => 'integer',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Залог собственнику', 'en'=>'Залог собственнику'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Залог собственнику', 'en'=>'Залог собственнику'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Залог собственнику', 'en'=>'Залог собственнику'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
      
      
        'UF_RENT21_ROOMAREA'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_ROOMAREA',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Площадь комнаты (комната, койко-место)', 'en'=>'Площадь комнаты (комната, койко-место)'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Площадь комнаты (комната, койко-место)', 'en'=>'Площадь комнаты (комната, койко-место)'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Площадь комнаты (комната, койко-место)', 'en'=>'Площадь комнаты (комната, койко-место)'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
      
      
        'UF_RENT21_BARGAINTERMS_BARGAINPRICE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_BARGAINPRICE',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Цена с учетом торга', 'en'=>'Цена с учетом торга'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Цена с учетом торга', 'en'=>'Цена с учетом торга'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Цена с учетом торга', 'en'=>'Цена с учетом торга'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
      
      
      
        'UF_RENT21_KITCHENAREA'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_KITCHENAREA',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Площадь кухни, м²', 'en'=>'Площадь кухни, м²'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Площадь кухни, м²', 'en'=>'Площадь кухни, м²'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Площадь кухни, м²', 'en'=>'Площадь кухни, м²'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        'UF_RENT21_LIVINGAREA'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_LIVINGAREA',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Жилая площадь, м²', 'en'=>'Жилая площадь, м²'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Жилая площадь, м²', 'en'=>'Жилая площадь, м²'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Жилая площадь, м²', 'en'=>'Жилая площадь, м²'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        'UF_RENT21_BUILDING_TOTALAREA'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_TOTALAREA',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Общая площадь здания м²', 'en'=>'Общая площадь здания м²'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Общая площадь здания м²', 'en'=>'Общая площадь здания м²'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Общая площадь здания м²', 'en'=>'Общая площадь здания м²'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        'UF_RENT21_BUILDING_CEILINGHEIGHT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BUILDING_CEILINGHEIGHT',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Высота потолков, м', 'en'=>'Высота потолков, м'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Высота потолков, м', 'en'=>'Высота потолков, м'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Высота потолков, м', 'en'=>'Высота потолков, м'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        

 
        'UF_RENT21_BARGAINTERMS_SECURITYDEPOSIT'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_SECURITYDEPOSIT',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Обеспечительный платеж', 'en'=>'Обеспечительный платеж'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Обеспечительный платеж', 'en'=>'Обеспечительный платеж'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Обеспечительный платеж', 'en'=>'Обеспечительный платеж'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        


        'UF_RENT21_BARGAINTERMS_PRICE'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_BARGAINTERMS_PRICE',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Цена', 'en'=>'Price'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Цена', 'en'=>'Price'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Цена', 'en'=>'Price'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        'UF_RENT21_TOTALAREA'=>Array(
            'ENTITY_ID' => $UFObject,
            'FIELD_NAME' => 'UF_RENT21_TOTALAREA',
            'USER_TYPE_ID' => 'double',
            'MANDATORY' => '',
            "EDIT_FORM_LABEL" => Array('ru'=>'Общая площадь, м²', 'en'=>'Общая площадь, м²'), 
            "LIST_COLUMN_LABEL" => Array('ru'=>'Общая площадь, м²', 'en'=>'Общая площадь, м²'),
            "LIST_FILTER_LABEL" => Array('ru'=>'Общая площадь, м²', 'en'=>'Общая площадь, м²'), 
            "ERROR_MESSAGE" => Array('ru'=>'', 'en'=>''), 
            "HELP_MESSAGE" => Array('ru'=>'', 'en'=>''),
        ),        
        
        
        
        
        
    );            
    $entity = HL\HighloadBlockTable::compileEntity($hlblock);
    $entity_data_class = $entity->getDataClass();     
    $arFiels = $entity->getFields();
    $listFields = [];
    foreach($arFiels as $key => $val){
        $listFields[] = $key;
    }
    foreach($arCartFields as $key => $val){
        if (!in_array($key, $listFields)) {
            $val["ENTITY_ID"] = 'HLBLOCK_'.$hlblock["ID"];
            $obUserField  = new CUserTypeEntity;
            $obUserField->Add($val);
            echo "Добавляем поле ".$key."<br>";
        }   
    }
    

}
    $outAr = [];
    foreach($_POST as $key => $val){
        //echo $key."<br>";
        if($key!="id"){
            $title = "UF_RENT21_".strtoupper($key);
            if(!is_array($val)){
                if (!in_array($title, $listFields)) {
                    echo "Нет поля ".$title."<br>";
                }else{
                    //echo $title." = ".$val."\n";
                    $outAr[$title]=$val;
                }     
            }else{
                foreach($val as $key1 => $val1){
                    $title1 =$title."_".strtoupper($key1);
                    if (!in_array($title1, $listFields)) {
                        echo "Нет поля ".$title1."<br>";
                    }else{
                        if(is_array($val1)){
                            $outAr[$title1]=json_encode($val1);
                            //echo $title1." = ".json_encode($val1)."\n";
                        }else{
                            $outAr[$title1]=$val1;
    
                            //echo $title1." = ".$val1."\n";
                        }
                    } 
    
                }
            }
        }
    }
    if($_POST['id'] != ""){
        $entity_data_class::update($_POST['id'],$outAr);
        echo "обновлено";
        
    }else{
        echo "<pre>";
        print_r($outAr);
        echo "</pre>";
        
        $entity_data_class::add($outAr);
        echo "Добавлено";
    }

}

      

//print_r($listFields);
//print_r($outAr);
//echo "<pre>";
//print_r($_POST);
//echo "</pre>";
//print_r($_GET);
//print_r($_FILES);

//echo compileEntity('Rent21');
?>