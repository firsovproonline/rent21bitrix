function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function generateUID() {
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}

function getLastProp(ob){
    for(var key in ob){
        ob = getLastProp(ob[key]);
    }
    return ob;
}

var fileobj;
function upload_file(e) {
    e.preventDefault();
    fileobj = e.dataTransfer.files[0];
    ajax_file_upload(fileobj);
}
 
function file_explorer() {
    document.getElementById('selectfile').click();
    document.getElementById('selectfile').onchange = function() {
        fileobj = document.getElementById('selectfile').files[0];
        ajax_file_upload(fileobj);
    };
}
 
function ajax_file_upload(file_obj) {
    if(file_obj != undefined) {
        var form_data = new FormData();                  
        form_data.append('file', file_obj);
        $.ajax({
            type: 'POST',
            url: '/local/components/rent21/',
            contentType: false,
            processData: false,
            data: form_data,
            success:function(response) {
                console.log(response);
            }
        });
    }
}


const Cian_Select = Vue.component('Cian_Select', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'type': String
        },
        template: '<div class="Cian_Select"></div>',
        methods: {
            itemClick(ev){
                $(this.divList).find('div').removeClass('selectItem');
                $(ev.delegateTarget).addClass('selectItem');
                this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                var fields = this.field.split("->");
                ob = {};
                switch (this.type) {
                    case 'gorizontList':
                        if($(this.divList).find('.selectItem').length!=0){
                            for(var i=0;i<fields.length;i++){
                                if(i==(fields.length-1)){
                                    getLastProp(ob)[fields[i]]=$($(this.divList).find('.selectItem')[0]).attr('value');
                                }else{
                                    getLastProp(ob)[fields[i]]={};
                                }
                            }
                            return ob;
                        }else{
                            return null;
                        }
                        break;
                    default:
                        if($(this.input).val()!="no"){
                            for(var i=0;i<fields.length;i++){
                                if(i==(fields.length-1)){
                                    getLastProp(ob)[fields[i]]=this.input.val();
                                }else{
                                    getLastProp(ob)[fields[i]]={};
                                }
                            }
                            return ob;
                        }else{
                            return null;
                        }
                }
                
            },
            setValue(v){
                if(v[this.field.toUpperCase()]){
                    var list = $(this.divList).find('.itemGorizont');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).attr('value')==v[this.field.toUpperCase()]){
                            $(list[i]).addClass('selectItem');
                        }
                    }
                    delete(v[this.field.toUpperCase()]);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            var list = {
                "no":"нет",
                "1":"1",
                "2":"2",
                "3":"3",
                "4":"4"
            }
            switch (this.type) {
                case 'gorizontList':
                    this.divList = $("<div class='items flex-box' style='margin: 0px;padding: 0px;'>").appendTo(this.gdiv);
                    this.divList.css('display', 'flex');
                    for(var key in list){
                        var b = $("<div class='itemGorizont' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                        b.click($.proxy(this.itemClick));
                    }
                    
                    break;
                default:
                    this.input =$('<select class="select-css" style="width:60px">').appendTo(this.gdiv);
                    for(var key in list){
                        $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                        
                    }
            }
        }

    })
})


const photoGrid = Vue.component('photoGrid', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="photoGrid"></div>',
        methods: {
            createItem(J){
                $(this.$el).empty();
                for(var i=0;i<J.length;i++){
                    var imgSrc = J[i];
                    var ch = "";
                    if(J[i].PhotoSchema){
                        var imgSrc = J[i].PhotoSchema.FullUrl;
                        var ch = J[i].PhotoSchema.IsDefault;
                        if(ch){
                            ch = 'checked="checked"';
                        }
                        //console.log()
                    }
                    var im = $("<div class='imgItem boxShadow8' style='height:160px;width:fit-content;margin:5px;margin-top:20px'>").appendTo($(this.$el));
                    var im1 = $("<img style='height:100%'>").appendTo(im);
                    im1.prop("src",imgSrc);
                    var divCh = $("<div style='margin-top: -150px;margin-left: 8px;color: hotpink;'>").appendTo(im);
                    $('<input name="TypeGl" class="custom-radio" id="foto'+i+'" type="radio" value="owned" '+ch+'>').appendTo(divCh);
                    $('<label for="foto'+i+'">').appendTo(divCh).html('');
                    var divDel = $("<div style='width:24px;height:24px;margin-top:10px;margin-left: 8px;color: hotpink; border:1px solid;'>").appendTo(im);
                    var b = $("<div style='cursor:pointer;width: 24px;height: 24px;background-color: #ff009e;z-index: 9999;position: relative;'>").appendTo(divDel).html("");
                    b.click(function(){
                        if(confirm("Удалить фото?")){
                            console.log($(this).parent().parent().remove());                            
                        }
                    })                    
                }
            },
            uploadProgress(event) {
                var percent = parseInt(event.loaded / event.total * 100);
                //self.myToolbar.setItemText('text', 'Загрузка: ' + percent + '%');
                
            },
            stateChange(event) {
                if (event.target.readyState == 4) {
                    if (event.target.status == 200) {
                        var J = JSON.parse( event.currentTarget.responseText);
                        this.createItem(J);
                    } else {
                        alert('Произошла ошибка!');
                    }
                }
            },
            
            getValue(){
                var ob = [];
                var list = $(this.$el).find('.imgItem');
                for(var i=0;i<list.length;i++){
                    var url = $(list[i]).find("img").prop("src");
                    var ch = $(list[i]).find('.custom-radio');
                    console.log(ch.prop("checked"));
                    ob.push(
                        {
                            "PhotoSchema":{
                                "FullUrl":url,
                                "IsDefault":ch.prop("checked")
                            }
                        }
                    );
                }
                return {
                    "Photos":JSON.stringify(ob)
                };
            },
            setValue(v){
                var self = this;
                if(v.PHOTOS){
                    var J = JSON.parse(v.PHOTOS);
                    this.createItem(J);
                }                
/*
                if(v.UID){
                    this.uid = v.UID;
                    $.get('/local/components/rent21/?listphoto='+this.uid,function(data){
                        var J = JSON.parse(data);
                        self.createItem(J);
                    });
                }
*/
            }

        },
        mounted() {
            var self = this;
            var uid = generateUID();
            self.uid = uid;
            $(this.$el).css('display','flex');
            $(this.$el).css('overflow','auto');
            var dropZone = $(this.$el),
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
                        console.log(file)
                        if (file.size > maxFileSize) {
                            alert('Файл слишком большой!');
                            dropZone.addClass('error');
                            return false;
                        }
                        var fd = new FormData();
                        var xhr = new XMLHttpRequest();
                        xhr.upload.addEventListener('progress', self.uploadProgress, false);
                        xhr.onreadystatechange = self.stateChange;
                        xhr.open('POST', '/local/components/rent21/upload.php');
                        xhr.setRequestHeader('uid', self.uid);
                        fd.append('file', file);
                        xhr.send(fd);
                    }
                }
            };                            
            
        }

    })
})

/*
const Building_Type = Vue.component('Building_Type', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_Type"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building_Type'] = {
                    'Area': this.input.val(),
                };
                return ob;
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "hectare":"Гектар",
                "sotka":"Сотка"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})


const HasRamp = Vue.component('HasRamp', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="HasRamp"></div>',
        methods: {
            getValue(){
                if($(this.input).prop("checked")){
                    ob['HasRamp'] = true;
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="yard'+uid+'">').appendTo(this.gdiv);
            $('<label for="yard'+uid+'">').appendTo(this.gdiv).html('');
        }

    })
})
*/
const globaID = Vue.component('globaID', function(resolve, reject) {
    resolve({
        props: {

        },
        template: '<div class="globaID"></div>',
        methods: {
            getValue(){
                var ob = {};
                if(!this.value)this.value="";
                ob['id'] = this.value;
                return ob;
            },
            setValue(v){
                if(v.ID){
                    this.value = v.ID;
                    //delete(v.ID);
                }
            }

        },
        mounted() {
            this.uid = generateUID();
        }
    })
})
const globalUID = Vue.component('globalUID', function(resolve, reject) {
    resolve({
        props: {
            'value': String
        },
        template: '<div class="globalUID"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['uid'] = this.uid;
                return ob;
            },
            setValue(v){
                if(v.UID){
                    this.uid = v.UID;
                    //delete(v.UID);
                }
            }

        },
        mounted() {
            this.uid = generateUID();
        }
    })
})


const globalRem = Vue.component('globalRem', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="globalRem"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['globalRem'] = $(this.input).val();
                return ob;
            },
            setValue(v){
                if(v.GLOBALREM){
                    this.input.val(v.GLOBALREM);
                    delete(v.GLOBALREM);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<textarea style="width:100%;height:240px">').appendTo(this.gdiv);
        }
    })
})

const globalTitle = Vue.component('globalTitle', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="globalTitle"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['globalTitle'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.GLOBALTITLE){
                    this.input.val(v.GLOBALTITLE);
                    delete(v.GLOBALTITLE);

                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:100%">').appendTo(this.gdiv);
        }

    })
})

const house_Infro = Vue.component('house_Infro', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="house_Infro"></div>',
        methods: {
            getValue(){
                var list = $(this.divList).find('.custom-checkbox');
                var ob = null;
                for(var i=0;i<list.length;i++){
                    if($(list[i]).prop("checked")){
                        if(ob==null)ob={};
                        ob[$(list[i]).val()] = 1;
                        
                    }
                }
                return ob;
            },
            setValue(v){
                for (var key in this.list){
                    if(v[key.toUpperCase()]){
                        if(v[key.toUpperCase()]==1){
                            $(this.divList).find('[value="'+key+'"]').prop("checked","checked");
                        }else{
                            $(this.divList).find('[value="'+key+'"]').prop("checked",null);
                        }
                    }
                }

            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box' style='margin: 0px;padding: 0px;'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = {   
                "HasInternet":"интернет",
                "HasFurniture":"мебель в комнатах",
                "HasPhone":"телефон",
                "HasKitchenFurniture":"мебель на кухне",
                "HasTv":"телевизор",
                "HasWasher":"стиральная машина",
                "HasConditioner":"кондиционер",
                "HasBathtub":"ванна",
                "HasShower":"душевая кабина",
                "HasBathhouse":"баня",
                "HasGarage":"гараж",
                "HasPool":"бассейн",
                "HasDishwasher":"посудомоечная машина",
                "PetsAllowed":"Можно с животными",
                "HasFridge":"холодильник",
                "ChildrenAllowed":"Можно с детьми"
            };
            if(this.field=='house_InfroSale'){
                var list = {   
                    "HasElectricity":"электричество",
                    "HasDrainage":"канализация",
                    "HasWater":"водоснабжение",
                    "HasGas":"газ",
                    "HasSecurity":"охрана",
                    "HasPhone":"телефон",
                    "HasBathhouse":"баня",
                    "HasGarage":"гараж",
                    "HasPool":"бассейн",
                };
                
            }
            this.list = list;
            for (var key in list){
                $('<input type="checkbox" value="'+key+'" class="custom-checkbox" id="'+key+uid+'" >').appendTo(this.divList);
                $('<label for="'+key+uid+'" style="min-width:200px;margin-bottom:8px">').appendTo(this.divList).html(list[key]);

            }
        }

    })
})

const HeatingType = Vue.component('HeatingType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="HeatingType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {
                    'HeatingType': this.input.val(),
                };
                return ob;
            },
            setValue(v){
                if(v.BUILDING_HEATINGTYPE){
                    this.input.val(v.BUILDING_HEATINGTYPE);
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "autonomousGas":"Автономное газовое",
                "centralCoal":"центральное угольное",
                "centralGas":"центральное газовое",
                "diesel":"Дизельное",
                "electric":"Электрическое",
                "fireplace":"Камин",
                "no":"Нет",
                "solidFuelBoiler":"Твердотопливный котел",
                "stove":"Печь"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})

const WcLocationType = Vue.component('WcLocationType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="WcLocationType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['WcLocationType'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.WCLOCATIONTYPE){
                    this.input.val(v.WCLOCATIONTYPE);
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "indoors":"В доме",
                "outdoors":"На улице"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})



const house_Building_MaterialType = Vue.component('house_Building_MaterialType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="house_Building_MaterialType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {
                    'MaterialType': this.input.val(),
                };
                return ob;
            },
            setValue(v){
                if(v.BUILDING_MATERIALTYPE){
                    this.input.val(v.BUILDING_MATERIALTYPE);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "aerocreteBlock":"Газобетонный блок",
                "boards":"Щитовой",
                "brick":"Кирпичный",
                "foamConcreteBlock":"Пенобетонный блок",
                "gasSilicateBlock":"Газосиликатный блок",
                "monolith":"Монолитный",
                "wireframe":"Каркасный",
                "wood":"Деревянный"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})

const SettlementName = Vue.component('SettlementName', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="SettlementName"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['SettlementName'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.SETTLEMENTNAME){
                    this.input.val(v.SETTLEMENTNAME);
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:340px">').appendTo(this.gdiv);
        }

    })
})

const rooms_Infro = Vue.component('rooms_Infro', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="rooms_Infro"></div>',
        methods: {
            getValue(){
                var list = $(this.divList).find('.custom-checkbox');
                var ob = null;
                for(var i=0;i<list.length;i++){
                    if($(list[i]).prop("checked")){
                        if(ob==null)ob={};
                        ob[$(list[i]).val()] = true;
                        
                    }
                }
                return ob;
            },
            setValue(v){
                for (var key in this.list){
                    if(v[key.toUpperCase()]){
                        if(v[key.toUpperCase()]==1){
                            $(this.divList).find('[value="'+key+'"]').prop("checked","checked");
                        }else{
                            $(this.divList).find('[value="'+key+'"]').prop("checked",null);
                        }
                    }
                }
                
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box' style='margin: 0px;padding: 0px;'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = {   
                "HasInternet":"интернет",
                "HasFurniture":"мебель в комнатах",
                "HasPhone":"телефон",
                "HasKitchenFurniture":"мебель на кухне",
                "HasTv":"телевизор",
                "HasWasher":"стиральная машина",
                "HasConditioner":"кондиционер",
                "HasBathtub":"ванна",
                "HasShower":"душевая кабина",
                "HasDishwasher":"посудомоечная машина",
                "HasFridge":"холодильник",
            };
            this.list = list;
            for (var key in list){
                $('<input type="checkbox" value="'+key+'" class="custom-checkbox" id="'+key+uid+'" >').appendTo(this.divList);
                $('<label for="'+key+uid+'" style="min-width:200px;margin-bottom:8px">').appendTo(this.divList).html(list[key]);

            }
        }

    })
})

const ChildrenAllowed = Vue.component('ChildrenAllowed', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="ChildrenAllowed"></div>',
        methods: {
            getValue(){
                if($(this.input).prop("checked")){
                    ob['ChildrenAllowed'] = true;
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.CHILDRENALLOWED){
                    if(v.CHILDRENALLOWED==1){
                        $(this.input).prop("checked","checked");
                    }
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="yard'+uid+'">').appendTo(this.gdiv);
            $('<label for="yard'+uid+'">').appendTo(this.gdiv).html('');
        }

    })
})

const PetsAllowed = Vue.component('PetsAllowed', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="PetsAllowed"></div>',
        methods: {
            getValue(){
                if($(this.input).prop("checked")){
                    ob['PetsAllowed'] = true;
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.PETSALLOWED){
                    if(v.PETSALLOWED==1){
                        $(this.input).prop("checked","checked");
                    }
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="yard'+uid+'">').appendTo(this.gdiv);
            $('<label for="yard'+uid+'">').appendTo(this.gdiv).html('');
        }

    })
})

const TenantsType = Vue.component('TenantsType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="TenantsType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['BargainTerms'] = {
                    'TenantsType': this.input.val(),
                };
                return ob;
            },
            setValue(v){
                if(v.BARGAINTERMS_TENANTSTYPE){
                    this.input.val(v.BARGAINTERMS_TENANTSTYPE);
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "any":"Любой",
                "family":"Семья",
                "female":"Женщина",
                "male":"Мужчина"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})

const roomSale_TotalArea = Vue.component('roomSale_TotalArea', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="roomSale_TotalArea"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['TotalArea'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.TOTALAREA){
                    this.input.val(v.TOTALAREA)
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="text" style="width:80px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
            $(this.input).inputmask('decimal', {});
            $("<div style='margin-left:8px'>").appendTo(this.gdiv).html('м2');
        }

    })
})

const RoomArea = Vue.component('RoomArea', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="RoomArea"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['RoomArea'] = this.input.val();
                if(this.field=="FlatTotalArea"){
                    ob['BargainTerms']={
                        "Price":$(this.Price).val(),
                        "Currency":"rur"
                    }
                }else{
                    ob['BargainTerms']={
                        "Price":$(this.Price).val(),
                        "Currency":"rur",
                        "MortgageAllowed":$(this.MortgageAllowed).prop("checked")
                    }
                }            
                return ob;
            },
            setValue(v){
                if(v.ROOMAREA){
                    this.input.val(v.ROOMAREA);
                }
                if(v.BARGAINTERMS_PRICE){
                    $(this.Price).val(v.BARGAINTERMS_PRICE);
                }
                console.log('RoomArea');
                
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="text" style="width:50px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
            $(this.input).inputmask('decimal', {});
            $("<div style='margin-left:4px'>").appendTo(this.gdiv).html('м2 Цена');
            this.Price = $('<input type="text" style="margin-left:6px;width:80px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
            $(this.Price).inputmask('decimal', {});
            if(this.field=="FlatTotalArea"){
                $("<div style='margin-left:4px'>").appendTo(this.gdiv).html('р. в месяц');
            }else{
                $("<div style='margin-left:4px'>").appendTo(this.gdiv).html('р.');
                this.MortgageAllowed = $('<input type="checkbox" class="custom-checkbox" id="combined'+uid+'">').appendTo(this.gdiv);
                $('<label style="margin-left:8px" for="combined'+uid+'">').appendTo(this.gdiv).html('Возможна ипотека');
                
            }
        }

    })
})


const RoomsCount = Vue.component('RoomsCount', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="RoomsCount"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['RoomsCount'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.ROOMSCOUNT){
                    this.input.val(v.ROOMSCOUNT);
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:110px">').appendTo(this.gdiv);
            var list = {
                "1":"1",
                "2":"2",
                "3":"3",
                "4":"4",
                "5":"5",
                "6":"6 и более",
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})



const RoomsForSaleCount = Vue.component('RoomsForSaleCount', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="RoomsForSaleCount"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['RoomsForSaleCount'] = this.input.val();
                if($(this.combined).prop("checked") && $(this.separate).prop("checked")){
                    ob['RoomType'] = "both";
                }else{
                    if($(this.combined).prop("checked")){
                        ob['RoomType'] = "combined";
                        
                    }
                    if($(this.separate).prop("checked")){
                        ob['RoomType'] = "separate";
                        
                    }
                }

                return ob;
            },
            setValue(v){
                if(v.ROOMSFORSALECOUNT){
                    this.input.val(v.ROOMSFORSALECOUNT);
                }
                if(v.ROOMTYPE){
                    if(v.ROOMTYPE == "both"){
                        $(this.combined).prop("checked","checked");
                        $(this.separate).prop("checked","checked");
                    }
                    if(v.ROOMTYPE == "combined"){
                        $(this.combined).prop("checked","checked");
                        $(this.separate).prop("checked",null);
                    }
                    if(v.ROOMTYPE == "separate"){
                        $(this.combined).prop("checked",null);
                        $(this.separate).prop("checked","checked");
                    }
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:110px">').appendTo(this.gdiv);
            var list = {
                "1":"1",
                "2":"2",
                "3":"3",
                "4":"4",
                "5":"5",
                "6":"6 и более",
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
            this.combined = $('<input type="checkbox" class="custom-checkbox" id="combined'+uid+'">').appendTo(this.gdiv);
            $('<label style="margin-left:8px;" for="combined'+uid+'">').appendTo(this.gdiv).html('Смежная');
            this.separate = $('<input type="checkbox" class="custom-checkbox" id="separate'+uid+'">').appendTo(this.gdiv);
            $('<label style="margin-left:8px" for="separate'+uid+'">').appendTo(this.gdiv).html('Изолированная');
        }

    })
})

