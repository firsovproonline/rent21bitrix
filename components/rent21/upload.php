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
    if(isset($_FILES)){
        foreach ($_FILES as $file){
            mkdir($_SERVER["DOCUMENT_ROOT"]."/local/components/rent21/image/".$_SERVER['HTTP_UID'], 0777);
            move_uploaded_file($file['tmp_name'], $_SERVER["DOCUMENT_ROOT"]."/local/components/rent21/image/".$_SERVER['HTTP_UID']."/".$file['name']);            
        }       
        $farr = dirToArray($_SERVER["DOCUMENT_ROOT"]."/local/components/rent21/image/".$_SERVER['HTTP_UID']);
        $out = [];
        foreach ($farr as $value){
            $out[] = "/local/components/rent21/image/".$_SERVER['HTTP_UID']."/".$value;
        }
        echo json_encode($out);
        return;
    }
?>    