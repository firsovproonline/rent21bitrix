<? if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
    CJSCore::Init(['popup','dialogs','window']);
    use Bitrix\Main\Loader;
    Loader::IncludeModule('highloadblock');
    use Bitrix\Highloadblock as HL;

    if($_SERVER['SCRIPT_URL']=="/list/"){
        $hlblock = HL\HighloadBlockTable::getList([
            'filter' => ['=NAME' => "rent21ob"]
        ])->fetch();
        $entity = HL\HighloadBlockTable::compileEntity($hlblock);
        $entity_data_class = $entity->getDataClass();     
    
        $rsData = $entity_data_class::getList(array(
           'select' => array('*')
        ));
        ?>
        <table style="width:100%">
        <?
        while($el = $rsData->fetch()){
            ?>
                <tr>
            <?
            echo "<td>".$el["ID"]."</td>";
            echo "<td>".$el["UF_RENT21_CATEGORY"]."</td>";
            echo "<td><a href='/edit/".$el["ID"]."'>Редактировать</a></td>";
            
            //echo "<td><pre>";
            //print_r($el);
            //echo "</pre></tr>";
            ?>
                </tr>
            <?
        }
        ?>
        </table>
        <?
        return;
    }

?>
    <script type="text/javascript" src="/local/components/rent21/add/js/inputmask/inputmask.js"></script>
    <script type="text/javascript" src="/local/components/rent21/add/js/inputmask/jquery.inputmask.js"></script>
    <script type="text/javascript" src="/local/components/rent21/add/js/inputmask/inputmask.extensions.js"></script>
    <script type="text/javascript" src="/local/components/rent21/add/js/inputmask/inputmask.numeric.extensions.js"></script>
    <script type="text/javascript" src="/local/components/rent21/add/js/setAdres.js"></script>
    <script type="text/javascript" src="/local/components/rent21/add/js/multyCian.js"></script>
    <script type="text/javascript" src="/local/components/rent21/add/js/cianFields.js"></script>
    <script type="text/javascript" src="/local/components/rent21/add/js/BargainTerms.js"></script>
    <style type="text/css">
    .photoGrid{
        height:210px;
        background: url(/local/templates/Arendaprodaga/images/footer.jpg) no-repeat;
    }
    .infoSectionHeader{
        background: url(/local/templates/Arendaprodaga/images/htop.jpg) repeat-x;
        padding:4px;
        color:#ffffff;
        font-weight:bolder;
    }
    .select-css { 
        display: block; 
        font-size: 14px; 
        font-family: sans-serif; 
        color: #444; 
        height:28px;
        padding: 2px 2px 2px 12px;  
        
        box-sizing: border-box; 
        margin: 0; 
        border: 1px solid #aaa;
         box-shadow: 0 1px 0 1px rgba(0,0,0,.04); 
        border-radius: .5em;
         -moz-appearance: none;
         -webkit-appearance: none;
         appearance: none;
         background-color: #fff; 
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'), linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%); 
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: .65em auto, 100%; 
    } 
     .select-css::-ms-expand { display: none; } 
     .select-css:hover { border-color: #888; } 
     .select-css:focus { border-color: #aaa; 
     box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
     box-shadow: 0 0 0 3px -moz-mac-focusring; 
     color: #222;
     outline: none; 
    } 
    .select-css option { font-weight:normal; } 
     *[dir="rtl"] .select-css, :root:lang(ar) .select-css, :root:lang(iw) .select-css { 
    background-position: left .7em top 50%, 0 0; 
    padding: .6em .8em .5em 1.4em; 
    }    
    
    
  .custom-radio {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }

  /* для элемента label связанного с .custom-radio */
  .custom-radio+label {
    display: inline-flex;
    align-items: center;
    user-select: none;
  }

  /* создание в label псевдоэлемента  before со следующими стилями */
  .custom-radio+label::before {
    content: '';
    display: inline-block;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    flex-grow: 0;
    border: 1px solid #adb5bd;
    border-radius: 50%;
    margin-right: 0.5em;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50% 50%;
  }

  /* стили при наведении курсора на радио */
  .custom-radio:not(:disabled):not(:checked)+label:hover::before {
    border-color: #b3d7ff;
  }

  /* стили для активной радиокнопки (при нажатии на неё) */
  .custom-radio:not(:disabled):active+label::before {
    background-color: #b3d7ff;
    border-color: #b3d7ff;
  }

  /* стили для радиокнопки, находящейся в фокусе */
  .custom-radio:focus+label::before {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  /* стили для радиокнопки, находящейся в фокусе и не находящейся в состоянии checked */
  .custom-radio:focus:not(:checked)+label::before {
    border-color: #80bdff;
  }

  /* стили для радиокнопки, находящейся в состоянии checked */
  .custom-radio:checked+label::before {
    border-color: #0b76ef;
    background-color: #0b76ef;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
  }

  /* стили для радиокнопки, находящейся в состоянии disabled */
  .custom-radio:disabled+label::before {
    background-color: #e9ecef;
  }    
    
    
    
    
    /* для элемента input c type="checkbox" */
    .custom-checkbox {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }

    /* для элемента label, связанного с .custom-checkbox */
    .custom-checkbox+label {
      display: inline-flex;
      align-items: center;
      user-select: none;
    }

    /* создание в label псевдоэлемента before со следующими стилями */
    .custom-checkbox+label::before {
      content: '';
      display: inline-block;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      flex-grow: 0;
      border: 1px solid #adb5bd;
      border-radius: 0.25em;
      margin-right: 0.5em;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 50% 50%;
    }

    /* стили при наведении курсора на checkbox */
    .custom-checkbox:not(:disabled):not(:checked)+label:hover::before {
      border-color: #b3d7ff;
    }

    /* стили для активного чекбокса (при нажатии на него) */
    .custom-checkbox:not(:disabled):active+label::before {
      background-color: #b3d7ff;
      border-color: #b3d7ff;
    }

    /* стили для чекбокса, находящегося в фокусе */
    .custom-checkbox:focus+label::before {
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    /* стили для чекбокса, находящегося в фокусе и не находящегося в состоянии checked */
    .custom-checkbox:focus:not(:checked)+label::before {
      border-color: #80bdff;
    }

    /* стили для чекбокса, находящегося в состоянии checked */
    .custom-checkbox:checked+label::before {
      border-color: #0b76ef;
      background-color: #0b76ef;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
    }

    /* стили для чекбокса, находящегося в состоянии disabled */
    .custom-checkbox:disabled+label::before {
      background-color: #e9ecef;
    }
    
    
    .vfield input{
        min-height:20px;
    }
        .vfield{
            margin-top:8px;
        }
        .vfield .label{
            width:210px;
            min-width:210px;
        }
        .overlay {
            position: fixed;
            width: 100%;
            height: 100%;
            opacity: 0.7;
            top: 0;
        }

        .preloader {
            width: 50px;
            height: 50px;
            border: 6px solid transparent;
            border-bottom: 6px solid #fc0;
            border-left: 6px solid #fc0;
            border-radius: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: animate 1s infinite linear;
        }

        /* Анимируем наш прелоадер */

        @keyframes animate {
            0% {
                transform: rotate(0);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    

        .tableMap {
            display: flex;
            flex-wrap: wrap;
        }
        
        .map-flex-box {
            padding: 5px;
            flex: 0 1 auto;
        }
        
        .mapDiv {
            flex: 0 1 calc(100% - 325px);
            min-width: 300px;
        }
        
        .infoRow {
            flex: 0 1 300px;
            min-width: 300px;
            height: 200px;
        }
        .DivinputAdress{
            padding-right:8px;
            padding-left:4px;
            
        }    
        .infoSectionB{
            display:none;
        }
        .fix4{
            width:25%;
        }
        .itemB{
            box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
            border: 1px solid;
            padding: 4px;
            cursor: pointer;
            margin-left: 8px;
            margin-bottom: 8px;
            border-radius: 15px;
            
        }
        .boxShadow8 {
          margin: 2px auto;
          padding: 4px;
          box-shadow: 0 0 10px 5px rgba(221, 221, 221, 1);
        }
        .vfield .items {
            flex-wrap: wrap;

        }

        .vfield .items .selectItem {
            background-color: #c3d4e8;
        }

        .vfield .items .item {
            border: 1px solid;
            padding: 4px;
            cursor: pointer;
            margin-left: 8px;
            margin-bottom: 8px;
            border-radius: 15px;
        }


        .vfield .items .itemGorizont{
            border-right:1px solid;
            border-top:1px solid;
            border-bottom:1px solid;
            padding:4px;
            padding-left:12px;
            padding-right:12px;
            min-width:40px;
            text-align:center;
            cursor:pointer;
        }
        .vfield .items .itemGorizont:nth-child(1){
            border-left:1px solid;
        }
        .vfield .items .item:nth-child(1){
            margin-left:-10px;
        }

        .multycian {
            margin-top: 0px;
        }

        .multycian .items {
            flex-wrap: wrap;

        }

        .multycian .items .selectItem {
            background-color: #c3d4e8;
        }

        .multycian .items .item {
            border: 1px solid;
            padding: 4px;
            cursor: pointer;
            margin-left: 8px;
            margin-bottom: 8px;
            border-radius: 15px;
        }

        .multycian .header .title {
            width: 80px;
            min-width: 80px;
            max-width: 80px;
        }

        .flex-box {
            margin: 5px;
            padding: 5px;
            flex: 0 1 auto;
        }

        .flex-box:nth-child(2) {
            flex: 1 1 auto;
        }
        
        .shadowField {
            margin-top: 0px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
        }
        
        .infoRow td{
           vertical-align :top
        }
        #app{
            max-width:800px;
            width:800px;
        }
    .dropZone {
        color: #555;
        font-size: 18px;
        text-align: center;
        width: 100%;
        border: 1px solid #ccc;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    
    .dropZone.hover {
        border-color: #aaa;
    }
    
    .dropZone.error {
        border-color: #f00;
    }
    
    .dropZone.drop {
        border-color: #0f0;
    }
        
        
        
    </style>
    <table style="width:100%">
        <tr>
            <td style="width:40%"></td>
            <td>
                <div id="app">
                    <router-view></router-view>
                </div>   
            </td>
            <td style="width:40%"></td>
        </tr>
    </table>
    <script>
        $(document).ready(function() {
/*            
                            var dropZone = $('.dropZone'),
                                maxFileSize = 5000000;
                            if (typeof(window.FileReader) == 'undefined') {
                                alert('Не поддерживается браузером!');
                                dropZone.addClass('error');
                            }
                            dropZone[0].ondragover = function() {
                                dropZone.addClass('hover');
                                return false;
                            };
                        
                            dropZone[0].ondragleave = function() {
                                dropZone.removeClass('hover');
                                return false;
                            };
                        
                            dropZone[0].ondrop = function(event) {
                                event.preventDefault();
                                dropZone.removeClass('hover');
                                dropZone.addClass('drop');
                                if (event.dataTransfer.files[0]) {
                                    for (var i = 0; i < event.dataTransfer.files.length; i++) {
                                        var file = event.dataTransfer.files[i];
                        
                                        if (file.size > maxFileSize) {
                                            alert('Файл слишком большой!');
                                            dropZone.addClass('error');
                                            return false;
                                        }
                                        var xhr = new XMLHttpRequest();
                                        xhr.upload.addEventListener('progress', uploadProgress, false);
                                        xhr.onreadystatechange = stateChange;
                                        xhr.open('POST', '/image/' + self.uid);
                        
                                        xhr.setRequestHeader('uid', self.uid);
                                        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                                        xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));
                                        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                                        xhr.send(file);
                        
                                    }
                        
                                }
                        
                                // xhr.setRequestHeader('X-FILE-NAME', file.name);
                                // xhr.send(file);
                        
                        
                            };                            
            
*/            
            
            $('.preloader, .overlay').fadeOut();
            function afterSend(){
                
            }
            
                    
            const mainPage = Vue.component('mainPage', function(resolve, reject) {
                $.get("/local/components/rent21/add/main.html", function(data) {
                    resolve({
                        template: data,
                        data() {
                            return {
                                phone: 1112222
        
                            }
                        },
                        computed: {
                            list() {
                                return "11111";
                            }
                        },
                        methods: {
                            send() {
                                //console.log(this.$children);
                                var out={};
                                for(var i=0;i<this.$children.length;i++){
                                    //if(i>3){
                                        //console.log($(this.$children[i].$el).parent().is(':visible'));
                                        
                                    //}
                                    if(this.$children[i].getValue && $(this.$children[i].$el).parent().is(':visible')){
                                        var e = this.$children[i].getValue();
                                        if($.isPlainObject(e)){
                                            for(var key in e){
                                                if(out[key]==undefined){
                                                    out[key]={};
                                                }
                                                if($.isPlainObject(e[key])){
                                                    for(var key1 in e[key]){
                                                        out[key][key1] = e[key][key1];
                                                    }
                                                    
                                                }else{
                                                    out[key] =e[key];
                                                }
                                            }
                                            //console.log(this.$children[i].getValue());  
                                        }
                                    }

                                }
                                console.log(out);
                                $.ajax({
                                	url: '/local/components/rent21/',         /* Куда пойдет запрос */
                                	method: 'post',             /* Метод передачи (post или get) */
                                	dataType: 'json',          /* Тип данных в ответе (xml, json, script, html). */
                                	data: out,     /* Параметры передаваемые в запросе. */
                                	success: function(data){ 
                                		console.log(data);           /* В переменной data содержится ответ от index.php. */
                                		window.location.href = "/list/"
                                	}
                                })
                                .done(function() {
                                    alert( "success" );
                                })
                                .fail(function() {

                                 })
                                  .always(function() {
                                		window.location.href = "/list/"
                                  });
                                //return false;

                            },
                            editSection4(){
                                $("#infoSection4").find('.fieldsDiv').show();
                                $("#infoSection4").find('.infoSectionB').hide();
                            },
                            editSection3(){
                                $("#infoSection3").find('.fieldsDiv').show();
                                $("#infoSection3").find('.infoSectionB').hide();
                            },
                            editSection1(){
                                $("#infoSection1").find('.fieldsDiv').show();
                                $("#infoSection1").find('.infoSectionB').hide();
                                //$("#infoSection3").hide();
                            },
                            showTab(){
                                $('.divTab').hide();
                                for(var i=0; i<this.$children.length; i++){
                                    if(this.$children[i].field == 'OPP'){
                                        var OPP = this.$children[i].getValue();
                                    }
                                    if(this.$children[i].field == 'TIP'){
                                        var TIP = this.$children[i].getValue();
                                    }
                                    
                                }
                                console.log(OPP,TIP);
                                $('#infoSection3').show();
                                $('#infoSection5').show();
                                $('#infoSection4').show();
                                
                                switch (OPP) {
                                    case 'Продажа':
                                        switch (TIP) {
                                            case 'Офис':
                                                $('.officeSale').show();
                                                break;
                                            case 'Здание':
                                                $('.buildingSale').show();
                                                $('#infoSection3').hide();
                                                $('#infoSection5').hide();
                                                break;
                                            case 'Торговая площадь':
                                                $('.shoppingAreaSale').show();
                                                break;
                                            case 'Гараж':
                                                $('.garageSale').show();
                                                break;
                                            case 'Помещение свободного назначения':
                                                $('.freeAppointmentObjectSale').show();
                                                $('#infoSection5').hide();
                                                break;
                                            case 'Склад':
                                                $('.warehouseSale').show();
                                                break;
                                            case 'Производство':
                                                $('.industrySale').show();
                                                break;
                                            case 'Коммерческая земля':
                                                $('.commercialLandSale').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                break;
                                            case 'Готовый бизнес':
                                                $('.businessSale').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                
                                                break;
                                            case 'Квартира':
                                                $('.flatSale').show();
                                                $('#infoSection5').hide();
                                                break;                                                
                                            case 'Комната':
                                                $('.roomSale').show();
                                                $('#infoSection5').hide();
                                                break;                                                
                                            case 'Дом/дача':
                                                $('.houseSale').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                break;
                                            case 'Коттедж':
                                                $('.cottageSale').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                break;
                                            case 'Таунхаус':
                                                $('.townhouseSale').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                break;
                                                
                                            default:
                                        }
                                        break;
                                    default:
                                        switch (TIP) {
                                            case 'Офис':
                                                $('.officeRent').show();
                                                break;
                                            case 'Здание':
                                                $('.buildingRent').show();
                                                $('#infoSection3').hide();
                                                $('#infoSection5').hide();
                                                break;
                                            case 'Торговая площадь':
                                                $('.shoppingAreaRent').show();
                                                break;
                                            case 'Гараж':
                                                $('.garageRent').show();
                                                break;
                                            case 'Помещение свободного назначения':
                                                $('.freeAppointmentObjectRent').show();
                                                $('#infoSection5').hide();
                                            break;
                                            case 'Производство':
                                                $('.industryRent').show();
                                                break;
                                            case 'Склад':
                                                $('.warehouseRent').show();
                                                break;
                                            case 'Коммерческая земля':
                                                $('.commercialLandRent').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                break;
                                            case 'Таунхаус':
                                                $('.townhouseRent').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                break;

                                            case 'Коттедж':
                                                $('.cottageRent').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                break;
                                            case 'Дом/дача':
                                                $('.houseRent').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                
                                                break;
                                            case 'Готовый бизнес':
                                                $('.businessRent').show();
                                                $('#infoSection4').hide();
                                                $('#infoSection5').hide();
                                                
                                                break;
                                            case 'Квартира':
                                                $('.flatRent').show();
                                                $('#infoSection5').hide();
                                                break;                                                
                                            case 'Комната':
                                                $('.roomRent').show();
                                                $('#infoSection5').hide();
                                                break;                                                
                                                
                                                
                                            default:
                                        }
                                }
                                
                            },
                            selectItem(name,value) {
                                for(var i=0; i<this.$children.length; i++){
                                    if(this.$children[i].field == 'OPP'){
                                        var OPP = this.$children[i].getValue();
                                    }
                                    if(this.$children[i].field == 'TIP'){
                                        var TIP = this.$children[i].getValue();
                                    }
                                    
                                }

                                switch (name) {
                                    case 'TIP':
                                        $($("#infoSection1").find('.infoSectionB').find('td')[0]).html(OPP+' '+TIP);
                                        $("#infoSection1").find('.fieldsDiv').hide();
                                        $("#infoSection1").find('.infoSectionB').show();
                                        this.showTab();
                                        //$("#infoSection3").show();
                                        break;
                                    case 'OPP':
                                        $(".multycian_TIPN").show();
                                        this.showTab();
                                        break;
                                    case 'TIPN':
                                        for(var i=0; i<this.$children.length; i++){
                                            if(this.$children[i].field == 'OPP'){
                                                //this.$children[i].setValue('Аренда');
                                            }
                                            if(this.$children[i].field == 'TIP'){
                                                switch (value) {
                                                    case 'Коммерческая':
                                                        this.$children[i].setList([
                                                        'Офис',
                                                        'Здание',
                                                        'Торговая площадь',
                                                        'Помещение свободного назначения',
                                                        'Производство',
                                                        'Склад',
                                                        'Гараж',
                                                        'Готовый бизнес',
                                                        'Коммерческая земля',
                                                        ]);
                                                    break;
                                                    case 'Жилая':
                                                        this.$children[i].setList([
                                                        'Квартира',
                                                        //'Койко-место',
                                                        'Комната'
                                                        ]);
                                                    break;
                                                    case 'Загородная':
                                                        this.$children[i].setList([
                                                        'Дом/дача',
                                                        'Коттедж',
                                                        'Таунхаус',
                                                       // 'Часть дома'
                                                       ]);
                                                    break;
                                                    default:
                                                }
                                                
                                            }
                                        }
                                        $(".multycian_TIP").show();
                                    break;
                                    default:
                                        //console.log('selectItem',{name:name,value:value});
                                }                                
                                
                                
                            }
                        },
                        mounted(){
                            var self = this;
                            $('.divTab').hide();

                            
                            if(window.location.pathname.indexOf('edit/')!=-1){
                                var list = window.location.pathname.split('/');
                                $.get('/local/components/rent21/?id='+list[list.length-1],function(data){
                                    $('.'+data.CATEGORY).show();
                                    for(var i=0;i<self.$children.length;i++){
                                        if(self.$children[i].setValue && $(self.$children[i].$el).parent().is(':visible')){
                                            self.$children[i].setValue(data);
                                        }
                                    }
                                    for(var key in data){
                                        if(!data[key]){
                                            delete(data[key]);
                                        }
                                    }
                                    console.log('-------',data);
                                    if(data.CATEGORY){
                                        if(data.CATEGORY.indexOf('Rent')!=-1){
                                            opp = "Аренда";
                                        }else{
                                            opp = "Продажа";
                                        }
                                        tip = data.CATEGORY;
                                        if(data.CATEGORY.indexOf('shoppingArea')!=-1) tip = "Торговая площадь";
                                        if(data.CATEGORY.indexOf('building')!=-1) tip = "Здания";
                                        if(data.CATEGORY.indexOf('office')!=-1) tip = "Офиса";
                                        if(data.CATEGORY.indexOf('freeAppointmentObject')!=-1) tip = "Помещение свободного назначения";
                                        if(data.CATEGORY.indexOf('industry')!=-1) tip = "Производство";
                                        if(data.CATEGORY.indexOf('warehouse')!=-1) tip = "Склад";
                                        if(data.CATEGORY.indexOf('garage')!=-1) tip = "Гараж";
                                        if(data.CATEGORY.indexOf('flat')!=-1) tip = "Квартира";
                                        if(data.CATEGORY.indexOf('room')!=-1) tip = "Комната";
                                        if(data.CATEGORY.indexOf('house')!=-1) tip = "Дом/Дача";
                                        if(data.CATEGORY.indexOf('cottage')!=-1) tip = "Коттедж";
                                        if(data.CATEGORY.indexOf('townhouse')!=-1) tip = "Таунхаус";

                                        $($("#infoSection1").find('.infoSectionB').find('td')[0]).html(opp+" "+tip);
                                        $("#infoSection1").find('.fieldsDiv').hide();
                                        $("#infoSection1").find('.infoSectionB').show();                                        
                                    }

                                })
                            }else{
                                //$('.officeRent').show();
                            }
                        }
                    })
                })
            })
        
            const modal = Vue.component("modal", {
                template: "#modal-template",
                data() {
                    return {
                        phone: Compmodal
                    }
                },
                methods: {
                    send() {
                        app.showModal = true;
                    }
                }
        
            });
            const routes = [{
                path: '/',
                component: mainPage
/*                ,
                beforeEnter: (to, from, next) => {
                    next()
                }
*/                
            }]
            const router = new VueRouter({
                routes
        
            })
            const app = new Vue({
                router,
                data: {
                    showModal: false,
                }
            }).$mount('#app');
        
        
        });    
    </script>    
    
<?
?>