const flat_SaleType = Vue.component('flat_SaleType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="flat_SaleType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['BargainTerms'] = {
                    'SaleType': this.input.val(),
                };
                return ob;
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "alternative":"Альтернатива",
                "free":"Свободная продажа"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})

const BargainAllowed = Vue.component('BargainAllowed', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="BargainAllowed"></div>',
        methods: {
            itemClick(){
                if($(this.input).prop("checked")){
                    $(this.div1).show();
                    $(this.div2).show();
                }else{
                    $(this.div1).hide();
                    $(this.div2).hide();
                    
                }
                
            },
            getValue(){
                
                if($(this.input).prop("checked")){
                    return {
                        "BargainTerms":{
                            "BargainAllowed":1,
                            "BargainPrice":$(this.BargainPrice).val(),
                            "BargainConditions":$(this.BargainConditions).val()
                        }
                    };
                }else{
                    return {                    
                        "BargainTerms":{
                            "BargainAllowed":0,
                            "BargainPrice":0,
                            "BargainConditions":""
                        }
                        
                    };
                }
            },
            setValue(v){
                if(v.BARGAINTERMS_BARGAINALLOWED){
                    if(v.BARGAINTERMS_BARGAINALLOWED==1){
                        $(this.input).prop("checked","checked");
                        $(this.div1).show();
                        $(this.div2).show();
                        $(this.BargainPrice).val(v.BARGAINTERMS_BARGAINPRICE);
                        $(this.BargainConditions).val(v.BARGAINTERMS_BARGAINCONDITIONS);
                    }
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="yard'+uid+'">').appendTo(this.gdiv);
            this.input.click($.proxy(this.itemClick));

            $('<label for="yard'+uid+'">').appendTo(this.gdiv).html('');
            this.div1 = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            $('<div class="label" >').appendTo(this.div1).html("Цена с учетом торга");
            this.BargainPrice = $('<input type="text" style="width:80px;padding-left:4px;padding-right:4px" >').appendTo(this.div1);
            $(this.BargainPrice).inputmask('decimal', {});
            $("<div style='margin-left:4px'>").appendTo(this.div1).html("р. в месяц");
            $(this.div1).hide();
            this.div2 = $('<div>').appendTo(this.$el);
            $("<div>").appendTo(this.div2).html('Торг при условии');
            this.BargainConditions = $("<textarea style='width:99%;pading:8px;height:80px'>").appendTo(this.div2);
            $(this.div2).hide();
            
        }

    })
})



const UtilitiesTerms = Vue.component('UtilitiesTerms', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="UtilitiesTerms"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['BargainTerms'] = {
                    'UtilitiesTerms': {},
                };
                ob['BargainTerms']['UtilitiesTerms'] = $(this.input).val();
                return ob;
            },
            setValue(v){
                if(v.BARGAINTERMS_UTILITIESTERMS){
                    $(this.input).val(v.BARGAINTERMS_UTILITIESTERMS);
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "IncludedInPrice":"Включены в стоимость",
                "Price":"Сумма платежей",
                "FlowMetersNotIncludedInPrice":"Счетчики оплачиваются отдельно"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})



const flat_Building_Parking = Vue.component('flat_Building_Parking', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="flat_Building_Parking"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {
                    'Parking': {
                        "Type":this.input.val()
                    }    
                };
                return ob;
            },
            setValue(v){
                if(v.BUILDING_PARKING){
                    var J = JSON.parse(v.BUILDING_PARKING);
                    this.input.val(J.Type);
//                    console.log(J.Type)
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "ground":"Наземная",
                "multilevel":"Многоуровневая",
                "open":"Открытая",
                "roof":"На крыше",
                "underground":"Подземная"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})

const Building_HasGarbageChute = Vue.component('Building_HasGarbageChute', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_HasGarbageChute"></div>',
        methods: {
            getValue(){
                if($(this.input).prop("checked")){
                    ob['Building'] = {
                        "HasGarbageChute":1
                    };
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.BUILDING_HASGARBAGECHUTE){
                    if(v.BUILDING_HASGARBAGECHUTE==1){
                        $(this.input).prop("checked","checked");
                    }
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="yard'+uid+'">').appendTo(this.gdiv);
            $('<label for="yard'+uid+'">').appendTo(this.gdiv).html('Мусоропровод');
        }

    })
})


const HasRamp = Vue.component('HasRamp', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="HasRamp"></div>',
        methods: {
            getValue(){
                if($(this.input).prop("checked")){
                    ob['HasRamp'] = 1;
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.HASRAMP){
                    if(v.HASRAMP==1){
                        $(this.input).prop("checked","checked");
                    }
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="yard'+uid+'">').appendTo(this.gdiv);
            $('<label for="yard'+uid+'">').appendTo(this.gdiv).html('');
        }

    })
})



const Building_CargoLiftsCount = Vue.component('Building_CargoLiftsCount', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'type': String
        },
        template: '<div class="Building_CargoLiftsCount"></div>',
        methods: {
            itemClick(ev){
                $(this.divList).find('div').removeClass('selectItem');
                $(ev.delegateTarget).addClass('selectItem');
                this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                switch (this.type) {
                    case 'gorizontList':
                        if($(this.divList).find('.selectItem').length!=0){
                            return {
                                "Building":{
                                    "CargoLiftsCount":$($(this.divList).find('.selectItem')[0]).attr('value')
                                }
                            };
                        }else{
                            return null;
                        }
                        break;
                    default:
                        var ob = {};
                        if($(this.input).val()!="no"){
                            ob['Building'] = {
                                "CargoLiftsCount":this.input.val()
                                
                            };
                            return ob;
                        }else{
                            return null;
                        }
                }
                
            },
            setValue(v){
                if(v.BUILDING_CARGOLIFTSCOUNT){
                    $(this.divList).find("[value='" + v.BUILDING_CARGOLIFTSCOUNT + "']").addClass('selectItem');
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            var list = {
                "no":"нет",
                "1":"1",
                "2":"2",
                "3":"3",
                "4":"4"
            }
            switch (this.type) {
                case 'gorizontList':
                    this.divList = $("<div class='items flex-box' style='margin: 0px;padding: 0px;'>").appendTo(this.gdiv);
                    this.divList.css('display', 'flex');
                    for(var key in list){
                        var b = $("<div class='itemGorizont' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                        b.click($.proxy(this.itemClick));
                    }
                    
                    break;
                default:
                    this.input =$('<select class="select-css" style="width:60px">').appendTo(this.gdiv);
                    for(var key in list){
                        $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                        
                    }
            }
        }

    })
})


const Building_PassengerLiftsCount = Vue.component('Building_PassengerLiftsCount', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'type': String
        },
        template: '<div class="Building_PassengerLiftsCount"></div>',
        methods: {
            itemClick(ev){
                $(this.divList).find('div').removeClass('selectItem');
                $(ev.delegateTarget).addClass('selectItem');
                this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                switch (this.type) {
                    case 'gorizontList':
                        if($(this.divList).find('.selectItem').length!=0){
                            return {
                                "Building":{
                                    "PassengerLiftsCount":$($(this.divList).find('.selectItem')[0]).attr('value')
                                }
                            };
                        }else{
                            return null;
                        }
                        break;
                    default:
                        var ob = {};
                        if($(this.input).val()!="no"){
                            ob['Building'] = {
                                "PassengerLiftsCount":this.input.val()
                                
                            };
                            return ob;
                        }else{
                            return null;
                        }
                }
                
            },
            setValue(v){
                if(v.BUILDING_PASSENGERLIFTSCOUNT){
                    $(this.divList).find("[value='" + v.BUILDING_PASSENGERLIFTSCOUNT + "']").addClass('selectItem');
                }
                
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            var list = {
                "no":"нет",
                "1":"1",
                "2":"2",
                "3":"3",
                "4":"4"
            }
            switch (this.type) {
                case 'gorizontList':
                    this.divList = $("<div class='items flex-box' style='margin: 0px;padding: 0px;'>").appendTo(this.gdiv);
                    this.divList.css('display', 'flex');
                    for(var key in list){
                        var b = $("<div class='itemGorizont' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                        b.click($.proxy(this.itemClick));
                    }
                    
                    break;
                default:
                    this.input =$('<select class="select-css" style="width:60px">').appendTo(this.gdiv);
                    for(var key in list){
                        $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                        
                    }
            }
        }

    })
})

const Building_MaterialType = Vue.component('Building_MaterialType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_MaterialType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {
                    'MaterialType': $(this.input).val(),
                    'Series':$(this.Series).val()
                };
                return ob;
            },
            setValue(v){
                if(v.BUILDING_MATERIALTYPE){
                    this.input.val(v.BUILDING_MATERIALTYPE);
                }
                if(v.BUILDING_SERIES){
                    this.Series.val(v.BUILDING_SERIES);
                }
                
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "aerocreteBlock":"Газобетонный блок",
                "block":"Блочный",
                "boards":"Щитовой",
                "brick":"Кирпичный",
                "foamConcreteBlock":"Пенобетонный блок",
                "gasSilicateBlock":"Газосиликатный блок",
                "monolith":"Монолитный",
                "monolithBrick":"Монолитно-кирпичный",
                "old":"Старый фонд",
                "panel":"Панельный",
                "stalin":"Сталинский",
                "wireframe":"Каркасный",
                "wood":"Деревянный",
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
            this.Series = $('<input type="text" style="margin-left:12px;width:90px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
            
        }

    })
})

const flat_Infro = Vue.component('flat_Infro', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="flat_Infro"></div>',
        methods: {
            getValue(){
                var list = $(this.divList).find('.custom-checkbox');
                var ob = null;
                for(var i=0;i<list.length;i++){
                    if($(list[i]).prop("checked")){
                        if(ob==null)ob={};
                        ob[$(list[i]).val()] = 1;
                        
                    }else{
                        if(ob==null)ob={};
                        ob[$(list[i]).val()] = 0;
                    }
                }
                return ob;
            },
            setValue(v){
                for (var key in this.list){
                    if(v[key.toUpperCase()]){
                        if(v[key.toUpperCase()]==1){
                            $(this.divList).find('[value="'+key+'"]').prop("checked","checked");
                        }else{
                            $(this.divList).find('[value="'+key+'"]').prop("checked",null);
                        }
                    }
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box' style='margin: 0px;padding: 0px;'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = {   
                "HasInternet":"интернет",
                "HasFurniture":"мебель в комнатах",
                "HasPhone":"телефон",
                "HasKitchenFurniture":"мебель на кухне",
                "HasTv":"телевизор",
                "HasWasher":"стиральная машина",
                "HasConditioner":"кондиционер",
                "HasBathtub":"ванна",
                "HasShower":"душевая кабина",
                "HasDishwasher":"посудомоечная машина",
                "PetsAllowed":"Можно с животными",
                "HasFridge":"холодильник",
                "ChildrenAllowed":"Можно с детьми"
            };
            this.list = list;
            for (var key in list){
                $('<input type="checkbox" value="'+key+'" class="custom-checkbox" id="'+key+uid+'" >').appendTo(this.divList);
                $('<label for="'+key+uid+'" style="min-width:200px;margin-bottom:8px">').appendTo(this.divList).html(list[key]);

            }
        }

    })
})


const RepairType = Vue.component('RepairType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="RepairType"></div>',
        methods: {
            getValue(){
                return {
                    'RepairType':this.input.val()
                };
            },
            setValue(v){
                if(v.REPAIRTYPE){
                    this.input.val(v.REPAIRTYPE);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "cosmetic":"Косметический",
                "design":"Дизайнерский",
                "euro":"Евроремонт",
                "no":"Без ремонта"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})

const WindowsViewType = Vue.component('WindowsViewType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="WindowsViewType"></div>',
        methods: {
            getValue(){
                var ob = {};
                if($(this.yard).prop("checked") || $(this.street).prop("checked")){
                    if($(this.combined).prop("checked") && $(this.combined).prop("separate")){
                        ob['WindowsViewType'] = "yardAndStreet";
                    }else{
                        if($(this.yard).prop("checked")){
                            ob['WindowsViewType'] = "yard";
                            
                        }
                        if($(this.street).prop("checked")){
                            ob['WindowsViewType'] = "street";
                            
                        }
                    }

                    return ob;
                }else{
                    return null;
                }

            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.yard = $('<input type="checkbox" class="custom-checkbox" id="yard'+uid+'">').appendTo(this.gdiv);
            $('<label for="yard'+uid+'">').appendTo(this.gdiv).html('Во двор');
            this.street = $('<input type="checkbox" class="custom-checkbox" id="street'+uid+'">').appendTo(this.gdiv);
            $('<label style="margin-left:8px" for="street'+uid+'">').appendTo(this.gdiv).html('На улицу');

        }

    })
})

const KitchenArea = Vue.component('KitchenArea', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="KitchenArea"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['KitchenArea'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.KITCHENAREA){
                    this.input.val(v.KITCHENAREA);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="text" style="width:80px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
            $(this.input).inputmask('decimal', {});
            $("<div style='margin-left:8px'>").appendTo(this.gdiv).html('м2');
        }

    })
})


const LivingArea = Vue.component('LivingArea', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="LivingArea"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['LivingArea'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.LIVINGAREA){
                    this.input.val(v.LIVINGAREA);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="text" style="width:80px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
            $(this.input).inputmask('decimal', {});
            $("<div style='margin-left:8px'>").appendTo(this.gdiv).html('м2');
        }

    })
})


const AllRoomsArea = Vue.component('AllRoomsArea', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="AllRoomsArea"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['AllRoomsArea'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.ALLROOMSAREA){
                    this.input.val(v.ALLROOMSAREA);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="text" style="width:250px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
        }

    })
})


const FlatTotalArea = Vue.component('FlatTotalArea', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="FlatTotalArea"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['TotalArea'] = this.input.val();
                if(this.field=="FlatTotalArea"){
                    ob['BargainTerms']={
                        "Price":$(this.Price).val(),
                        "Currency":"rur"
                    }
                }else{
                    ob['BargainTerms']={
                        "Price":$(this.Price).val(),
                        "Currency":"rur",
                        "MortgageAllowed":$(this.MortgageAllowed).prop("checked")
                    }
                }            
                return ob;
            },
            setValue(v){
                if(v.TOTALAREA){
                    this.input.val(v.TOTALAREA);
                }
                if(v.BARGAINTERMS_PRICE){
                    $(this.Price).val(v.BARGAINTERMS_PRICE);
                }
                console.log('FlatTotalArea')
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="text" style="width:50px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
            $(this.input).inputmask('decimal', {});
            $("<div style='margin-left:4px'>").appendTo(this.gdiv).html('м2 Цена');
            this.Price = $('<input type="text" style="margin-left:6px;width:80px;padding-left:4px;padding-right:4px" >').appendTo(this.gdiv);
            $(this.Price).inputmask('decimal', {});
            if(this.field=="FlatTotalArea"){
                $("<div style='margin-left:4px'>").appendTo(this.gdiv).html('р. в месяц');
            }else{
                $("<div style='margin-left:4px'>").appendTo(this.gdiv).html('р.');
                this.MortgageAllowed = $('<input type="checkbox" class="custom-checkbox" id="combined'+uid+'">').appendTo(this.gdiv);
                $('<label style="margin-left:8px" for="combined'+uid+'">').appendTo(this.gdiv).html('Возможна ипотека');
                
            }
        }

    })
})

const FlatRoomsCount = Vue.component('FlatRoomsCount', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="FlatRoomsCount"></div>',
        methods: {
            inputSelect(){
                switch ($(this.input).val()) {
                    case '1':
                        $(this.subdiv).hide();
                    break;
                    case '7':
                        $(this.subdiv).hide();
                    break;
                    case '8':
                        $(this.subdiv).hide();
                    break;
                    default:
                        $(this.subdiv).show();
                    
                }

            },
            getValue(){
                var ob = {};
                ob['FlatRoomsCount']= $(this.input).val();
                
                if($(this.IsPenthouse).prop("checked")){
                    ob['IsPenthouse'] = 1;
                }else{
                    ob['IsPenthouse'] = 0;
                }
                if($(this.combined).prop("checked") && $(this.separate).prop("checked")){
                    ob['RoomType'] = "both";
                }else{
                    if($(this.combined).prop("checked")){
                        ob['RoomType'] = "combined";
                        
                    }
                    if($(this.separate).prop("checked")){
                        ob['RoomType'] = "separate";
                        
                    }
                }

                
                return ob;
            },
            setValue(v){
                if(v.FLATROOMSCOUNT){
                    $(this.input).val(v.FLATROOMSCOUNT);
                    this.inputSelect();
                }
                if(v.ROOMTYPE){
                    if(v.ROOMTYPE == "both"){
                        $(this.combined).prop("checked","checked");
                        $(this.separate).prop("checked","checked");
                    }
                    if(v.ROOMTYPE == "combined"){
                        $(this.combined).prop("checked","checked");
                        $(this.separate).prop("checked",null);
                    }
                    if(v.ROOMTYPE == "separate"){
                        $(this.combined).prop("checked",null);
                        $(this.separate).prop("checked","checked");
                    }
                }
                if(v.ISPENTHOUSE){
                    if(v.ISPENTHOUSE==1){
                        $(this.IsPenthouse).prop("checked","checked");
                    }else{
                        $(this.IsPenthouse).prop("checked",null);
                    }                    
                }
                
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            var div1 = $('<div>').appendTo(this.gdiv);

            var div = $('<div class="vfield" style="display:flex">').appendTo(div1);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(div);
            var list = {
                "1":"1",
                "2":"2",
                "3":"3",
                "4":"4",
                "5":"5",
                "6":"6 и более",
                "7":"свободная планировка",
                "8":"студия",
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
            this.input.change($.proxy(this.inputSelect))

            this.IsPenthouse = $('<input type="checkbox" class="custom-checkbox" id="IsPenthouse'+uid+'">').appendTo(div);
            $('<label style="margin-left:12px" for="IsPenthouse'+uid+'">').appendTo(div).html('Пентхаус');
            this.subdiv = $('<div class="vfield" style="display:flex">').appendTo(div1);
            this.combined = $('<input type="checkbox" class="custom-checkbox" id="combined'+uid+'">').appendTo(this.subdiv);
            $('<label for="combined'+uid+'">').appendTo(this.subdiv).html('Смежная');
            this.separate = $('<input type="checkbox" class="custom-checkbox" id="separate'+uid+'">').appendTo(this.subdiv);
            $('<label style="margin-left:8px" for="separate'+uid+'">').appendTo(this.subdiv).html('Изолированная');
            $(this.subdiv).hide();

            
        }

    })
})

const IsApartments = Vue.component('IsApartments', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="IsApartments"></div>',
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                var ob = {};
                if($(this.divList).find('.selectItem').length !=0 && $(this.divList).find('.selectItem').attr('value')=="IsApartments") {
                    return {
                        'IsApartments':1
                    };
                }else{
                    return {
                        'IsApartments':0
                    };
                }
            },
            setValue(v){
                if(v.ISAPARTMENTS){
                    if(v.ISAPARTMENTS==1){
                        $(this.divList).find("[value='IsApartments']").addClass('selectItem');
                    }else{
                        $(this.divList).find("[value='flat']").addClass('selectItem');
                    }
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "flat":"Квартира",
                    "IsApartments":"Апартаменты"
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }
        }
    })
})



const GarageTH = Vue.component('GarageTH', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="GarageTH"></div>',
        methods: {
            getValue(){
                var list = $(this.divList).find('.custom-checkbox');
                var ob = null;
                for(var i=0;i<list.length;i++){
                    if($(list[i]).prop("checked")){
                        if(ob==null)ob={};
                        ob[$(list[i]).val()] = 1;
                        
                    }
                }
                return ob;
            },
            setValue(v){
                if(v.HASLIGHT){
                    if(v.HASLIGHT==1){
                        $(this.divList).find('[value="HasLight"]').prop("checked","checked");
                        delete(v.HASLIGHT);
                    }
                }
                if(v.HASHEATING){
                    if(v.HASHEATING==1){
                        $(this.divList).find('[value="HasHeating"]').prop("checked","checked");
                        delete(v.HASHEATING);
                    }
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box' style='margin: 0px;padding: 0px;'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "HasLight":"Свет",
                    "HasElectricity":"Электричетво",                 
                    "HasHeating":"Отопление",
                    "HasWater":"Вода",
                    "HasExtinguishingSystem":"Система пожаротушения"
                };
            for (var key in list){
                $('<input type="checkbox" value="'+key+'" class="custom-checkbox" id="'+key+uid+'" >').appendTo(this.divList);
                $('<label for="'+key+uid+'" style="min-width:200px;margin-bottom:8px">').appendTo(this.divList).html(list[key]);

            }
        }
    })
})

const AgentBonus = Vue.component('AgentBonus', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="AgentBonus"></div>',
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
                    switch ($(ev.delegateTarget).attr('value')) {
                        case 'fixed':
                            $(this.input).inputmask('decimal', {});
                            $(this.input).css('width','80px');
                            $(this.input).show();
                            break;
                        case 'percent':
                            $(this.input).inputmask({
                                mask: '9{1,3}'
                            });
                            $(this.input).css('width','40px');
                            $(this.input).show();
                            break;
                        default:
                        $(this.input).hide();
                    }

            },
            getValue(){
                var ob = {"BargainTerms":{}};
                if($(this.divList).find('.selectItem').length !=0 && $(this.divList).find('.selectItem').attr('value')!="not") {
                    ob['BargainTerms']['AgentBonus'] ={
                        "Value":$(this.input).val(),
                        "PaymentType":$(this.divList).find('.selectItem').attr('value'),
                        "Currency":"rur"
                    };
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "not":"Нет",
                    "fixed":"Фиксированная сумма",
                    "percent":"Процент от сделки"
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }
            this.div = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            $('<div class="label" >').appendTo(this.div);

            this.input = $('<input type="text" style="width:80px;padding-left:4px;padding-right:4px" >').appendTo(this.div);
            $(this.input).inputmask('decimal', {});
            $(this.input).hide();
            
        }
    })
})


const Garage_Status = Vue.component('Garage_Status', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Garage_Status"></div>',
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                var ob = {"Garage":{}};
                if($(this.divList).find('.selectItem').length !=0) {
                    ob['Garage']['Status'] =$(this.divList).find('.selectItem').attr('value');
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.GARAGE_STATUS){
                    $(this.divList).find("[value='" + v.GARAGE_STATUS + "']").addClass('selectItem');
                    delete(v.GARAGE_STATUS);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "cooperative":"Кооператив",
                    "ownership":"Собственность",                 
                    "byProxy":"По доверенности"
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }
        }
    })
})



const Garage_Type = Vue.component('Garage_Type', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Garage_Type"></div>',
        computed: {

        },
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                var ob = {"Garage":{}};
                if($(this.divList).find('.selectItem').length !=0) {
                    ob['Garage']['Type'] =$(this.divList).find('.selectItem').attr('value');
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.GARAGE_TYPE){
                    $(this.divList).find("[value='" + v.GARAGE_TYPE + "']").addClass('selectItem');
                    delete(v.GARAGE_TYPE);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "box":"Бокс",
                    "garage":"Гараж",
                    "parkingPlace":"Машиноместо"                  
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }
        }
    })
})


const Building_GatesType = Vue.component('Building_GatesType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_GatesType"></div>',
        methods: {
            getValue(){
                var ob = {};
                if(this.input.val()!=""){
                    ob['Building'] = {'GatesType':this.input.val()};
                    return ob;
                }else{
                    return null;
                }
                
            },
            setValue(v){
                if(v.BUILDING_GATESTYPE){
                    this.input.val(v.BUILDING_GATESTYPE);
                    delete(v.BUILDING_GATESTYPE);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "":"",                
                "atZero":"На нулевой отметке",
                "dockType":"Докового типа",
                "onRamp":"На пандусе"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})



const FloorMaterialTypeType = Vue.component('FloorMaterialTypeType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="FloorMaterialTypeType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['FloorMaterialTypeType'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.FLOORMATERIALTYPETYPE){
                    this.input.val(v.FLOORMATERIALTYPETYPE);
                    delete(v.FLOORMATERIALTYPETYPE);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "":"",                
                "asphalt":"Асфальт",
                "concrete":"Бетон",
                "laminate":"Ламинат",
                "linoleum":"Линолеум",
                "polymeric":"Полимерный",
                "reinforcedConcrete":"Железобетон",
                "selfLeveling":"Наливной",
                "tile":"Плитка",
                "wood":"Деревянный"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})


const HasEncumbrances = Vue.component('HasEncumbrances', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="HasEncumbrances"></div>',
        methods: {
            getValue(){
                if($(this.HasInvestmentProject).prop("checked")){
                    var ob = {
                        "HasEncumbrances":$(this.HasInvestmentProject).prop("checked")
                        }
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.PossibleToChangePermitedUseType = $('<input type="checkbox" class="custom-checkbox" id="HasEncumbrances'+uid+'">').appendTo(this.gdiv);
            $('<label for="HasEncumbrances'+uid+'">').appendTo(this.gdiv).html('');
        }

    })
})



const HasInvestmentProject = Vue.component('HasInvestmentProject', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="HasInvestmentProject"></div>',
        methods: {
            getValue(){
                if($(this.HasInvestmentProject).prop("checked")){
                    var ob = {
                        "HasInvestmentProject":$(this.HasInvestmentProject).prop("checked")
                        }
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.PossibleToChangePermitedUseType = $('<input type="checkbox" class="custom-checkbox" id="HasInvestmentProject'+uid+'">').appendTo(this.gdiv);
            $('<label for="HasInvestmentProject'+uid+'">').appendTo(this.gdiv).html('');
        }

    })
})


const PermittedUseType = Vue.component('PermittedUseType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="PermittedUseType"></div>',
        methods: {
            getValue(){
                var ob = {
                    "PermittedUseType": this.input.val(),
                    "PossibleToChangePermitedUseType":$(this.PossibleToChangePermitedUseType).prop("checked")
                    }
                return ob;
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "agricultural":"Cельскохозяйственное использование",
                "businessManagement":"Деловое управление",
                "commonUseArea":"Общее пользование территории",
                "highriseBuildings":"Высотная застройка",
                "hotelAmenities":"Гостиничное обслуживание",
                "individualHousingConstruction":"Индивидуальное жилищное строительство (ИЖС)",
                "industry":"Промышленность",
                "leisure":"Отдых (рекреация)",
                "lowriseHousing":"Малоэтажное жилищное строительство (МЖС)",
                "publicUseOfCapitalConstruction":"Общественное использование объектов капитального строительства",
                "serviceVehicles":"Обслуживание автотранспорта",
                "shoppingCenters":"Торговые центры",
                "warehouses":"Склады"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
            $('<div style="width:12px">').appendTo(this.gdiv);
            this.PossibleToChangePermitedUseType = $('<input type="checkbox" class="custom-checkbox" id="PossibleToChangePermitedUseType'+uid+'">').appendTo(this.gdiv);
            $('<label for="PossibleToChangePermitedUseType'+uid+'">').appendTo(this.gdiv).html('Возможно изменить');
        }

    })
})


const Land_Status = Vue.component('Land_Status', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Land_Status"></div>',
        methods: {
            getValue(){
                var ob = {
                    "Land":{
                        "Status": this.input.val(),
                        "PossibleToChangeStatus":$(this.PossibleToChangeStatus).prop("checked")
                    }
                };
                return ob;
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "settlements":"Поселений",
                "forAgriculturalPurposes":"Участок сельскохозяйственного назначения",
                "industryTransportCommunications":"Участок промышленности, транспорта, связи и иного не сельхоз. назначения"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
            $('<div style="width:12px">').appendTo(this.gdiv);
            this.PossibleToChangeStatus = $('<input type="checkbox" class="custom-checkbox" id="PossibleToChangeStatus'+uid+'">').appendTo(this.gdiv);
            $('<label for="PossibleToChangeStatus'+uid+'">').appendTo(this.gdiv).html('Возможно изменить');
        }

    })
})


const DrivewayType = Vue.component('DrivewayType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="DrivewayType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['DrivewayType'] =  this.input.val();
                return ob;
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "no":"Нет",
                "asphalt":"Асфальтированная дорога",
                "ground":"Грунтовая дорога"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})



const PropertyType = Vue.component('PropertyType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="PropertyType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['PropertyType'] = this.input.val();
                return ob;
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "building":"здание",
                "freeAppointment":"помещение свободного назначения",
                "garage":"гараж",
                "industry":"производство",
                "land":"земля",
                "office":"офис",
                "shoppingArea":"торговая площадь",
                "warehouse":"склад"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})


const EstateType = Vue.component('EstateType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="EstateType"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['EstateType'] = this.input.val();
                return ob;
            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:190px">').appendTo(this.gdiv);
            var list = {
                "owned":"В собственности",
                "rent":"В аренде"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})


const Building_WorkingDaysType = Vue.component('Building_WorkingDaysType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Building_WorkingDaysType"></div>',
        computed: {

        },
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                var ob = {"Building":{}};
                if($(this.divList).find('.selectItem').length !=0) {
                    ob['Building']['WorkingDaysType'] =$(this.divList).find('.selectItem').attr('value');
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.BUILDING_WORKINGDAYSTYPE){
                    $(this.divList).find("[value='" + v.BUILDING_WORKINGDAYSTYPE + "']").addClass('selectItem');
                    delete(v.BUILDING_WORKINGDAYSTYPE);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "everyday":"Ежедневно",
                    "weekdays":"Будни",
                    "weekends":"Выходные"                    
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }
        }
    })
})



const Land = Vue.component('Land', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'tip':String
        },
        template: '<div class="Land"></div>',
        methods: {
            getValue(){
                var ob = {};
                var landType = "owned";
                if($(this.rent).prop("checked")){
                    landType = "rent";
                }
                switch (this.tip) {
                    case 'Sale':
                        ob['Land'] = JSON.stringify({
                            'Area': this.input.val(),
                            'AreaUnitType':this.AreaUnitType.val(),
                            'Type':landType
                        });
                        ob['BargainTerms'] = {
                            "Price":$(this.Price).val(),
                            "Currency":"rur"
                        }
                        break;
                    default:
                        ob['Land'] =JSON.stringify( {
                            'Area': this.input.val(),
                            'AreaUnitType':this.AreaUnitType.val(),
                            'Type':landType
                        });
                }
                return ob;
            },
            setValue(v){
                if(v.LAND){
                    v_= JSON.parse(v.LAND);
                    this.input.val(v_.Area);
                    this.AreaUnitType.val(v_.AreaUnitType);
                    if(v_.Type == "rent"){
                        $(this.rent).prop("checked","checked")
                    }else{
                        $(this.direct).prop("checked","checked")
                    }
                    delete(v.LAND);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:50px">').appendTo(this.gdiv);
            $(this.input).inputmask('decimal', {});
            $("<div style='width:12px'>").appendTo(this.gdiv);
            this.AreaUnitType =$('<select class="select-css" style="width:90px">').appendTo(this.gdiv);
            var list = {
                "hectare":"Гектар",
                "sotka":"Сотка"
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.AreaUnitType);
            }
            switch (this.tip) {
                case 'notSale':
                    break;
                case 'Sale':
                    this.Price =$('<input type="text" style="width:80px;margin-left:12px">').appendTo(this.gdiv);
                    $(this.Price).inputmask('decimal', {});
                    $('<div style="margin-left:4px">').appendTo(this.gdiv).html('цена р.')
                    // code
                    break;
                case 'Rent':
                    this.Price =$('<input type="text" style="width:80px;margin-left:12px">').appendTo(this.gdiv);
                    $(this.Price).inputmask('decimal', {});
                    $('<div style="margin-left:4px">').appendTo(this.gdiv).html('цена р.');
                    this.PriceTip =$('<select class="select-css" style="width:100px;margin-left:8px">').appendTo(this.gdiv);
                    $('<option value="KVG">в год</option>').appendTo(this.PriceTip);
                    $('<option value="KVM">в месяц</option>').appendTo(this.PriceTip);
                    break;
                default:
                    $("<div style='width:12px'>").appendTo(this.gdiv);
                    this.direct = $('<input name="Type" class="custom-radio" id="owned'+uid+'" type="radio" value="owned" checked="true">').appendTo(this.gdiv);
                    $('<label for="owned'+uid+'">').appendTo(this.gdiv).html('В собственности');
                    var div = $('<div style="display:flex;margin-left:12px">').appendTo(this.gdiv);
                    this.rent = $('<input name="Type" class="custom-radio" id="rent'+uid+'" type="radio" value="rent">').appendTo(this.gdiv);
                    $('<label for="rent'+uid+'">').appendTo(this.gdiv).html('В аренде');
            }
        }

    })
})



const Building_StatusType = Vue.component('Building_StatusType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Building_StatusType"></div>',
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            
            getValue(){
                var ob = {"Building":{}};
                if($(this.divList).find('.selectItem').length !=0) {
                    ob['Building']['StatusType'] =$(this.divList).find('.selectItem').attr('value');
                    return ob;
                }else{
                    return null;
                }

            },
            setValue(v){
                if(v.BUILDING_STATUSTYPE){
                    var list = $(this.divList).find('.item');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).attr('value')==v.BUILDING_STATUSTYPE){
                            $(list[i]).addClass('selectItem');
                        }
                    }
                    delete(v.BUILDING_STATUSTYPE);
                }
            }
        },
        mounted() {
                        var uid = generateUID();

            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "operational":"Действующее",
                    "project":"Проект",
                    "underConstruction":"Строящееся"
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }


        }

    })
})


const Building_ClassType = Vue.component('Building_ClassType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Building_ClassType"></div>',
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                var ob = {"Building":{}};
                if($(this.divList).find('.selectItem').length !=0) {
                    ob['Building']['ClassType'] =$(this.divList).find('.selectItem').attr('value');
                    return ob;
                }else{
                    return null;
                }

            },
            setValue(v){
                if(v.BUILDING_CLASSTYPE){
                    var list = $(this.divList).find('.item');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).attr('value')==v.BUILDING_CLASSTYPE){
                            $(list[i]).addClass('selectItem');
                        }
                    }
                    delete(v.BUILDING_CLASSTYPE);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "a":"A",
                    "aPlus":"A+",
                    "b":"B",
                    "bMinus":"B-",
                    "bPlus":"B+",
                    "c":"C"
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }


        }

    })
})

const Building_Type = Vue.component('Building_Type', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Building_Type"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {"Building":{}};
                ob['Building']['Type'] =$(this.input).val();
                return ob;

            },
            setValue(v){
                if(v.BUILDING_TYPE){
                    $(this.input).val(v.BUILDING_TYPE);
                    delete(v.BUILDING_TYPE);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:370px">').appendTo(this.gdiv);
            var list = {
                "administrativeBuilding":"Административное здание",
                "businessCenter":"Бизнес-центр",
                "businessCenter2":"Деловой центр",
                "businessHouse":"Деловой дом",
                "businessPark":"Бизнес-парк",
                "businessQuarter":"Бизнес-квартал",
                "businessQuarter2":"Деловой квартал",
                "free":"Объект свободного назначения",
                "industrialComplex":"Производственный комплекс",
                "industrialPark":"Индустриальный парк",
                "industrialSite":"Промплощадка",
                "industrialWarehouseComplex":"Производственно-складской комплекс",
                "logisticsCenter":"Логистический центр",
                "logisticsComplex":"Логистический комплекс",
                "logisticsPark":"Логистический парк",
                "mansion":"Особняк",
                "manufactureBuilding":"Производственное здание",
                "manufacturingFacility":"Производственный цех",
                "modular":"Модульное здание",
                "multifunctionalComplex":"Многофункциональный комплекс",
                "officeAndHotelComplex":"Офисно-гостиничный комплекс",
                "officeAndResidentialComplex":"Офисно-жилой комплекс",
                "officeAndWarehouse":"Офисно-складское здание",
                "officeAndWarehouseComplex":"Офисно-складской комплекс",
                "officeBuilding":"Офисное здание",
                "officeCenter":"Офисный центр",
                "officeComplex":"Офисный комплекс",
                "officeIndustrialComplex":"Офисно-производственный комплекс",
                "officeQuarter":"Офисный квартал",
                "old":"Старый фонд",
                "other":"Другое",
                "outlet":"Аутлет",
                "propertyComplex":"Имущественный комплекс",
                "residentialComplex":"Жилой комплекс",
                "residentialHouse":"Жилой дом",
                "shoppingAndBusinessComplex":"Торгово-деловой комплекс",
                "shoppingAndCommunityCenter":"Торгово-общественный центр",
                "shoppingAndEntertainmentCenter":"Торгово-развлекательный центр",
                "shoppingAndWarehouseComplex":"Торгово-складской комплекс",
                "shoppingCenter":"Торговый центр",
                "shoppingComplex":"Торговый комплекс",
                "specializedShoppingCenter":"Специализированный торговый центр",
                "standaloneBuilding":"Отдельно стоящее здание",
                "technopark":"Технопарк",
                "tradeAndExhibitionComplex":"Торгово-выставочный комплекс",
                "tradingHouse":"Торговый дом",
                "tradingOfficeComplex":"Торгово-офисный комплекс",
                "warehouse":"Склад",
                "warehouseComplex":"Складской комплекс"                
            };
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})


const Building_multy = Vue.component('Building_multy', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_multy"></div>',
        methods: {
            vantCh(){
                if($(this.vent1).prop("checked")){
                    $(this.$el).find('.ventItems').show();
                    var list = $(this.$el).find('[name="VentilationType"]');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).val() == "forced"){
                            list[i].checked = true;
                        }else{
                            list[i].checked = false;
                        }
                    }
                }else{
                    $(this.$el).find('.ventItems').hide();
                }
            },
            kondCh(){
                if($(this.vent2).prop("checked")){
                    $(this.$el).find('.CondItems').show();
                    var list = $(this.$el).find('[name="ConditioningType"]');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).val() == "central"){
                            list[i].checked = true;
                        }else{
                            list[i].checked = false;
                        }
                    }
                }else{
                    $(this.$el).find('.CondItems').hide();
                }
                
            },
            heatCh(){
                if($(this.vent3).prop("checked")){
                    $(this.$el).find('.HeatingItems').show();
                    var list = $(this.$el).find('[name="HeatingType"]');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).val() == "central"){
                            list[i].checked = true;
                        }else{
                            list[i].checked = false;
                        }
                    }
                }else{
                    $(this.$el).find('.HeatingItems').hide();
                }
            },
            pogCh(){
                if($(this.vent4).prop("checked")){
                    $(this.$el).find('.pgItems').show();
                    var list = $(this.$el).find('[name="ExtinguishingSystemType"]');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).val() == "alarm"){
                            list[i].checked = true;
                        }else{
                            list[i].checked = false;
                        }
                    }
                }else{
                    $(this.$el).find('.pgItems').hide();
                }
            },
            getValue(){
                var ob = {"Building":{
                    "VentilationType":"no",
                    "ConditioningType":"no",
                    "HeatingType":"no",
                    "ExtinguishingSystemType":"no"
                }};
                if($(this.vent4).prop("checked")){
                    var list = $(this.$el).find('[name="ExtinguishingSystemType"]');
                    for(var i=0;i<list.length;i++){
                        if(list[i].checked == true){
                            ob['Building']['ExtinguishingSystemType'] = $(list[i]).val();
                        }
                    }
                }

                if($(this.vent1).prop("checked")){
                    var list = $(this.$el).find('[name="VentilationType"]');
                    for(var i=0;i<list.length;i++){
                        if(list[i].checked == true){
                            ob['Building']['VentilationType'] = $(list[i]).val();
                        }
                    }
                }
                if($(this.vent2).prop("checked")){
                    var list = $(this.$el).find('[name="ConditioningType"]');
                    for(var i=0;i<list.length;i++){
                        if(list[i].checked == true){
                            ob['Building']['ConditioningType'] = $(list[i]).val();
                        }
                    }
                }
                if($(this.vent3).prop("checked")){
                    var list = $(this.$el).find('[name="HeatingType"]');
                    for(var i=0;i<list.length;i++){
                        if(list[i].checked == true){
                            ob['Building']['HeatingType'] = $(list[i]).val();
                        }
                    }
                }
                return ob;
            },
            setValue(v){
                
                if(v.BUILDING_EXTINGUISHINGSYSTEMTYPE){
                    if(v.BUILDING_EXTINGUISHINGSYSTEMTYPE!="no"){
                        $(this.vent4).prop("checked","checked");
                        $(this.$el).find('.pgItems').show();
                        var list = $(this.$el).find('[name="ExtinguishingSystemType"]');
                        for(var i=0;i<list.length;i++){
                            if($(list[i]).val() == v.BUILDING_EXTINGUISHINGSYSTEMTYPE){
                                list[i].checked = true;
                            }else{
                                list[i].checked = false;
                            }
                        }
                    }
                    delete(v.BUILDING_EXTINGUISHINGSYSTEMTYPE);
                }

                if(v.BUILDING_HEATINGTYPE){
                    if(v.BUILDING_HEATINGTYPE!="no"){
                        $(this.vent3).prop("checked","checked");
                        $(this.$el).find('.HeatingItems').show();
                        var list = $(this.$el).find('[name="HeatingType"]');
                        for(var i=0;i<list.length;i++){
                            if($(list[i]).val() == v.BUILDING_HEATINGTYPE){
                                list[i].checked = true;
                            }else{
                                list[i].checked = false;
                            }
                        }
                    }
                    delete(v.BUILDING_HEATINGTYPE);
                }
                
                if(v.BUILDING_CONDITIONINGTYPE){
                    if(v.BUILDING_CONDITIONINGTYPE!="no"){
                        $(this.vent2).prop("checked","checked");
                        $(this.$el).find('.CondItems').show();
                        var list = $(this.$el).find('[name="ConditioningType"]');
                        for(var i=0;i<list.length;i++){
                            if($(list[i]).val() == v.BUILDING_CONDITIONINGTYPE){
                                list[i].checked = true;
                            }else{
                                list[i].checked = false;
                            }
                        }
                    }
                    delete(v.BUILDING_CONDITIONINGTYPE);
                }

                if(v.BUILDING_VENTILATIONTYPE){
                    if(v.BUILDING_VENTILATIONTYPE!="no"){
                        $(this.vent1).prop("checked","checked");
                        $(this.$el).find('.ventItems').show();
                        var list = $(this.$el).find('[name="VentilationType"]');
                        for(var i=0;i<list.length;i++){
                            if($(list[i]).val() == v.BUILDING_VENTILATIONTYPE){
                                list[i].checked = true;
                            }else{
                                list[i].checked = false;
                            }
                        }
                    }
                    delete(v.BUILDING_VENTILATIONTYPE);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            var table = $("<table style='width:100%'>").appendTo(this.gdiv);
            var tr = $("<tr>").appendTo(table);
            var td = $("<th>").appendTo(tr);
            var div = $("<div style='display:flex'>").appendTo(td);
            this.vent1 = $('<input type="checkbox" class="custom-checkbox" id="vent'+uid+'">').appendTo(div);
            this.vent1.click($.proxy(this.vantCh));
            $('<label for="vent'+uid+'">').appendTo(div).html('Вентиляция');

            
            
            var td = $("<th>").appendTo(tr);
            var div = $("<div style='display:flex'>").appendTo(td);
            this.vent2 = $('<input type="checkbox" class="custom-checkbox" id="kond'+uid+'">').appendTo(div);
            this.vent2.click($.proxy(this.kondCh));
            $('<label for="kond'+uid+'">').appendTo(div).html('Кондиционир-е');


            var td = $("<th>").appendTo(tr);
            var div = $("<div style='display:flex'>").appendTo(td);
            this.vent3 = $('<input type="checkbox" class="custom-checkbox" id="heat'+uid+'">').appendTo(div);
            this.vent3.click($.proxy(this.heatCh));
            $('<label for="heat'+uid+'">').appendTo(div).html('Отопление');

            var td = $("<th>").appendTo(tr);
            var div = $("<div style='display:flex'>").appendTo(td);
            this.vent4 = $('<input type="checkbox" class="custom-checkbox" id="pog'+uid+'">').appendTo(div);
            this.vent4.click($.proxy(this.pogCh));
            $('<label for="pog'+uid+'">').appendTo(div).html('Система пожаротуш-я');
            
            
            var tr = $("<tr>").appendTo(table);
            var td = $("<td style='vertical-align:top'>").appendTo(tr);
            var div = $("<div class='ventItems' style='display:none'>").appendTo(td);
            //VentilationType
            $('<br>').appendTo(div);
            $('<input name="VentilationType" class="custom-radio" id="forced'+uid+'" type="radio" value="forced" >').appendTo(div);
            $('<label for="forced'+uid+'">').appendTo(div).html('Приточная');
            $('<br>').appendTo(div);
            $('<input name="VentilationType" class="custom-radio" id="natural'+uid+'" type="radio" value="natural" >').appendTo(div);
            $('<label for="natural'+uid+'">').appendTo(div).html('Естественная');
/*
            $('<br>').appendTo(div);
            $('<input name="VentilationType" class="custom-radio" id="ventno'+uid+'" type="radio" value="no" checked="true">').appendTo(div);
            $('<label for="ventno'+uid+'">').appendTo(div).html('Нет');
*/

            
            var td = $("<td style='vertical-align:top'>").appendTo(tr);
            var div = $("<div class='CondItems' style='display:none'>").appendTo(td);
            //ConditioningType            
            $('<br>').appendTo(div);
            $('<input name="ConditioningType" class="custom-radio" id="ConditioningType_central'+uid+'" type="radio" value="central" checked="true">').appendTo(div);
            $('<label for="ConditioningType_central'+uid+'">').appendTo(div).html('Центральное');
            $('<br>').appendTo(div);
            $('<input name="ConditioningType" class="custom-radio" id="ConditioningType_local'+uid+'" type="radio" value="local" checked="true">').appendTo(div);
            $('<label for="ConditioningType_local'+uid+'">').appendTo(div).html('Местное');
/*
            $('<br>').appendTo(div);
            $('<input name="ConditioningType" class="custom-radio" id="ConditioningType_no'+uid+'" type="radio" value="no" checked="true">').appendTo(div);
            $('<label for="ConditioningType_no'+uid+'">').appendTo(div).html('Нет');
*/            
            
            var td = $("<td style='vertical-align:top'>").appendTo(tr);
            var div = $("<div class='HeatingItems' style='display:none'>").appendTo(td);
            //HeatingType
            $('<br>').appendTo(div);
            $('<input name="HeatingType" class="custom-radio" id="HeatingType_central'+uid+'" type="radio" value="central" checked="true">').appendTo(div);
            $('<label for="HeatingType_central'+uid+'">').appendTo(div).html('Центральное');
            $('<br>').appendTo(div);
            $('<input name="HeatingType" class="custom-radio" id="HeatingType_autonomous'+uid+'" type="radio" value="autonomous" checked="true">').appendTo(div);
            $('<label for="HeatingType_autonomous'+uid+'">').appendTo(div).html('Автономное');
/*
            $('<br>').appendTo(div);
            $('<input name="HeatingType" class="custom-radio" id="HeatingType_no'+uid+'" type="radio" value="no" checked="true">').appendTo(div);
            $('<label for="HeatingType_no'+uid+'">').appendTo(div).html('Нет');
*/            
            
            var td = $("<td style='vertical-align:top'>").appendTo(tr);
            var div = $("<div class='pgItems' style='display:none' >").appendTo(td);
            //ExtinguishingSystemType
            $('<br>').appendTo(div);
            $('<input name="ExtinguishingSystemType" class="custom-radio" id="ExtinguishingSystemType_alarm'+uid+'" type="radio" value="alarm" checked="true">').appendTo(div);
            $('<label for="ExtinguishingSystemType_alarm'+uid+'">').appendTo(div).html('Сигнализация');
            $('<br>').appendTo(div);
            $('<input name="ExtinguishingSystemType" class="custom-radio" id="ExtinguishingSystemType_gas'+uid+'" type="radio" value="gas" checked="true">').appendTo(div);
            $('<label for="ExtinguishingSystemType_gas'+uid+'">').appendTo(div).html('Газовая');
            $('<br>').appendTo(div);
            $('<input name="ExtinguishingSystemType" class="custom-radio" id="ExtinguishingSystemType_hydrant'+uid+'" type="radio" value="hydrant" checked="true">').appendTo(div);
            $('<label for="ExtinguishingSystemType_hydrant'+uid+'">').appendTo(div).html('Гидрантная');
            $('<br>').appendTo(div);
            $('<input name="ExtinguishingSystemType" class="custom-radio" id="ExtinguishingSystemType_powder'+uid+'" type="radio" value="powder" checked="true">').appendTo(div);
            $('<label for="ExtinguishingSystemType_powder'+uid+'">').appendTo(div).html('Порошковая');
            $('<br>').appendTo(div);
            $('<input name="ExtinguishingSystemType" class="custom-radio" id="ExtinguishingSystemType_sprinkler'+uid+'" type="radio" value="sprinkler" checked="true">').appendTo(div);
            $('<label for="ExtinguishingSystemType_sprinkler'+uid+'">').appendTo(div).html('Спринклерная');
/*
            $('<br>').appendTo(div);
            $('<input name="ExtinguishingSystemType" class="custom-radio" id="ExtinguishingSystemType_no'+uid+'" type="radio" value="no" checked="true">').appendTo(div);
            $('<label for="ExtinguishingSystemType_no'+uid+'">').appendTo(div).html('Нет');
*/

        }

    })
})

const Building_Infrastructure = Vue.component('Building_Infrastructure', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'tip':String
        },
        template: '<div class="Building_Infrastructure"></div>',
        methods: {
            getValue(){
                var ob = {};
                var list = $(this.$el).find('[type="checkbox"]');
                var flag = false;
                for(var i=0;i<list.length;i++){
                    if($(list[i]).prop("checked")){
                        ob[$(list[i]).val()] = true;
                    }else{
                        ob[$(list[i]).val()] = false;
                    }
                }
                return {
                   "Building":{
                       "Infrastructure":JSON.stringify(ob)
                   }     
                }

            },
            setValue(v){
                if(v.BUILDING_INFRASTRUCTURE){
                    var v_=JSON.parse(v.BUILDING_INFRASTRUCTURE);
                    var list = $(this.$el).find('.custom-checkbox');
                    for(var i=0;i<list.length;i++){
                        if(v_[$(list[i]).val()]==true){
                            $(list[i]).prop('checked','checked');
                        }else{
                            $(list[i]).prop('checked',null);
                        }
                    }
                    delete(v.BUILDING_INFRASTRUCTURE);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            $('<br>').appendTo(this.$el);
            switch (this.tip) {
                case 'Garage':
                    var list = {
                        "HasCarWash":"Автомойка",
                        "HasCarService":"Автосервис",
                        "HasTire":"Шиномонтаж",
                        "HasInspectionPit":"Смотровая яма",
                        "HasVideoSurveillance":"Видеонаблюдение",
                        "HasHourSecurity":"Круглосуточная охрана",
                        "HasAutomaticGates":"Автоматические ворота",
                        "HasEntryByPass":"Въезд по пропускам",
                        "HasBasement":"Подвал/погреб"             
                    }    
                    break;

                case 'industrySale':
                    var list = {
                        "HasBuffet":"Буфет",
                        "HasCanteen":"Столовая",
                        "HasCentralReception":"Центральная рецепция",
                        "HasHotel":"Гостиница",
                        "HasOfficeSpace":"Офисные помещения"                
                    }    
                    break;
                
                default:
                var list = {
                    "HasCarWash":"Автомойка",
                    "HasBuffet":"Буфет",
                    "HasCarService":"Автосервис",
                    "HasCanteen":"Столовая",
                    "HasCentralReception":"Центральная рецепция",
                    "HasHotel":"Гостиница",
                    "HasAtm":"Банкомат",
                    "HasExhibitionAndWarehouseComplex":"Выставочно-складской комплекс",
                    "HasPharmacy":"Аптека",
                    "HasBankDepartment":"Отделение банка",
                    "HasCinema":"Кинотеатр",
                    "HasCafe":"Кафе",
                    "HasMedicalCenter":"Медицинский центр",
                    "HasBeautyShop":"Салон красоты",
                    "HasStudio":"Фотосалон",
                    "HasNotaryOffice":"Нотариальная контора",
                    "HasPool":"Бассейн",
                    "HasClothesStudio":"Ателье одежды",
                    "HasWarehouse":"Складские помещения",
                    "HasPark":"Парк",
                    "HasRestaurant":"Ресторан",
                    "HasFitnessCentre":"Фитнес-центр",
                    "HasSupermarket":"Супермаркет",
                    "HasMinimarket":"Минимаркет",
                    "HasShoppingArea":"Торговая зона",
                    "HasConferenceRoom":"Конференц-зал"                
                };
            }
            for(var key in list){
                this.input = $('<input type="checkbox" value="'+key+'" class="custom-checkbox" id="'+key+uid+'">').appendTo(this.$el);
                $('<label for="'+key+uid+'" class="fix4">').appendTo(this.$el).html(list[key]);

            }
        }

    })
})


const Building_ColumnGrid = Vue.component('Building_ColumnGrid', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_ColumnGrid"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {'ColumnGrid': this.input.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_COLUMNGRID){
                    this.input.val(v.BUILDING_COLUMNGRID);
                }
                delete(v.BUILDING_COLUMNGRID);
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:140px">').appendTo(this.gdiv);
        }

    })
})


const Building_ManagementCompany = Vue.component('Building_ManagementCompany', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_ManagementCompany"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {'ManagementCompany': this.input.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_MANAGEMENTCOMPANY){
                    this.input.val(v.BUILDING_MANAGEMENTCOMPANY);
                    delete(v.BUILDING_MANAGEMENTCOMPANY);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:340px">').appendTo(this.gdiv);
        }

    })
})


const Building_Developer = Vue.component('Building_Developer', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_Developer"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {'Developer': this.input.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_DEVELOPER){
                    console.log('BUILDING_DEVELOPER')
                    this.input.val(v.BUILDING_DEVELOPER);
                    delete(v.BUILDING_DEVELOPER);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:340px">').appendTo(this.gdiv);
        }

    })
})


const Building_Name = Vue.component('Building_Name', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_Name"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {'Name': this.input.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_NAME){
                    this.input.val(v.BUILDING_NAME);
                    delete(v.BUILDING_NAME);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:340px">').appendTo(this.gdiv);
        }

    })
})



const Building_TotalArea = Vue.component('Building_TotalArea', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_TotalArea"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {'TotalArea': this.input.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_TOTALAREA){
                    this.input.val(v.BUILDING_TOTALAREA);
                    delete(v.BUILDING_TOTALAREA);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:90px">').appendTo(this.gdiv);
            $(this.input).inputmask({
                mask: '9{1,6}'
            });
        }

    })
})


const BedroomsCount = Vue.component('BedroomsCount', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="BedroomsCount"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['BedroomsCount'] = this.input.val();
                return ob;
            },
            setValue(v){
                if(v.BEDROOMSCOUNT){
                    this.input.val(v.BEDROOMSCOUNT);
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:30px">').appendTo(this.gdiv);
            $(this.input).inputmask({
                mask: '9{1,2}'
            });
        }
    })
})


const Building_FloorsCount = Vue.component('Building_FloorsCount', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_FloorsCount"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {'FloorsCount': this.input.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_FLOORSCOUNT){
                    this.input.val(v.BUILDING_FLOORSCOUNT);
                    delete(v.BUILDING_FLOORSCOUNT);

                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:30px">').appendTo(this.gdiv);
            $(this.input).inputmask({
                mask: '9{1,3}'
            });
        }
    })
})


const Building_BuildYear = Vue.component('Building_BuildYear', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Building_BuildYear"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {'BuildYear': this.input.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_BUILDYEAR){
                    this.input.val(v.BUILDING_BUILDYEAR);
                    delete(v.BUILDING_BUILDYEAR);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:40px">').appendTo(this.gdiv);
            $(this.input).inputmask({
                mask: '9{1,4}'
            });
        }
    })
})




const IsOccupied = Vue.component('IsOccupied', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="IsOccupied"></div>',
        methods: {
            setCh(){
                if($(this.input).prop("checked")){
                    $(this.selectM).show();
                    $(this.selectG).show();
                }else{
                    $(this.selectM).hide();
                    $(this.selectG).hide();
                }                
            },
            getValue(){
                var ob = {};
                if($(this.input).prop("checked")) {
                    ob['IsOccupied'] =1;
                    ob['AvailableFrom'] = JSON.stringify({
                        "selectG":this.selectG.val(),
                        "selectM":this.selectM.val()
                    }); 
                }else{
                    ob['IsOccupied'] =0;
                    ob['AvailableFrom'] =JSON.stringify({
                        "selectG":1971,
                        "selectM":1
                    });
                }
                return ob;
            },
            setValue(v){
                if(v.ISOCCUPIED){
                    if(v.ISOCCUPIED==1){
                        $(this.input).prop("checked","checked");
                        $(this.selectM).show();
                        $(this.selectG).show();
                        var J = JSON.parse(v.AVAILABLEFROM);
                        this.selectG.val(J.selectG);
                        this.selectM.val(J.selectM);
                        
                    }
                    delete(v.AVAILABLEFROM);
                    delete(v.ISOCCUPIED);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="IsOccupied'+uid+'">').appendTo(this.gdiv);
            this.input.click($.proxy(this.setCh));
            
            $('<label for="IsOccupied'+uid+'">').appendTo(this.gdiv);
            this.selectM =$('<select class="select-css" style="width:110px;display:none">').appendTo(this.gdiv);
            $('<option value="1">Январь</option>').appendTo(this.selectM);
            $('<option value="2">Февраль</option>').appendTo(this.selectM);
            $('<option value="3">Март</option>').appendTo(this.selectM);
            $('<option value="4">Апрель</option>').appendTo(this.selectM);
            $('<option value="5">Май</option>').appendTo(this.selectM);
            $('<option value="6">Июнь</option>').appendTo(this.selectM);
            $('<option value="7">Июль</option>').appendTo(this.selectM);
            $('<option value="8">Август</option>').appendTo(this.selectM);
            $('<option value="9">Сентябрь</option>').appendTo(this.selectM);
            $('<option value="10">Октябрь</option>').appendTo(this.selectM);
            $('<option value="11">Ноябрь</option>').appendTo(this.selectM);
            $('<option value="12">Декабрь</option>').appendTo(this.selectM);
            this.selectG =$('<select class="select-css" style="margin-left:12px;width:90px;display:none">').appendTo(this.gdiv);
            $('<option value="2020">2020</option>').appendTo(this.selectG);
            $('<option value="2021">2021</option>').appendTo(this.selectG);
            $('<option value="2022">2022</option>').appendTo(this.selectG);
            $('<option value="2023">2023</option>').appendTo(this.selectG);
            $('<option value="2024">2024</option>').appendTo(this.selectG);
            $('<option value="2025">2025</option>').appendTo(this.selectG);
            $('<option value="2026">2026</option>').appendTo(this.selectG);
            $('<option value="2027">2027</option>').appendTo(this.selectG);
            $('<option value="2028">2028</option>').appendTo(this.selectG);
            
            
            


        }

    })
})



const HasShopWindows = Vue.component('HasShopWindows', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="HasShopWindows"></div>',
        methods: {
            getValue(){
                var ob = {};
                if($(this.input).prop("checked")) {
                    ob['HasShopWindows'] =1;
                    return ob;
                    
                }else{
                    ob['HasShopWindows'] =0;
                    return ob;
                }

            },
            setValue(v){
                if(v.HASSHOPWINDOWS){
                    if(v.HASSHOPWINDOWS==1){
                        $(this.input).prop("checked","checked");
                    }
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="HasShopWindows'+uid+'">').appendTo(this.gdiv);
            $('<label for="HasShopWindows'+uid+'">').appendTo(this.gdiv);
        }
    })
})


const HasEquipment = Vue.component('HasEquipment', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="HasEquipment"></div>',
        methods: {
            getValue(){
                var ob = {};
                if($(this.input).prop("checked")) {
                    ob['HasEquipment'] =true;
                    return ob;
                    
                }else{
                    ob['HasEquipment'] =false;
                    return ob;
                }

            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="FurniturePresence'+uid+'">').appendTo(this.gdiv);
            $('<label for="FurniturePresence'+uid+'">').appendTo(this.gdiv);
        }
    })
})


const HasFurniture = Vue.component('HasFurniture', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="HasFurniture"></div>',
        methods: {
            getValue(){
                var ob = {};
                if($(this.input).prop("checked")) {
                    ob['HasFurniture'] =1;
                    return ob;
                    
                }else{
                    ob['HasFurniture'] =0;
                    return ob;
                }

            },
            setValue(v){
                if(v.HASFURNITURE){
                    if(v.HASFURNITURE==1){
                        $(this.input).prop("checked","checked");
                    }else{
                        $(this.input).prop("checked","null");
                    }
                    delete(v.HASFURNITURE);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="FurniturePresence'+uid+'">').appendTo(this.gdiv);
            $('<label for="FurniturePresence'+uid+'">').appendTo(this.gdiv);
        }
    })
})


const FurniturePresence = Vue.component('FurniturePresence', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="FurniturePresence"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                if($(this.input).prop("checked")) {
                    ob['FurniturePresence'] ='yes';
                    return ob;
                    
                }else{
                    ob['FurniturePresence'] ='no';
                    return ob;
                }

            },
            setValue(v){
                if(v.FURNITUREPRESENCE){
                    if(v.FURNITUREPRESENCE == 'yes'){
                        $(this.input).prop("checked","checked");
                    }
                    delete(v.FURNITUREPRESENCE);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="FurniturePresence'+uid+'">').appendTo(this.gdiv);
            $('<label for="FurniturePresence'+uid+'">').appendTo(this.gdiv);
        }
    })
})


const IsLegalAddressProvided = Vue.component('IsLegalAddressProvided', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="IsLegalAddressProvided"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                if($(this.input).prop("checked")) {
                    {ob[this.field] =1};
                    return ob;
                    
                }else{
                    {ob[this.field] =0};
                    return ob;
                }

            },
            setValue(v){
                if(v.ISLEGALADDRESSPROVIDED){
                    if(v.ISLEGALADDRESSPROVIDED==1)
                        $(this.input).prop("checked","checked");
                    delete(v.ISLEGALADDRESSPROVIDED);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="ch1'+uid+'">').appendTo(this.gdiv);
            $('<label for="ch1'+uid+'">').appendTo(this.gdiv);
            


        }

    })
})


const BargainTerms_PriceSale = Vue.component('BargainTerms_PriceSale', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="BargainTerms_PriceSale"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['BargainTerms'] = {'Price':$(this.Price).val()};
                return ob;

            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.Price =$('<input type="text" style="width:90px;padding-left:4px;height:18px;margin-right:12px">').appendTo(this.gdiv);
            $(this.Price).inputmask('decimal', {});
        }
    })
})


const BargainTerms_Price = Vue.component('BargainTerms_Price', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="BargainTerms_Price"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['BargainTerms'] = {'Price':$(this.Price).val()};
                return ob;

            },
            setValue(v){
                if(v.BARGAINTERMS_PRICE){
                    $(this.Price).val(v.BARGAINTERMS_PRICE);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divCH = $('<div style="display:flex">').appendTo(this.gdiv);
            this.Price =$('<input type="text" style="width:90px;padding-left:4px;height:18px;margin-right:12px">').appendTo(this.gdiv);
            $(this.Price).inputmask('decimal', {});
            this.monthly = $('<input name="monthly" class="custom-radio" id="monthly'+uid+'" type="radio" value="monthly" checked="true">').appendTo(this.gdiv);
            $('<label for="monthly'+uid+'" style=";margin-right:12px">').appendTo(this.gdiv).html('В месяц');
            this.annual = $('<input name="monthly" class="custom-radio" id="annual'+uid+'" type="radio" value="annual" checked="true">').appendTo(this.gdiv);
            $('<label for="annual'+uid+'">').appendTo(this.gdiv).html('В год');
            

        }
    })
})


const ClientFee = Vue.component('ClientFee', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="ClientFee"></div>',
        methods: {
            PossibleToConnectCLick(){
                if($(this.PossibleToConnect).prop("checked")) {
                    $(this.ClientFee).hide();
                }else{
                    $(this.ClientFee).show();

                }
            },
            getValue(){
                var ob = {};
                if(! $(this.PossibleToConnect).prop("checked")) {
                    ob['BargainTerms'] = {'ClientFee':$(this.ClientFee).val()};
                    return ob;
                }else{
                    return null;
                }

            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divCH = $('<div style="display:flex">').appendTo(this.gdiv);
            this.ClientFee =$('<input type="text" style="width:40px;padding-left:4px;height:18px;margin-right:12px">').appendTo(this.gdiv).val(this.value);
            $(this.ClientFee).inputmask({
                mask: '9{1,3}'
            });
            this.PossibleToConnect = $('<input type="checkbox" class="custom-checkbox" id="ClientFee'+uid+'" >').appendTo(this.gdiv);
            this.PossibleToConnect.click($.proxy(this.PossibleToConnectCLick));
            $('<label for="ClientFee'+uid+'" style="margin-top:-12px;">').appendTo(this.gdiv).html('Без комиссии');   
        }
    })
})

const Water = Vue.component('Water', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Water"></div>',
        methods: {
            LocationTypeSelect(){
                if($(this.LocationType).val()=='no'){
                    $(this.divCH).show();
                    $(this.Power).hide();
                    $(this.info).hide();
                    $(this.PressureType).hide();
                }else{
                    $(this.divCH).hide();
                    $(this.Power).show();
                    $(this.info).show();
                    $(this.PressureType).show();
                }
            },
            PossibleToConnectCLick(){
                if($(this.PossibleToConnect).prop("checked")) {
                    $(this.LocationType).hide();
                    $(this.rdiv1).hide();
                }else{
                    $(this.LocationType).show();
                    $(this.rdiv1).show();
                    
                }
                if($(this.LocationType).val()=='no'){
                    $(this.PressureType).hide();
                }
                
            },
            getValue(){
                if($(this.PossibleToConnect).prop("checked") || $(this.LocationType).val()!="Нет") {
                    var ob = {
                        "Gas":{
                            "LocationType":$(this.LocationType).val(),
                            "PossibleToConnect":$(this.PossibleToConnect).prop("checked") 
                        }
                    };
                    return ob;
                    
                }else{
                    return null;
                }

            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.LocationType = $('<select class="select-css" style="width:160px">').appendTo(this.gdiv);
            $('<option value="no">Нет</option>').appendTo(this.LocationType);
            $('<option value="border">По границе участка</option>').appendTo(this.LocationType);
            $('<option value="location">На участке</option>').appendTo(this.LocationType);
            this.LocationType.change($.proxy(this.LocationTypeSelect))
            this.divCH = $('<div style="display:flex">').appendTo(this.gdiv);
            this.rdiv1 = $('<div style="width:12px">').appendTo(this.divCH);
            this.PossibleToConnect = $('<input type="checkbox" class="custom-checkbox" id="PossibleToConnect'+uid+'" >').appendTo(this.divCH);
            this.PossibleToConnect.click($.proxy(this.PossibleToConnectCLick));
            $('<label for="PossibleToConnect'+uid+'">').appendTo(this.divCH).html('Возможно подключить');   
            $(this.LocationType).hide();
            $(this.rdiv1).hide();
            $(this.PossibleToConnect).prop("checked","checked");
            this.Power =$('<input type="text" style="width:40px;margin-left:18px;padding-left:4px">').appendTo(this.gdiv).val(this.value);
            $(this.Power).inputmask({
                mask: '9{1,4}'
            });
            this.info = $('<div style="margin-left:8px">').appendTo(this.gdiv);
            this.info.html('м3/сутки');
            this.info.hide();
            $(this.Power).hide();
            this.PressureType = $('<select class="select-css" style="width:110px;margin-left:8px">').appendTo(this.gdiv);
            $('<option value="autonomous">Автономная</option>').appendTo(this.PressureType);
            $('<option value="central">Центральная</option>').appendTo(this.PressureType);
            $('<option value="pumpingStation">Водонапорная станция</option>').appendTo(this.PressureType);
            $('<option value="waterIntakeFacility">Водозаборный узел</option>').appendTo(this.PressureType);
            $('<option value="waterTower">Водонапорная башня</option>').appendTo(this.PressureType);
            this.PressureType.hide();

        }

    })
})


const Drainage = Vue.component('Drainage', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Drainage"></div>',
        methods: {
            LocationTypeSelect(){
                if($(this.LocationType).val()=='no'){
                    $(this.divCH).show();
                    $(this.Power).hide();
                    $(this.info).hide();
                    $(this.PressureType).hide();
                }else{
                    $(this.divCH).hide();
                    $(this.Power).show();
                    $(this.info).show();
                    $(this.PressureType).show();
                }
            },
            PossibleToConnectCLick(){
                if($(this.PossibleToConnect).prop("checked")) {
                    $(this.LocationType).hide();
                    $(this.rdiv1).hide();
                }else{
                    $(this.LocationType).show();
                    $(this.rdiv1).show();
                    
                }
                if($(this.LocationType).val()=='no'){
                    $(this.PressureType).hide();
                }
                
            },
            getValue(){
                if($(this.PossibleToConnect).prop("checked") || $(this.LocationType).val()!="Нет") {
                    var ob = {
                        "Gas":{
                            "LocationType":$(this.LocationType).val(),
                            "PossibleToConnect":$(this.PossibleToConnect).prop("checked") 
                        }
                    };
                    return ob;
                    
                }else{
                    return null;
                }

            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.LocationType = $('<select class="select-css" style="width:160px">').appendTo(this.gdiv);
            $('<option value="no">Нет</option>').appendTo(this.LocationType);
            $('<option value="border">По границе участка</option>').appendTo(this.LocationType);
            $('<option value="location">На участке</option>').appendTo(this.LocationType);
            this.LocationType.change($.proxy(this.LocationTypeSelect))
            this.divCH = $('<div style="display:flex">').appendTo(this.gdiv);
            this.rdiv1 = $('<div style="width:12px">').appendTo(this.divCH);
            this.PossibleToConnect = $('<input type="checkbox" class="custom-checkbox" id="PossibleToConnect'+uid+'" >').appendTo(this.divCH);
            this.PossibleToConnect.click($.proxy(this.PossibleToConnectCLick));
            $('<label for="PossibleToConnect'+uid+'">').appendTo(this.divCH).html('Возможно подключить');   
            $(this.LocationType).hide();
            $(this.rdiv1).hide();
            $(this.PossibleToConnect).prop("checked","checked");
            this.Power =$('<input type="text" style="width:40px;margin-left:18px;padding-left:4px">').appendTo(this.gdiv).val(this.value);
            $(this.Power).inputmask({
                mask: '9{1,4}'
            });
            this.info = $('<div style="margin-left:8px">').appendTo(this.gdiv);
            this.info.html('м3/сутки');
            this.info.hide();
            $(this.Power).hide();
            this.PressureType = $('<select class="select-css" style="width:110px;margin-left:8px">').appendTo(this.gdiv);
            $('<option value="autonomous">Автономная</option>').appendTo(this.PressureType);
            $('<option value="central">Центральная</option>').appendTo(this.PressureType);
            this.PressureType.hide();

        }

    })
})


const Gas = Vue.component('Gas', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Gas"></div>',
        methods: {
            LocationTypeSelect(){
                if($(this.LocationType).val()=='no'){
                    $(this.divCH).show();
                    $(this.Power).hide();
                    $(this.info).hide();
                    $(this.PressureType).hide();
                }else{
                    $(this.divCH).hide();
                    $(this.Power).show();
                    $(this.info).show();
                    $(this.PressureType).show();
                }
            },
            PossibleToConnectCLick(){
                if($(this.PossibleToConnect).prop("checked")) {
                    $(this.LocationType).hide();
                    $(this.rdiv1).hide();
                    $(this.PressureType).hide();

                }else{
                    $(this.LocationType).show();
                    $(this.rdiv1).show();
                    $(this.PressureType).show();
                    
                }
                if($(this.LocationType).val()=='no'){
                    $(this.PressureType).hide();
                }
            },
            getValue(){
                if($(this.PossibleToConnect).prop("checked") || $(this.LocationType).val()!="Нет") {
                    var ob = {
                        "Gas":{
                            "LocationType":$(this.LocationType).val(),
                            "PossibleToConnect":$(this.PossibleToConnect).prop("checked") 
                        }
                    };
                    return ob;
                    
                }else{
                    return null;
                }

            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.LocationType = $('<select class="select-css" style="width:160px">').appendTo(this.gdiv);
            $('<option value="no">Нет</option>').appendTo(this.LocationType);
            $('<option value="border">По границе участка</option>').appendTo(this.LocationType);
            $('<option value="location">На участке</option>').appendTo(this.LocationType);
            this.LocationType.change($.proxy(this.LocationTypeSelect))
            this.divCH = $('<div style="display:flex">').appendTo(this.gdiv);
            this.rdiv1 = $('<div style="width:12px">').appendTo(this.divCH);
            this.PossibleToConnect = $('<input type="checkbox" class="custom-checkbox" id="PossibleToConnect'+uid+'" >').appendTo(this.divCH);
            this.PossibleToConnect.click($.proxy(this.PossibleToConnectCLick));
            $('<label for="PossibleToConnect'+uid+'">').appendTo(this.divCH).html('Возможно подключить');   
            $(this.LocationType).hide();
            $(this.rdiv1).hide();
            $(this.PossibleToConnect).prop("checked","checked");
            this.Power =$('<input type="text" style="width:40px;margin-left:18px;padding-left:4px">').appendTo(this.gdiv).val(this.value);
            $(this.Power).inputmask({
                mask: '9{1,4}'
            });
            this.info = $('<div style="margin-left:8px">').appendTo(this.gdiv);
            this.info.html('м3/час');
            this.info.hide();
            $(this.Power).hide();
            this.PressureType = $('<select class="select-css" style="width:110px;margin-left:8px">').appendTo(this.gdiv);
            $('<option value="high">Высокое</option>').appendTo(this.PressureType);
            $('<option value="low">Низкое</option>').appendTo(this.PressureType);
            $('<option value="middle">Среднее</option>').appendTo(this.PressureType);
            this.PressureType.hide();
            

        }

    })
})


const Electricity = Vue.component('Electricity', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Electricity"></div>',
        computed: {

        },
        methods: {
            LocationTypeSelect(){
                if($(this.LocationType).val()=='no'){
                    $(this.divCH).show();
                }else{
                    $(this.divCH).hide();
                }
            },
            PossibleToConnectCLick(){
                if($(this.PossibleToConnect).prop("checked")) {
                    $(this.LocationType).hide();
                    $(this.rdiv1).hide();
                }else{
                    $(this.LocationType).show();
                    $(this.rdiv1).show();
                    
                }
            },
            getValue(){
                var ob = {'Electricity':{}};
                if($(this.PossibleToConnect).prop("checked")) {
                    {ob['Electricity']['PossibleToConnect'] ='true'};
                    return ob;
                    
                }else{
                    return null;
                }

            },
            setValue(v){
                if(v.ELECTRICITY_POSSIBLETOCONNECT){
                    if(v.ELECTRICITY_POSSIBLETOCONNECT=="true"){
                        $(this.PossibleToConnect).prop("checked","checked");
                    }
                    delete(v.ELECTRICITY_POSSIBLETOCONNECT);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.LocationType = $('<select class="select-css" style="width:160px">').appendTo(this.gdiv);
            if(this.field=="Office"){
                this.Power =$('<input type="text" style="width:20px;margin-left:18px;padding-left:4px">').appendTo(this.gdiv).val(this.value);
                $(this.Power).inputmask({
                    mask: '9{1,2}'
                });
            }else{
                $('<option value="no">Нет</option>').appendTo(this.LocationType);
                $('<option value="border">По границе участка</option>').appendTo(this.LocationType);
                $('<option value="location">На участке</option>').appendTo(this.LocationType);
                this.LocationType.change($.proxy(this.LocationTypeSelect))
                this.divCH = $('<div style="display:flex">').appendTo(this.gdiv);
                this.rdiv1 = $('<div style="width:12px">').appendTo(this.divCH);
                this.PossibleToConnect = $('<input type="checkbox" class="custom-checkbox" id="PossibleToConnect'+uid+'" >').appendTo(this.divCH);
                this.PossibleToConnect.click($.proxy(this.PossibleToConnectCLick));
                $('<label for="PossibleToConnect'+uid+'">').appendTo(this.divCH).html('Возможно подключить');   
    
                this.Power =$('<input type="text" style="width:20px;margin-left:18px;padding-left:4px">').appendTo(this.gdiv).val(this.value);
                $(this.Power).inputmask({
                    mask: '9{1,2}'
                });
                this.infoLabel = $('<div style="margin-left:8px;padding-top:4px">').appendTo(this.gdiv).html('кВТ');
                $(this.LocationType).hide();
                $(this.rdiv1).hide();
                $(this.PossibleToConnect).prop("checked","checked");
                
            }
            

        }

    })
})



const Building_CranageTypes = Vue.component('Building_CranageTypes', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Building_CranageTypes"></div>',
        methods: {
            getValue(){
                var ob = {};
                if($(this.beam).val()!="" || $(this.overhead).val()!="" || $(this.railway).val()!="" || $(this.gantry).val()!="") {
                    ob['Building'] ={'CranageTypes':[]};
                    if($(this.beam).val()!=""){
                        ob['Building']['CranageTypes'].push(
                            {
                                "CranageTypeSchema":{
                                    "Type":"beam",
                                    "Count":$(this.beam).val(),
                                    "LoadCapacity":$(this.beam_LoadCapacity).val()
                                }
                            }    
                        )
                    }
                    if($(this.overhead).val()!=""){
                        ob['Building']['CranageTypes'].push(
                            {
                                "CranageTypeSchema":{
                                    "Type":"overhead",
                                    "Count":$(this.overhead).val(),
                                    "LoadCapacity":$(this.overhead_LoadCapacity).val()
                                }
                            }    
                        )
                    }
                    if($(this.railway).val()!=""){
                        ob['Building']['CranageTypes'].push(
                            {
                                "CranageTypeSchema":{
                                    "Type":"railway",
                                    "Count":$(this.railway).val(),
                                    "LoadCapacity":$(this.railway_LoadCapacity).val()
                                }
                            }    
                        )
                    }
                    if($(this.gantry).val()!=""){
                        ob['Building']['CranageTypes'].push(
                            {
                                "CranageTypeSchema":{
                                    "Type":"gantry",
                                    "Count":$(this.gantry).val(),
                                    "LoadCapacity":$(this.gantry_LoadCapacity).val()
                                }
                            }    
                        )
                    }
                    return {
                        'Building':{
                            'CranageTypes':JSON.stringify(ob['Building']['CranageTypes'])
                        }
                    };

                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.BUILDING_CRANAGETYPES){
                    var J =JSON.parse(v.BUILDING_CRANAGETYPES);
                    for(var i=0;i<J.length;i++){
                        $(this[J[i].CranageTypeSchema.Type]).val(J[i].CranageTypeSchema.Count);
                        $(this[J[i].CranageTypeSchema.Type+'_LoadCapacity']).val(J[i].CranageTypeSchema.LoadCapacity);
                    }
                    delete(v.BUILDING_CRANAGETYPES);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);

                    var table = $('<tavle style="width:100%">').appendTo(this.gdiv);
                    var tr = $('<tr>').appendTo(table);
                    var td = $('<td style="width:130px">').appendTo(tr).html('Мостовой');
                    var td = $('<td>').appendTo(tr);
                    this.overhead = $('<input type="text" style="width:30px;margin-left:8px">').appendTo(td);
                    $(this.overhead).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr).html('Грузоподъемность');
                    this.overhead_LoadCapacity = $('<input type="text" style="width:40px;margin-left:8px">').appendTo(td);
                    $(this.overhead_LoadCapacity).inputmask({
                        mask: '9{1,3}'
                    });
                    var td = $('<td>').appendTo(tr).html('т.');

                    var tr = $('<tr>').appendTo(table);
                    var td = $('<td>').appendTo(tr).html('Кран-балка');
                    var td = $('<td>').appendTo(tr);
                    this.beam = $('<input type="text" style="width:30px;margin-left:8px">').appendTo(td);
                    $(this.beam).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr).html('Грузоподъемность');
                    this.beam_LoadCapacity = $('<input type="text" style="width:40px;margin-left:8px">').appendTo(td);
                    $(this.beam_LoadCapacity).inputmask({
                        mask: '9{1,3}'
                    });
                    var td = $('<td>').appendTo(tr).html('т.');

                    var tr = $('<tr>').appendTo(table);
                    var td = $('<td>').appendTo(tr).html('Ж/д кран');
                    var td = $('<td>').appendTo(tr);
                    this.railway = $('<input type="text" style="width:30px;margin-left:8px">').appendTo(td);
                    $(this.railway).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr).html('Грузоподъемность');
                    this.railway_LoadCapacity = $('<input type="text" style="width:40px;margin-left:8px">').appendTo(td);
                    $(this.railway_LoadCapacity).inputmask({
                        mask: '9{1,3}'
                    });
                    var td = $('<td>').appendTo(tr).html('т.');

                    var tr = $('<tr>').appendTo(table);
                    var td = $('<td>').appendTo(tr).html('Козловой');
                    var td = $('<td>').appendTo(tr);
                    this.gantry = $('<input type="text" style="width:30px;margin-left:8px">').appendTo(td);
                    $(this.gantry).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr).html('Грузоподъемность');
                    this.gantry_LoadCapacity = $('<input type="text" style="width:40px;margin-left:8px">').appendTo(td);
                    $(this.gantry_LoadCapacity).inputmask({
                        mask: '9{1,3}'
                    });
                    var td = $('<td>').appendTo(tr).html('т.');

                   
        }
    })
})



const Building_LiftTypes = Vue.component('Building_LiftTypes', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'tip':String,
            'size':Number
        },
        template: '<div class="Building_LiftTypes"></div>',
        methods: {
            getValue(){
                var ob = {};
                switch (this.tip) {
                    case 'industrySale':
                        if($(this.cargo).val()!="" || $(this.telpher).val()!="" || $(this.passenger).val()!="") {
                            ob['Building'] ={'LiftTypes':[]};
                            if($(this.cargo).val()!=""){
                                ob['Building']['LiftTypes'].push(
                                    {
                                        "LiftTypeSchema":{
                                            "Type":"cargo",
                                            "Count":$(this.cargo).val(),
                                            "LoadCapacity":$(this.cargo_LoadCapacity).val()
                                        }
                                    }    
                                )
                            }
                            if($(this.telpher).val()!=""){
                                ob['Building']['LiftTypes'].push(
                                    {
                                        "LiftTypeSchema":{
                                            "Type":"telpher",
                                            "Count":$(this.telpher).val(),
                                            "LoadCapacity":$(this.telpher_LoadCapacity).val()
                                        }
                                    }    
                                )
                            }
                            if($(this.passenger).val()!=""){
                                ob['Building']['LiftTypes'].push(
                                    {
                                        "LiftTypeSchema":{
                                            "Type":"passenger",
                                            "Count":$(this.passenger).val(),
                                            "LoadCapacity":$(this.passenger_LoadCapacity).val()
                                        }
                                    }    
                                )
                            }
                            return {
                                'Building':{
                                    'LiftTypes':JSON.stringify(ob['Building']['LiftTypes'])
                                }
                            };

                        }else{
                            return null;
                        }
                        break;
                    default:
                        if($(this.lift).val()!="" || $(this.travelator).val()!="" || $(this.escalator).val()!="") {
                            ob['Building'] ={'LiftTypes':[]};
                            if($(this.lift).val()!=""){
                                ob['Building']['LiftTypes'].push(
                                    {
                                        "LiftTypeSchema":{
                                            "Type":"lift",
                                            "Count":$(this.lift).val()
                                        }
                                    }    
                                )
                            }
                            if($(this.travelator).val()!=""){
                                ob['Building']['LiftTypes'].push(
                                    {
                                        "LiftTypeSchema":{
                                            "Type":"travelator",
                                            "Count":$(this.travelator).val()
                                        }
                                    }    
                                )
                            }
                            if($(this.escalator).val()!=""){
                                ob['Building']['LiftTypes'].push(
                                    {
                                        "LiftTypeSchema":{
                                            "Type":"escalator",
                                            "Count":$(this.escalator).val()
                                        }
                                    }    
                                )
                            }
                            return {
                                'Building':{
                                    'LiftTypes':JSON.stringify(ob['Building']['LiftTypes'])
                                }
                            };
                        }else{
                            return null;
                        }
                }
            },
            setValue(v){
                if(v.BUILDING_LIFTTYPES){
                    if(this.tip!='industrySale'){
                        var v_=JSON.parse(v.BUILDING_LIFTTYPES);
                        for(var i=0;i<v_.length;i++){
                            $(this[v_[i].LiftTypeSchema.Type]).val(v_[i].LiftTypeSchema.Count);
                        }
                        delete(v.BUILDING_LIFTTYPES);
                    }else{
                        var J = JSON.parse(v.BUILDING_LIFTTYPES);
                        for(var i=0;i<J.length;i++){
                            $(this[J[i].LiftTypeSchema.Type]).val(J[i].LiftTypeSchema.Count);
                            $(this[J[i].LiftTypeSchema.Type+'_LoadCapacity']).val(J[i].LiftTypeSchema.LoadCapacity);
                            
                        }
                        delete(v.BUILDING_LIFTTYPES);
                    }
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            switch (this.tip) {
                case 'industrySale':
                    var table = $('<tavle style="width:100%">').appendTo(this.gdiv);
                    var tr = $('<tr>').appendTo(table);
                    var td = $('<td style="width:130px">').appendTo(tr).html('Грузовой');
                    var td = $('<td>').appendTo(tr);
                    this.cargo = $('<input type="text" style="width:30px;margin-left:8px">').appendTo(td);
                    $(this.cargo).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr).html('Грузоподъемность');
                    this.cargo_LoadCapacity = $('<input type="text" style="width:40px;margin-left:8px">').appendTo(td);
                    $(this.cargo_LoadCapacity).inputmask({
                        mask: '9{1,3}'
                    });
                    var td = $('<td>').appendTo(tr).html('т.');

                    var tr = $('<tr>').appendTo(table);
                    var td = $('<td>').appendTo(tr).html('Тельфер');
                    var td = $('<td>').appendTo(tr);
                    this.telpher = $('<input type="text" style="width:30px;margin-left:8px">').appendTo(td);
                    $(this.telpher).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr).html('Грузоподъемность');
                    this.telpher_LoadCapacity = $('<input type="text" style="width:40px;margin-left:8px">').appendTo(td);
                    $(this.telpher_LoadCapacity).inputmask({
                        mask: '9{1,3}'
                    });
                    var td = $('<td>').appendTo(tr).html('т.');

                    var tr = $('<tr>').appendTo(table);
                    var td = $('<td>').appendTo(tr).html('Пассажирский');
                    var td = $('<td>').appendTo(tr);
                    this.passenger = $('<input type="text" style="width:30px;margin-left:8px">').appendTo(td);
                    $(this.passenger).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr).html('Грузоподъемность');
                    this.passenger_LoadCapacity = $('<input type="text" style="width:40px;margin-left:8px">').appendTo(td);
                    $(this.passenger_LoadCapacity).inputmask({
                        mask: '9{1,3}'
                    });
                    var td = $('<td>').appendTo(tr).html('т.');

                    break;
                default:
                    var table = $('<table style="width:100%">').appendTo(this.gdiv);
                    var tr = $('<tr>').appendTo(table);
                    var td = $('<td>').appendTo(tr);
                    var div = $('<div style="display:flex">').appendTo(td);
                    $('<div>').appendTo(div).html('лифты:');
                    this.lift =$('<input type="text" style="width:30px;margin-left:8px">').appendTo(div);
                    $(this.lift).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr);
                    var div = $('<div style="display:flex">').appendTo(td);
                    $('<div>').appendTo(div).html('травалаторы:');
                    this.travelator =$('<input type="text" style="width:30px;margin-left:8px">').appendTo(div);
                    $(this.travelator).inputmask({
                        mask: '9{1,2}'
                    });
                    var td = $('<td>').appendTo(tr);
                    var div = $('<div style="display:flex">').appendTo(td);
                    $('<div>').appendTo(div).html('эскалаторы:');
                    this.escalator  =$('<input type="text" style="width:30px;margin-left:8px">').appendTo(div);
                    $(this.escalator).inputmask({
                        mask: '9{1,2}'
                    });
            }
        }
    })
})


const Building_HouseLineType = Vue.component('Building_HouseLineType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Building_HouseLineType"></div>',
        methods: {
            getValue(){
                var ob = {};
                if($(this.input).val()!="") {
                    ob['Building'] ={"HouseLineType":$(this.input).val()};
                    return ob;
                }else{
                    return null;
                }

            },
            setValue(v){
                if(v.BUILDING_HOUSELINETYPE){
                    $(this.input).val(v.BUILDING_HOUSELINETYPE);
                    delete(v.BUILDING_HOUSELINETYPE);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:170px">').appendTo(this.gdiv);
            var list = {
                "first":"Первая",
                "second":"Вторая",
                "other":"Иная"
            }

            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})


const ConditionType = Vue.component('ConditionType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'tip':  String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="ConditionType"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                if($(this.input).val()!=0) {
                    ob['ConditionType'] =$(this.input).val();
                    return ob;
                    
                }else{
                    return null;
                }

            },
            setValue(v){
                if(v.CONDITIONTYPE){
                    $(this.input).val(v.CONDITIONTYPE);
                    delete(v.CONDITIONTYPE);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:270px">').appendTo(this.gdiv);
            switch (this.tip) {
                case 'industrySale':
                    var list = {
                        "cosmeticRepairsRequired":"Требуется косметический ремонт",
                        "majorRepairsRequired":"Требуется капитальный ремонт",
                        "typical":"Типовой ремонт"
                    }
                    break;
                case 'shoppingArea':
                    var list = {
                        "cosmeticRepairsRequired":"Требуется косметический ремонт",
                        "design":"Дизайнерский ремонт",
                        "finishing":"Под чистовую отделку",
                        "majorRepairsRequired":"Требуется капитальный ремонт",
                        "typical":"Типовой ремонт"
                    }
                    break;
                default:
                    var list = {
                        "office":"Офисная отделка",
                        "finishing":"Под чистовую отделку",
                        "majorRepairsRequired":"Требуется капитальный ремонт",
                        "cosmeticRepairsRequired":"Требуется косметический ремонт",
                    }
            }
            for(var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
                
            }
        }

    })
})


const OpeningHours = Vue.component('OpeningHours', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="OpeningHours"></div>',
        methods: {
            chClick(){
                if($(this.ch).prop("checked")) {
                    $(this.div).hide();
                }else{
                    $(this.div).show();
                }
            },
            getValue(){
                var ob = {"Building":{}};
                if($(this.ch).prop("checked")) {
                    ob["Building"]['OpeningHours']=JSON.stringify( {"Type":"roundTheClock"});
                    return ob;
                }else{
                    if($(this.inputFrom).val()=="" && $(this.inputTo).val()==""){
                        return null;
                    }else{
                        ob["Building"]['OpeningHours']=JSON.stringify({
                            "Type":"specific",
                            "From":$(this.inputFrom).val(),
                            "To":$(this.inputTo).val()
                        });
                        return ob;
                    }
                }
            },
            setValue(v){
                if(v.BUILDING_OPENINGHOURS){
                    var J = JSON.parse(v.BUILDING_OPENINGHOURS);
                    if(J.Type == "roundTheClock"){
                        $(this.ch).prop("checked","checked");
                        $(this.div).hide();
                    }
                    if(J.Type == "specific"){
                        $(this.ch).prop("checked",null);
                        $(this.inputFrom).val(J.From);
                        $(this.inputTo).val(J.To);
                    }
                    delete(v.BUILDING_OPENINGHOURS);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.div = $("<div style='display:flex'>").appendTo(this.gdiv);
            $('<div style="margin-left:8px;">').appendTo(this.div).html('с');            
            this.inputFrom =$('<input type="text" style="width:40px;margin-left:8px">').appendTo(this.div).val(this.value);
            $(this.inputFrom).inputmask({
                mask: '9{1,2}'
            });
            $('<div style="margin-left:8px;">').appendTo(this.div).html('до');            
            this.inputTo =$('<input type="text" style="width:40px;margin-left:8px">').appendTo(this.div).val(this.value);
            $(this.inputTo).inputmask({
                mask: '9{1,2}'
            });
            $("<div style='width:12px'>").appendTo(this.gdiv);
            this.ch = $('<input type="checkbox" class="custom-checkbox" id="Type'+uid+'">').appendTo(this.gdiv);
            $('<label for="Type'+uid+'">').appendTo(this.gdiv).html("Круглосуточно");
            this.ch.click($.proxy(this.chClick));
        }
    })
})



const InputType = Vue.component('InputType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="InputType"></div>',
        methods: {
            getValue(){
                var ob = {};
                if($(this.input).val()!="") {
                    ob['InputType'] =$(this.input).val();
                    return ob;
                    
                }else{
                    return null;
                }

            },
            setValue(v){
                if(v.INPUTTYPE){
                    $(this.input).val(v.INPUTTYPE);
                    delete(v.INPUTTYPE);
                }
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:180px">').appendTo(this.gdiv);
            $('<option value=""></option>').appendTo(this.input);
            $('<option value="commonFromStreet">Общий с улицы</option>').appendTo(this.input);
            $('<option value="commonFromYard">Общий со двора</option>').appendTo(this.input);
            $('<option value="separateFromStreet">Отдельный с улицы</option>').appendTo(this.input);
            $('<option value="separateFromYard">Отдельный со двора</option>').appendTo(this.input);
        }

    })
})


const DopUslug = Vue.component('DopUslug', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="DopUslug"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                if($(this.HasSafeCustody).prop("checked") || $(this.IsCustoms).prop("checked") || $(this.HasTransportServices).prop("checked")){
                    if($(this.HasSafeCustody).prop("checked")){
                        ob['HasSafeCustody'] = 1;
                    };
                    if($(this.IsCustoms).prop("checked")){
                        ob['IsCustoms'] = 1;
                    };
                    if($(this.HasTransportServices).prop("checked")){
                        ob['HasTransportServices'] = 1;
                    };
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.HASTRANSPORTSERVICES){
                    if(v.HASTRANSPORTSERVICES==1){
                        $(this.HasTransportServices).prop("checked","checked");
                        delete(v.HASTRANSPORTSERVICES);
                    }
                }
                if(v.ISCUSTOMS){
                    if(v.ISCUSTOMS==1){
                        $(this.IsCustoms).prop("checked","checked");
                        delete(v.ISCUSTOMS);
                    }
                }
                if(v.HASSAFECUSTODY){
                    if(v.HASSAFECUSTODY==1){
                        $(this.HasSafeCustody).prop("checked","checked");
                        delete(v.HASSAFECUSTODY);
                    }
                }
                
                
                //this.value = v;
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            var div = $("<div>").appendTo(this.gdiv);
            this.HasSafeCustody = $('<input type="checkbox" class="custom-checkbox" id="HasSafeCustody'+uid+'">').appendTo(div);
            $('<label for="HasSafeCustody'+uid+'">').appendTo(div).html("Ответственное хранение");
            $("<br>").appendTo(div);
            this.IsCustoms = $('<input type="checkbox" class="custom-checkbox" id="IsCustoms'+uid+'">').appendTo(div);
            $('<label for="IsCustoms'+uid+'">').appendTo(div).html("Таможня");
            $("<br>").appendTo(div);
            this.HasTransportServices = $('<input type="checkbox" class="custom-checkbox" id="HasTransportServices'+uid+'">').appendTo(div);
            $('<label for="HasTransportServices'+uid+'">').appendTo(div).html("Транспортные услуги");
            
            
        }

    })
})


const Parking = Vue.component('Parking', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'tip':String,
            'size':Number
        },
        template: '<div class="Parking"></div>',
        methods: {
            itemClick(ev) {
                var div = $(ev.delegateTarget).parent();
                    $(div).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
            },
            getValue(){
                var ob = {"Building":{"Parking":{}}};
                switch (this.tip) {
                    case 'Garage':
                        var ob = {"Building":{}};
                        if($(this.divList).find('.selectItem').length !=0) {
                            ob['Building']['Parking'] ={"Type":$(this.divList).find('.selectItem').attr('value')};
                            return ob;
                        }else{
                            return null;
                        }
                        
                        break;
                    case 'industrySale':
                        if($(this.divList).find('.selectItem').length !=0) {
                            ob['Building']['Parking']['LocationType']=$(this.divList).find('.selectItem').attr('value')
                        }
                        if($(this.divList1).find('.selectItem').length !=0) {
                            ob['Building']['Parking']['PurposeType'] = $(this.divList1).find('.selectItem').attr('value')
                        }
                        ob['Building']['Parking']['Currency'] = 'rur';
                        ob['Building']['Parking']['PlacesCount'] = $(this.PlacesCount).val();
                        ob['Building']['Parking']['PriceEntry'] = $(this.PriceMonthly).val();
                        return ob;
                        break;
                    default:
                    if($(this.divList).find('.selectItem').length !=0) {
                        var outOb={
                            'Type':$(this.divList).find('.selectItem').attr('value'),
                            'Currency':'rur',
                            'PlacesCount':$(this.PlacesCount).val(),
                            'PriceEntry': $(this.PriceMonthly).val()
                        };
                        if($(this.IsFree).prop("checked")){
                            outOb.IsFree = true
                        }else{
                            outOb.IsFree = false
                        }
                        
                        ob['Building']['Parking'] = JSON.stringify(outOb);
//                        ob['Building']['Parking']['Currency'] = 'rur';
//                        ob['Building']['Parking']['PlacesCount'] = $(this.PlacesCount).val();
//                        ob['Building']['Parking']['PriceEntry'] = $(this.PriceMonthly).val();                        
                        return ob;
                    }else{
                        return null;
                    }
                }
            },
            setValue(v){
                if(v.BUILDING_PARKING){
                    if(this.tip=='industrySale'){
                        var J = JSON.parse(v.BUILDING_PARKING);
                        $(this.divList).find("[value='" + J.LocationType + "']").addClass('selectItem');
                        $(this.divList1).find("[value='" + J.PurposeType + "']").addClass('selectItem');
                        $(this.PlacesCount).val(J.PlacesCount);
                        $(this.PriceMonthly).val(J.PriceEntry);
                        if(J.IsFree){
                            $(this.IsFree).prop("checked","checked");
                        }
                        delete(v.BUILDING_PARKING);
                    }else{
                        var list = $(this.divList).find('.item');
                        var v_ = JSON.parse(v.BUILDING_PARKING);
                        for(var i=0;i<list.length;i++){
                            if($(list[i]).attr('value')==v_.Type){
                                $(list[i]).addClass('selectItem');
                            }
                        }
                        $(this.PlacesCount).val(v_.PlacesCount);
                        $(this.PriceMonthly).val(v_.PriceEntry);
                        if(v_.IsFree){
                            $(this.IsFree).prop("checked","checked");
                        }
                        delete(v.BUILDING_PARKING);
                    }
                }                
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            switch (this.tip) {
                case 'Garage':
                    var list = 
                        {   
                            "ground":"Наземная",
                            "multilevel":"Многоуровневая",
                            "open":"Открытая",
                            "roof":"На крыше",
                            "underground":"Подземная"
                        };
                    for (var key in list){
                        var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                        b.click($.proxy(this.itemClick));
        
                    }                    
                    break;
                case 'industrySale':
                    var list = {   
                        "external":"За территорией объекта",
                        "internal":"На территории объекта"
                    };
                    for (var key in list){
                        var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                        b.click($.proxy(this.itemClick));
                    }
                    this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
                    $('<div class="label" >').appendTo(this.gdiv).html('Тип парковки');
                    this.divList1 = $("<div class='items flex-box'>").appendTo(this.gdiv);
                    this.divList1.css('display', 'flex');
                    var list = {   
                        "cargo":"Для грузового транспорта",
                        "passenger":"Для легковесного транспорта"
                    };
                    for (var key in list){
                        var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList1).html(list[key]);
                        b.click($.proxy(this.itemClick));
                    }
                    this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
                    $('<div class="label" >').appendTo(this.gdiv).html('Количество мест');
                    this.PlacesCount =$('<input type="text" style="width:70px">').appendTo(this.gdiv);
                    $(this.PlacesCount).inputmask({
                        mask: '9{1,3}'
                    });
                    
                    this.div2 = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
                    $('<div class="label" >').appendTo(this.div2).html("Стоимость вьезда");
                    this.PriceMonthly =$('<input type="text" style="width:130px">').appendTo(this.div2);
                    $(this.PriceMonthly).inputmask('decimal', {});
                    $('<div style="width:12px">').appendTo(this.div2);
                    this.IsFree = $('<input type="checkbox" class="custom-checkbox" id="IsFree'+uid+'">').appendTo(this.div2);
                    $('<label for="IsFree'+uid+'">').appendTo(this.div2).html("Бесплатная");
                    
                    break;
                
                default:
                    var list = 
                        {   
                            "ground":"Наземная",
                            "multilevel":"Многоуровневая",
                            "open":"Открытая",
                            "roof":"На крыше",
                            "underground":"Подземная"
                        };
                    for (var key in list){
                        var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                        b.click($.proxy(this.itemClick));
        
                    }
                    this.div1 = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
                    $('<div class="label" >').appendTo(this.div1).html("Количество мест");
                    this.PlacesCount =$('<input type="text" style="width:70px">').appendTo(this.div1);
                    $(this.PlacesCount).inputmask({
                        mask: '9{1,3}'
                    });
                    this.div2 = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
                    $('<div class="label" >').appendTo(this.div2).html("Стоимость парковки");
                    this.PriceMonthly =$('<input type="text" style="width:130px">').appendTo(this.div2);
                    $(this.PriceMonthly).inputmask('decimal', {});
                    $('<div style="width:12px">').appendTo(this.div2);
                    this.IsFree = $('<input type="checkbox" class="custom-checkbox" id="IsFree'+uid+'">').appendTo(this.div2);
                    $('<label for="IsFree'+uid+'">').appendTo(this.div2).html("Бесплатная");
            }
        }
    })
})



const Specialty = Vue.component('Specialty', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Specialty"></div>',
        methods: {
            inputSelect(){
                if($(this.input).val()!=""){
                    var b = $("<div class='item nomulty' value='" + $(this.input).val() + "' >").appendTo(this.divList).html($(this.input).find('[value="'+$(this.input).val()+'"]').html());
                    b.click($.proxy(this.itemClick));
                    $(this.input).find('[value="'+$(this.input).val()+'"]').remove();
                }
            },
            itemClick(ev) {
                $('<option value="'+$(ev.delegateTarget).attr('value')+'">'+$(ev.delegateTarget).html()+'</option>').appendTo(this.input);
                $(ev.delegateTarget).remove();
                $(this.input).each( function(){
                    $(this).html( $(this).find('option').sort(function(a, b) {
                        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                 }) );
                });     
                $(this.input).val("");
            },
            getValue(){
                var ob = {"Specialty":[]};
                if($(this.divList).find('.item').length !=0) {
                    var list = $(this.divList).find('.item');
                    for(var i=0;i<list.length;i++){
                        ob["Specialty"].push(
                            {"Types":$(list[i]).attr('value')}
                        );
                    }
                    return {
                        "Specialty":JSON.stringify(ob["Specialty"])
                    };
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.SPECIALTY){
                    var v_ = JSON.parse(v.SPECIALTY);
                    for(var i=0;i<v_.length;i++){
                        var text = $(this.input).find('[value="'+v_[i].Types+'"]').html();
                        var b = $("<div class='item nomulty' value='" + v_[i].Types + "' >").appendTo(this.divList)
                            .html($(this.input).find('[value="'+v_[i].Types+'"]').html());
                        b.click($.proxy(this.itemClick));
                        $(this.input).find('[value="'+v_[i].Types+'"]').remove();
                    }
                    delete(v.SPECIALTY);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            var div =$('<div>').appendTo(this.gdiv);
            this.input =$('<select class="select-css" style="width:360px">').appendTo(div);
            this.input.change($.proxy(this.inputSelect));

            this.divList = $("<div class='items flex-box'>").appendTo(div);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "":"",
                    "office":"Офис",
                    "shoppingFloorSpace":"Торговая площадь",
                    "warehouse":"Склад",
                    "production":"Производство",
                    "bakery":"Пекарня",
                    "bakeryProducts":"Выпечка",
                    "bank":"Банк",
                    "bar":"Бар",
                    "barbershop":"Парикмахерская",
                    "beautySaloon":"Салон красоты",
                    "cafe":"Кафе/ресторан",
                    "carWash":"Автомойка",
                    "carService":"Автосервис",
                    "clothesStudio":"Ателье одежды",
                    "club":"Клуб",
                    "confectionery":"Кондитерская",
                    "domesticServices":"Бытовые услуги",
                    "exhibition":"Выставка",
                    "fitnessCentre":"Фитнес",
                    "flowers":"Цветы",
                    "fruit":"Фрукты",
                    "guild":"Цех",
                    "gym":"Спортзал",
                    "hall":"Зал",
                    "hookah":"Кальянная",
                    "hostel":"Хостел",
                    "hotel":"Гостиница",
                    "medicalCenter":"Медицинский центр",
                    "mounting":"Шиномонтаж",
                    "other":"Другое",
                    "pawnshop":"Ломбард",
                    "pharmacy":"Аптека",
                    "products":"Продукты",
                    "publicCatering":"Общепит",
                    "restaurant":"Ресторан",
                    "sauna":"Сауна",
                    "school":"Школа",
                    "service":"Сервис",
                    "shawarma":"Шаурма",
                    "shop":"Магазин",
                    "showroom":"Шоурум",
                    "stomatology":"Стоматология",
                    "studio":"Фотостудия",
                    "trade":"Коммерция",
                    "workshop":"Мастерская",
                    "spaSaloon":"Spa салон",
                    "aviaBookingOffice":"Авиа кассы",
                    "carSpareParts":"Автозапчасти",
                    "automobileCenter":"Автосалон",
                    "fillingStation":"АЗС",
                    "alcholicBeveragesStore":"Алкомаркет",
                    "anticafe":"Антикафе",
                    "rentalBusiness":"Арендный бизнес",
                    "center":"База",
                    "recreationalCenter":"База отдыха",
                    "bathingComplex":"Банный комплекс",
                    "underwear":"Белье",
                    "bijouterie":"Бижутерия",
                    "poolhall":"Бильярдная",
                    "hospitalComplex":"Больничный комплекс",
                    "bowling":"Боулинг",
                    "bookmakerSOffice":"Букмекерская контора",
                    "boutique":"Бутик",
                    "snackBar":"Буфет",
                    "householdAppliances":"Бытовая техника",
                    "gallery":"Галерея",
                    "hypermarket":"Гипермаркет",
                    "guestHouse":"Гостевой дом",
                    "readyMadeBusiness":"Готовый бизнес",
                    "goodsForChildren":"Детские товары",
                    "childClub":"Детский клуб",
                    "childStore":"Детский магазин",
                    "daycare":"Детский сад",
                    "childCenter":"Детский центр",
                    "rentalHouse":"Доходный дом",
                    "factory":"Завод",
                    "lending":"Займы",
                    "petShop":"Зоомагазин",
                    "petProducts":"Зоотовары",
                    "dentalPolyclinic":"Зубная поликлиника",
                    "internetShop":"Интернет магазин",
                    "joga":"Йога",
                    "quest":"Квест",
                    "customerRelatedOffice":"Клиентский офис",
                    "clinic":"Клиника",
                    "cosmetics":"Косметика",
                    "cosmeticMedicine":"Косметология",
                    "coffeeHouse":"Кофейня",
                    "cookery":"Кулинария",
                    "smallProductionEnterprice":"Малое производство",
                    "manicure":"Маникюр",
                    "massageSalon":"Массажный салон",
                    "furniture":"Мебель",
                    "miniHotel":"Мини-отель",
                    "meet":"Мясо",
                    "notarySOffice":"Нотариальная контора",
                    "nightClub":"Ночной клуб",
                    "currencyExchange":"Обмен валюты",
                    "shoes":"Обувь",
                    "clothers":"Одежда",
                    "optics":"Оптика",
                    "recreationCenter":"Пансионат",
                    "perfumery":"Парфюмерия",
                    "pizzeria":"Пиццерия",
                    "dishes":"Посуда",
                    "representativeOffice":"Представительство",
                    "collectionPoint":"Пункт выдачи",
                    "workplace":"Рабочeе место",
                    "workRoom":"Рабочий кабинет",
                    "fish":"Рыба",
                    "salon":"Салон",
                    "phoneShop":"Салон связи",
                    "healthResort":"Санаторий",
                    "flexiblePurpose":"Свободное назначение",
                    "gymHall":"Спортивный зал",
                    "vahicleServiceCenter":"СТО",
                    "canteen":"Столовая",
                    "streetRetail":"Стрит ритейл",
                    "constructionMaterials":"Стройматериалы",
                    "dancingStudio":"Студия танцев",
                    "souvenirs":"Сувениры",
                    "bagStore":"Сумки",
                    "supermarket":"Супермаркет",
                    "sushi":"Суши",
                    "tatooSaloon":"Тату салон",
                    "printingOffice":"Типография",
                    "consumerGoods":"ТНП",
                    "householdGoods":"Товары для дома",
                    "trading":"Торговля",
                    "shopEquipment":"Торговое",
                    "shoppingComplex":"Торговый комплекс",
                    "tradingCenter":"Торговый центр",
                    "travelAgency":"Турагенство",
                    "services":"Услуги",
                    "educationalCenter":"Учебный центр",
                    "fastFood":"Фастфуд",
                    "farm":"Ферма",
                    "photoStudio":"Фото студия",
                    "dryCleaning":"Химчистка",
                    "bakeryComplex":"Хлебокомбинат",
                    "privatePractice":"Частная практика",
                    "sewingShop":"Швейный цех",
                    "electronicCigarette":"Электронные сигареты",
                    "jewerlyShop":"Ювелирный"
                };
            for (var key in list){
                $('<option value="'+key+'">'+list[key]+'</option>').appendTo(this.input);
            }
            $(this.input).each( function(){
                $(this).html( $(this).find('option').sort(function(a, b) {
                    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                }));
            });       
            $(this.input).val("");

            
        }
    })
})



const AccessType = Vue.component('AccessType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="AccessType"></div>',
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                var ob = {"Building":{}};
                if($(this.divList).find('.selectItem').length !=0) {
                    ob['Building']['AccessType'] =$(this.divList).find('.selectItem').attr('value');
                    return ob;
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.BUILDING_ACCESSTYPE){
                    var list = $(this.divList).find('.item');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).attr('value')==v.BUILDING_ACCESSTYPE){
                            $(list[i]).addClass('selectItem');
                        }
                    }
                    delete(v.BUILDING_ACCESSTYPE);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "free":"Свободный",
                    "passSystem":"Пропускная система"
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }
        }
    })
})



const ContractType = Vue.component('ContractType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="ContractType"></div>',
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            
            getValue(){
                var ob = {};
                if($(this.divList).find('.selectItem').length !=0) {
                    ob['BargainTerms'] ={'ContractType':$(this.divList).find('.selectItem').attr('value')};
                    return ob;
                }else{
                    return null;
                }

            },
            setValue(v){
                //this.value = v;
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "leaseAssignment":"Переуступка прав аренды",
                    "sale":"Продажа"
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));
            }
        }
    })
})


const Layout = Vue.component('Layout', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="Layout"></div>',
        methods: {
            itemClick(ev) {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
            },
            getValue(){
                var ob = {};
                if($(this.divList).find('.selectItem').length !=0) {
                    ob['Layout'] =$(this.divList).find('.selectItem').attr('value');
                    return ob;
                }else{
                    return null;
                }

            },
            setValue(v){
                if(v.LAYOUT){
                    var list = $(this.divList).find('.item');
                    for(var i=0;i<list.length;i++){
                        if($(list[i]).attr('value')==v.LAYOUT){
                            $(list[i]).addClass('selectItem');
                        }
                    }
                    delete(v.LAYOUT);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.divList = $("<div class='items flex-box'>").appendTo(this.gdiv);
            this.divList.css('display', 'flex');
            var list = 
                {   
                    "cabinet":"Кабинетная",
                    "corridorplan":"Коридорная",
                    "mixed":"Смешанная",
                    "openSpace":"Открытая"
                };
            for (var key in list){
                var b = $("<div class='item nomulty' value='" + key + "' >").appendTo(this.divList).html(list[key]);
                b.click($.proxy(this.itemClick));

            }


        }

    })
})




const CeilingHeight = Vue.component('CeilingHeight', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="CeilingHeight"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob['Building'] = {'CeilingHeight': this.CeilingHeight.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_CEILINGHEIGHT){
                    this.CeilingHeight.val(v.BUILDING_CEILINGHEIGHT);
                    delete(v.BUILDING_CEILINGHEIGHT);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.CeilingHeight =$('<input type="text" style="width:40px">').appendTo(this.gdiv).val(this.value);
            $(this.CeilingHeight).inputmask('decimal', {});
            $("<div style='margin-left:12px'>").appendTo(this.gdiv).html('м')
        }
    })
})


const FloorNumber = Vue.component('FloorNumber', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="FloorNumber"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                ob[this.field] = this.FloorNumber.val();
                ob['Building'] = {'FloorsCount': this.FloorsCount.val()};
                return ob;
            },
            setValue(v){
                if(v.BUILDING_FLOORSCOUNT){
                    this.FloorsCount.val(v.BUILDING_FLOORSCOUNT);
                    delete(v.BUILDING_FLOORSCOUNT);

                }
                if(v.FLOORNUMBER){
                    this.FloorNumber.val(v.FLOORNUMBER);
                    delete(v.FLOORNUMBER);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.FloorNumber =$('<input type="text" style="width:30px">').appendTo(this.gdiv).val(this.value);
            $(this.FloorNumber).inputmask({
                mask: '9{1,3}'
            });
            $('<div style="margin-left:8px;">').appendTo(this.gdiv).html('из');
            this.FloorsCount =$('<input type="text" style="width:30px;margin-left:8px">').appendTo(this.gdiv).val(this.value);
            $(this.FloorsCount).inputmask({
                mask: '9{1,3}'
            });
        }

    })
})



const Category = Vue.component('Category', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String
        },
        template: '<div class="Category"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                ob[this.field] = this.value;
                return ob;
            },
            setValue(v){
                //this.value = v;
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            

        }

    })
})

const HasGracePeriod = Vue.component('HasGracePeriod', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="HasGracePeriod"></div>',
        methods: {
            getValue(){
                if($(this.input).prop("checked")){
                    return {'BargainTerms':{
                        "HasGracePeriod":1
                    }};
                }else{
                    return {'BargainTerms':{
                        "HasGracePeriod":0
                    }};
                }
            },
            setValue(v){
                if(v.BARGAINTERMS_HASGRACEPERIOD){
                    if(v.BARGAINTERMS_HASGRACEPERIOD==1){
                        $(this.input).prop("checked","checked");
                    }else{
                        $(this.input).prop("checked",null);
                    }
                }
                delete(v.BARGAINTERMS_HASGRACEPERIOD);
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input = $('<input type="checkbox" class="custom-checkbox" id="ch1'+uid+'">').appendTo(this.gdiv);
            $('<label for="ch1'+uid+'">').appendTo(this.gdiv);
            


        }

    })
})


const LeaseType = Vue.component('LeaseType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="LeaseType"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                if($(this.direct).prop("checked")) {ob[this.field] ='direct'};
                if($(this.sublease).prop("checked")) {ob[this.field] ='sublease'};
                return {'BargainTerms':ob};

            },
            setValue(v){
                if(v.BARGAINTERMS_LEASETYPE){
                    if(v.BARGAINTERMS_LEASETYPE == "sublease"){
                        $(this.sublease).prop("checked","checked");
                    }
                    if(v.BARGAINTERMS_LEASETYPE == "direct"){
                        $(this.direct).prop("checked","checked");
                    }
                    delete(v.BARGAINTERMS_LEASETYPE);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            var divF =$('<div style="display:flex">').appendTo(this.gdiv);
            var div = $('<div style="display:flex">').appendTo(divF);
            this.direct = $('<input name="LeaseType" class="custom-radio" id="direct'+uid+'" type="radio" value="direct" checked="true">').appendTo(div);
            $('<label for="direct'+uid+'">').appendTo(div).html('Прямая аренда');
            var div = $('<div style="display:flex;margin-left:12px">').appendTo(divF);
            this.sublease = $('<input name="LeaseType" class="custom-radio" id="sublease'+uid+'" type="radio" value="sublease">').appendTo(div);
            $('<label for="sublease'+uid+'">').appendTo(div).html('Субаренда');

        }

    })
})



const SecurityDeposit = Vue.component('SecurityDeposit', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="SecurityDeposit"></div>',
        methods: {
            getValue(){
                if($(this.input).val()!=""){
                    var ob = {};
                    ob[this.field] = $(this.input).val();
                    return {'BargainTerms':ob};
                }else{
                    return null;
                }
                
            },
            setValue(v){
                if(v.BARGAINTERMS_SECURITYDEPOSIT){
                    $(this.input).val(v.BARGAINTERMS_SECURITYDEPOSIT);
                    delete(v.BARGAINTERMS_SECURITYDEPOSIT);
                }
                if(v.BARGAINTERMS_DEPOSIT){
                    $(this.input).val(v.BARGAINTERMS_DEPOSIT);
                    delete(v.BARGAINTERMS_DEPOSIT);
                }
            }

        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:120px">').appendTo(this.gdiv).val(this.value);
            $(this.input).inputmask({
                mask: '9{1,12}'
            });
            $('<div style="margin-left:8px;">').appendTo(this.gdiv).html('р.');

        }

    })
})



const MinLeaseTerm = Vue.component('MinLeaseTerm', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="MinLeaseTerm"></div>',
        computed: {

        },
        methods: {
            getValue(){
                if($(this.input).val()!=""){
                    var ob = {};
                    ob[this.field] = $(this.input).val();
                    return {'BargainTerms':ob};
                }else{
                    return null;
                }
                
            },
            setValue(v){
                if(v.BARGAINTERMS_MINLEASETERM){
                    $(this.input).val(v.BARGAINTERMS_MINLEASETERM);
                    delete(v.BARGAINTERMS_MINLEASETERM);

                }
            }
        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text" style="width:40px">').appendTo(this.gdiv).val(this.value);
            $(this.input).inputmask({
                mask: '9{1,3}'
            });
            $('<div style="margin-left:8px;">').appendTo(this.gdiv).html('мес.');

        }

    })
})



const CadastralNumber = Vue.component('CadastralNumber', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="CadastralNumber"></div>',
        methods: {
            getValue(){
                var ob = {};
                ob[this.field] = $(this.input).val();
                return ob;

            },
            setValue(v){
                if(v.CADASTRALNUMBER){
                    $(this.input).val(v.CADASTRALNUMBER);
                }                
                delete(v.CADASTRALNUMBER);
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<input type="text">').appendTo(this.gdiv).val(this.value);
        }

    })
})


const IncludedOptions = Vue.component('IncludedOptions', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'tip':String,
            'size':Number
        },
        template: '<div class="IncludedOptions"></div>',
        methods: {
            getValue(){
                if($(this.operationalCosts).prop("checked") || $(this.utilityCharges).prop("checked")){
                    var ob = {};
                    ob['IncludedOptions'] = [];
                    if($(this.operationalCosts).prop("checked")){
                        ob['IncludedOptions'].push({'IncludedOptionsEnum':'operationalCosts'});
                    }
                    if($(this.utilityCharges).prop("checked")){
                        ob['IncludedOptions'].push({'IncludedOptionsEnum':'utilityCharges'});
                    }
                    return {'BargainTerms':ob};
                    
                }else{
                    return null;
                }
            },
            setValue(v){
                if(v.BARGAINTERMS_INCLUDEDOPTIONS && v.BARGAINTERMS_INCLUDEDOPTIONS!=""){
                    var v_ = JSON.parse(v.BARGAINTERMS_INCLUDEDOPTIONS);
                    for(var i=0;i<v_.length;i++){
                        if(v_[i].IncludedOptionsEnum=="operationalCosts"){
                            $(this.operationalCosts).prop("checked","true");
                        }
                        if(v_[i].IncludedOptionsEnum=="utilityCharges"){
                            $(this.utilityCharges).prop("checked","true");
                        }
                    }
                    delete(v.BARGAINTERMS_INCLUDEDOPTIONS);
                }
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            var divList =$('<div>').appendTo(this.gdiv);
            var div =$('<div style="display:flex">').appendTo(divList);
            
            switch (this.tip) {
                case 'commercialLandRent':
                    this.utilityCharges =$('<input type="checkbox" class="custom-checkbox" id="utilityCharges'+uid+'">').appendTo(div);
                    $('<label for="utilityCharges'+uid+'">').appendTo(div).html('Коммунальные платежи');
                    var div =$('<div style="display:flex;margin-top:8px">').appendTo(divList);
                    this.operationalCosts =$('<input type="checkbox" class="custom-checkbox" id="operationalCosts'+uid+'">').appendTo(div);
                    $('<label for="operationalCosts'+uid+'">').appendTo(div).html('Эксплутационные расходы');

                break;
                default:
                    this.operationalCosts =$('<input type="checkbox" class="custom-checkbox" id="operationalCosts'+uid+'">').appendTo(div);
                    $('<label for="operationalCosts'+uid+'">').appendTo(div).html('Операционные расходы');
                    var div =$('<div style="display:flex;margin-top:8px">').appendTo(divList);
                    this.utilityCharges =$('<input type="checkbox" class="custom-checkbox" id="utilityCharges'+uid+'">').appendTo(div);
                    $('<label for="utilityCharges'+uid+'">').appendTo(div).html('Коммунальные услуги');
            }
        }
    })
})

const PrepayMonths = Vue.component('PrepayMonths', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="PrepayMonths"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                ob[this.field] = $(this.input).val();
                return {'BargainTerms':ob};

            },
            setValue(v){
                if(v.BARGAINTERMS_PREPAYMONTHS){
                    $(this.input).val(v.BARGAINTERMS_PREPAYMONTHS);
                    delete(v.BARGAINTERMS_PREPAYMONTHS)                    
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css" style="width:160px">').appendTo(this.gdiv);
            $('<option value="1">1 месяц</option>').appendTo(this.input);
            $('<option value="2">2 месяца</option>').appendTo(this.input);
            $('<option value="3">3 месяца</option>').appendTo(this.input);
            $('<option value="4">4 месяца</option>').appendTo(this.input);
            $('<option value="5">4 месяцев</option>').appendTo(this.input);
            $('<option value="6">6 месяцев</option>').appendTo(this.input);
            $('<option value="7">7 месяцев</option>').appendTo(this.input);
            $('<option value="8">8 месяцев</option>').appendTo(this.input);
            $('<option value="9">9 месяцев</option>').appendTo(this.input);
            $('<option value="10">10 месяцев</option>').appendTo(this.input);
            $('<option value="11">11 месяцев</option>').appendTo(this.input);
            $('<option value="12">1 год</option>').appendTo(this.input);
            
            
        }

    })
})



const VatType = Vue.component('VatType', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'size':Number
        },
        template: '<div class="VatType"></div>',
        computed: {

        },
        methods: {
            getValue(){
                var ob = {};
                ob[this.field] = $(this.input).val();
                return {'BargainTerms':ob};

            },
            setValue(v){
                if(v.BARGAINTERMS_VATTYPE){
                    $(this.input).val(v.BARGAINTERMS_VATTYPE);
                    delete(v.BARGAINTERMS_VATTYPE);
                }
            }

        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            this.input =$('<select class="select-css">').appendTo(this.gdiv);
            $('<option value="included">НДС включен</option>').appendTo(this.input);
            $('<option value="notIncluded">НДС не включен</option>').appendTo(this.input);
            $('<option value="usn">УСН (упрощенная система налогообложения)</option>').appendTo(this.input);
            
            
        }

    })
})


const TotalArea = Vue.component('TotalArea', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'value': String,
            'title': String,
            'mask':String,
            'type':String,
            'size':String,
        },
        template: '<div class="TotalArea"></div>',
        methods: {
            createRow_(v){
                console.log(v);
                $(this.tdiv).show();
                $(this.chinput).prop("checked","checked");

                var size="";
                if(this.size){
                    size="style='width:"+this.size+"'";
                }                        
                var tr = $('<tr>').appendTo(this.table);
                var td = $('<td style="display:flex">').appendTo(tr);
                var input1 =$('<input type="text" '+size+' value="'+v.Area+'">').appendTo(td);
                if(this.mask){
                    $(input1).inputmask({
                        mask: this.mask
                    });
                }
                $('<apan style="margin-left:6px">').appendTo(td).html('м²');
                this.Price1 =$('<input type="text" style="width:80px;margin-left:18px" value="'+v.Price+'">').appendTo(td);
                $(this.Price1).inputmask('decimal', {});
                
                var b = $('<div style="cursor:pointer;margin-left:12px">').appendTo(td).html('<i class="fa fa-trash" aria-hidden="true"></i>');
                b.click(function(){
                    console.log($(this).parent().parent().remove());
                })
            },
            createRow(){
                var size="";
                if(this.size){
                    size="style='width:"+this.size+"'";
                }                        
                var tr = $('<tr>').appendTo(this.table);
                var td = $('<td style="display:flex">').appendTo(tr);
                var input1 =$('<input type="text" '+size+'>').appendTo(td);
                if(this.mask){
                    $(input1).inputmask({
                        mask: this.mask
                    });
                }
                $('<apan style="margin-left:6px">').appendTo(td).html('м²');
                this.Price1 =$('<input type="text" style="width:80px;margin-left:18px">').appendTo(td);
                $(this.Price1).inputmask('decimal', {});
                
                var b = $('<div style="cursor:pointer;margin-left:12px">').appendTo(td).html('<i class="fa fa-trash" aria-hidden="true"></i>');
                b.click(function(){
                    console.log($(this).parent().parent().remove());
                })
            },
            multyCh(){
                if($(this.chinput).prop("checked")){
                    $(this.tdiv).show();
                    if($(this.table).find('tr').length==0){
                        this.createRow();
                    }
                }else{
                    //$(this.tdiv).hide();
                    $(this.table).empty();
                }
            },
            getValue(){
                if(this.field=='TotalAreaSale'){
                            var outOb = {
                                "BargainTerms":{
                                    "Currency":"rur",
                                    "Price":$(this.Price).val()
                                    },
                                "TotalArea":$(this.input).val()
                            };
                            return outOb;
                }
                if(this.type){
                    switch (this.type) {
                        case 'garageRent':
                            var outOb = {
                                "BargainTerms":{
                                    "Currency":"rur",
                                    "PriceType":'all',
                                    "PaymentPeriod":"monthly",
                                    "Price":$(this.Price).val()
                                    },
                                "TotalArea":$(this.input).val()
                            };
                            return outOb;
                            break;
                        case 'garageSale':
                            var outOb = {
                                "BargainTerms":{
                                    "Currency":"rur",
                                    "Price":$(this.Price).val()
                                    },
                                "TotalArea":$(this.input).val()
                            };
                            return outOb;
                            break;
                        default:
                            return null;
                    }                    
                }else{
                    var ob = {};
                    ob['Price'] = $(this.Price).val();
                    ob['Currency'] ='rur';
                    switch ($(this.PriceTip).val()) {
                        case 'KVG':
                                ob['PriceType'] = 'squareMeter';
                                ob['PaymentPeriod'] = 'annual';
                            break;
                        case 'KVM':
                                ob['PriceType'] = 'squareMeter';
                                ob['PaymentPeriod'] = 'monthly';
                            break;
                        case 'ALL':
                                ob['PriceType'] = 'all';
                                ob['PaymentPeriod'] = 'monthly';
                            break;
                        
                        default:
                            
                    }
                    var outOb = {};
                    outOb['BargainTerms'] = ob;
                    outOb[this.field] = $(this.input).val();

                    if($(this.table).find('tr').length>0){
                        var list = $(this.table).find('tr');
                        
                        var ararea = [];
                        for(var i=0;i<list.length;i++){
                            var inputList = $(list[i]).find('input');
                            var s = {'RentByPartsSchema':{
                                'Area':$(inputList[0]).val(),
                                'Price':$(inputList[1]).val(),
                                'VatPrice':0
                            }};
                            ararea.push(s);
                        }
                        outOb['AreaParts'] =JSON.stringify(ararea);
                    }else{
                        outOb['AreaParts'] =JSON.stringify([]);
                    }
                    return outOb;
                    
                }
            },
            setValue(v){
                if(v.AREAPARTS){
                    var v_ = JSON.parse(v.AREAPARTS);
                    for(var i=0;i<v_.length;i++){
                        this.createRow_(v_[i].RentByPartsSchema);
                    }
                    delete(v.AREAPARTS);
                }
                if(v.BARGAINTERMS_PAYMENTPERIOD && v.BARGAINTERMS_PRICETYPE && v.BARGAINTERMS_PRICE){
                    if(v.BARGAINTERMS_PAYMENTPERIOD!="" && v.BARGAINTERMS_PRICETYPE!="" && v.BARGAINTERMS_PRICE!="" ){
                        if(v.BARGAINTERMS_PAYMENTPERIOD == "monthly" && v.BARGAINTERMS_PRICETYPE =="all"){
                            $(this.PriceTip).val('ALL');
                        }
                        if(v.BARGAINTERMS_PAYMENTPERIOD == "monthly" && v.BARGAINTERMS_PRICETYPE =="squareMeter"){
                            $(this.PriceTip).val('KVM');
                        }
                        if(v.BARGAINTERMS_PAYMENTPERIOD == "annual" && v.BARGAINTERMS_PRICETYPE =="squareMeter"){
                            $(this.PriceTip).val('KVG');
                        }
                        $(this.input).val(v.TOTALAREA);
                        if(v.BARGAINTERMS_PRICE!=""){
                            $(this.Price).val(v.BARGAINTERMS_PRICE);
                        }
                        delete(v.BARGAINTERMS_PAYMENTPERIOD);
                        delete(v.BARGAINTERMS_PRICETYPE);
                        delete(v.BARGAINTERMS_PRICE);
                        //delete(v.TOTALAREA);
                    }
                }
                console.log('--------------------------------')
            }
        },
        mounted() {
            var uid = generateUID();
            this.gdiv = $('<div class="vfield" style="display:flex">').appendTo(this.$el);
            this.label = $('<div class="label" >').appendTo(this.gdiv).html(this.title);
            if(this.field=='TotalAreaSale'){
                var size="";
                if(this.size){
                    size="style='width:"+this.size+"'";
                }
                this.input =$('<input type="text" '+size+'>').appendTo(this.gdiv).val(this.value);
                if(this.mask){
                    $(this.input).inputmask({
                        mask: this.mask
                    });
                }
                $('<apan style="margin-left:6px">').appendTo(this.gdiv).html('м²');
                this.Price =$('<input type="text" style="width:80px;margin-left:18px">').appendTo(this.gdiv);
                $(this.Price).inputmask('decimal', {});
                $('<apan style="margin-left:6px">').appendTo(this.gdiv).html('руб. за всё');
                
//                this.PriceTip =$('<select class="select-css" style="width:100px;margin-left:8px">').appendTo(this.gdiv);
//                $('<option value="KVM">м²</option>').appendTo(this.PriceTip);
//                $('<option value="ALL">Всего</option>').appendTo(this.PriceTip);
            }else{
                var size="";
                if(this.size){
                    size="style='width:"+this.size+"'";
                }
                this.input =$('<input type="text" '+size+'>').appendTo(this.gdiv).val(this.value);
                if(this.mask){
                    $(this.input).inputmask({
                        mask: this.mask
                    });
                }
                $('<apan style="margin-left:6px">').appendTo(this.gdiv).html('м²');
                switch (this.type) {
                    case 'garageRent':
                        this.Price =$('<input type="text" style="width:80px;margin-left:18px">').appendTo(this.gdiv);
                        $(this.Price).inputmask('decimal', {});
                        $('<apan style="margin-left:6px">').appendTo(this.gdiv).html('Цена за объект в месяц');
                        break;
                    case 'garageSale':
                        this.Price =$('<input type="text" style="width:80px;margin-left:18px">').appendTo(this.gdiv);
                        $(this.Price).inputmask('decimal', {});
                        $('<apan style="margin-left:6px">').appendTo(this.gdiv).html('Цена');
                        break;
                    default:
                    this.Price =$('<input type="text" style="width:80px;margin-left:18px">').appendTo(this.gdiv);
                    $(this.Price).inputmask('decimal', {});
                    this.PriceTip =$('<select class="select-css" style="margin-left:8px;width:140px">').appendTo(this.gdiv);
                    $('<option value="KVG">м² в год</option>').appendTo(this.PriceTip);
                    $('<option value="KVM">м² в месяц</option>').appendTo(this.PriceTip);
                    if(this.type != "notAll"){
                        $('<option value="ALL">Всего в месяц</option>').appendTo(this.PriceTip);
                        var div = $('<div style="margin-top:2px;margin-left:12px">').appendTo(this.gdiv);
                        this.chinput =$('<input type="checkbox" class="custom-checkbox" id="multyCh'+uid+'">').appendTo(div);
                        $('<label for="multyCh'+uid+'">').appendTo(div).html('Можно частями');
                        this.chinput.click($.proxy(this.multyCh));
                    }

                    
                    

                    this.tdiv = $('<div style="display:none">').appendTo(this.$el);
                    var left = $(this.gdiv).find('.label').width();
                    this.table = $('<table>').appendTo(this.tdiv);
                    this.table.css('margin-left',(left-3)+'px');
                    var b = $("<div class='itemB' style='width:fit-content;margin-left:"+left+"px;margin-top:4px'>").appendTo(this.tdiv).html('Добавить площадь');
                    b.click($.proxy(this.createRow));
                }
            }
        }
    })
})
