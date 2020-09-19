var dadataToken = "d7ea78712d8f7dcd2ff6b781ae949470562df9eb";
// отобрать все общие параметры для типов недвижимости в отдельный блок. 4779 6488 0046 0237 

const setAdres = Vue.component('setAdres', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'title': String,
            'list': Array,
            'multy': String
        },
        template: '<div v-bind:class="\'setAdres  setAdres_\'+field"></div>',
        methods: {
            drawInfo(J){
                var self = this;
                var interval = setInterval(function() {
                    if(!self.divInfo){
                        return;
                    }
                    clearInterval(interval);
                    $(self.divInfo).empty();
                    var table= $("<table style='width:100%'>").appendTo(self.divInfo);
                    var tr = $("<tr>").appendTo(table);
                    var td = $("<td>").appendTo(tr).html(J.GOROD.city_type_full);
                    var td = $("<td>").appendTo(tr).html(J.GOROD.city);
                    self.GOROD = {
                        city_type_full:J.GOROD.city_type_full,
                        city:J.GOROD.city
                    };
                    var tr = $("<tr>").appendTo(table);
                    var td = $("<td>").appendTo(tr).html("район");
                    self.RAJON = J.RAJON;
                    var td = $("<td>").appendTo(tr).html(J.RAJON);
                    var tr = $("<tr>").appendTo(table);
                    var td = $("<td>").appendTo(tr).html("округ");
                    var td = $("<td>").appendTo(tr).html(J.OKRUG);
                    self.OKRUG = J.OKRUG;
                    var tr = $("<tr>").appendTo(table);
                    var td = $("<td>").appendTo(tr).html(J.STREET.street_type_full);
                    var td = $("<td>").appendTo(tr).html(J.STREET.street);
                    self.STREET = {
                        street_type_full:J.STREET.street_type_full,
                        street:J.STREET.street
                    };
                    
                    var tr = $("<tr>").appendTo(table);
                    var td = $("<td>").appendTo(tr).html("дом");
                    var td = $("<td>").appendTo(tr).html(J.DOM);
                    self.DOM = J.DOM;
                    var tr = $("<tr>").appendTo(table);
                    var td = $("<td>").appendTo(tr).html("налоговая");
                    var td = $("<td>").appendTo(tr).html(J.NALOG.NAME+' ('+J.NALOG.CODE+')');
                    self.NALOG ={
                        "NAME":J.NALOG.NAME,
                        "CODE":J.NALOG.CODE
                    }
                    self.coordinates = J.COORDINATES;
                    self.map.geoObjects.removeAll();
                    var myGeoObject = new ymaps.GeoObject({
                        geometry: {
                            type: "Point",
                            coordinates: J.COORDINATES
                        },
                        properties: {}
                    }, {
                        preset: 'islands#blackStretchyIcon',
                        draggable: false
                    });
                    self.map.geoObjects.add(myGeoObject);   
                    self.map.setCenter(J.COORDINATES, 16);
                    $(self.tableMetro).empty();
                    for(var i=0;i<J.METRO.length;i++){
                        var metroName = J.METRO[i].NAME;
                        var tr = $('<tr>').appendTo(self.tableMetro);
                        var td = $('<td>').appendTo(tr).html(metroName);
                        var td = $('<td>').appendTo(tr);
                        var input = $('<input type="text" style="width:30px;height:25px;padding-left:4px">').appendTo(td);
                        input.val(J.METRO[i].TIME);

                        $(input).inputmask({
                            mask: '9{1,2}'
                        });
                        var td = $('<td>').appendTo(tr);
                        input =$('<select class="select-css" style="width:130px">').appendTo(td);
                        $('<option value="walk">Пешком</option>').appendTo(input);
                        $('<option value="transport">Транспортом</option>').appendTo(input);
                        input.val(J.METRO[i].TIPE);
  
                    }
                    
                    
                    self.drawMap = true;
                },50);
            },
            getValue(){
                var list = $(this.tableMetro).find('tr');
                var metro=[];
                for(var i= 0;i<list.length;i++){
                    var listtd = $(list[i]).find('td');
                    metro.push({
                        NAME:$(listtd[0]).html(),
                        TIME:$(listtd[1]).find('input').val(),
                        TIPE:$(listtd[2]).find('select').val()
                    });
                }
                return {
                    "fulladresss":JSON.stringify({
                        "GOROD":this.GOROD,
                        "RAJON":this.RAJON,
                        "OKRUG":this.OKRUG,
                        "STREET":this.STREET,
                        "DOM":this.DOM,
                        "NALOG":this.NALOG,
                        "COORDINATES":this.coordinates,
                        "METRO":metro
                    })
                }                
            },
            setValue(v){
                if(v.FULLADRESSS){
                    var J = JSON.parse(v.FULLADRESSS);
                    console.log(J);
                    if(J.GOROD){
                        this.drawMap = false;
                        this.drawInfo(J);
                    }
                }
                
            },
            itemClick(ev) {
                if (this.multy == 'false' || this.multy == 'undefined') {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                }
            }
        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            var self = this;
            this.drawMap = true;
            var intervalMap = setInterval(function() {
                if (ymaps.Map == undefined) {
                    return;
                }
                else { //200603-0294-324900 электронной форме за номером ID=7393345 

                    clearInterval(intervalMap);
                    var gdiv = $('<div class="gdiv">').appendTo(self.$el);
//                    var div = $('<div class="overlay">').appendTo(self.$el);
                    var div = $('<div class="preloader">').appendTo(self.$el);
                    $('.preloader, .overlay').fadeOut();

                    var div = $('<div class="DivinputAdress">').appendTo(gdiv);
                    self.inputAdress = $('<input style="width:100%;height:20px" class="inputAdress">').appendTo(div);

                    var divM = $('<div class="tableMap">').appendTo(gdiv);
                    self.mapDiv = $('<div class="map-flex-box mapDiv" style="height:200px">').appendTo(divM);
                    self.divInfo = $('<div class="map-flex-box infoRow">').appendTo(divM);
                    self.tableMetro = $('<table>').appendTo(gdiv);

                    self.map = new ymaps.Map(self.mapDiv[0], {
                        center: [55.76, 37.64],
                        zoom: 16,
                        controls: []
                    });
                    self.map.controls.add('zoomControl', {
                        position: {
                            right: 10,
                            top: 10
                        }
                    });

                    var suggestView = new ymaps.SuggestView(self.inputAdress[0]);
                    console.log('self.inputAdress[0]',$('.inputAdress')[0]);
                    suggestView.state.findMap = self.map;
                    
                    suggestView.options.set('zIndex',90000);
                    console.log(self.inputAdress.position().top,self.inputAdress.offset().top);
                    suggestView.options.set('offset',[self.inputAdress.offset().left-self.inputAdress.position().left,self.inputAdress.offset().top - self.inputAdress.position().top]);
                    
                    //suggestView.options.set('container',$('.inputAdress')[0]);
                    suggestView.state.events.add('change', function(e) {
                        if(!self.drawMap) return;
                        var activeIndex = suggestView.state.get('activeIndex');
                        if (typeof activeIndex == 'number') {
                            var activeItem = suggestView.state.get('items')[activeIndex];
                            if (activeItem) {
                                var myGeocoder = ymaps.geocode(activeItem.value);
                                myGeocoder.then(
                                    function(res) {
                                        v = res.geoObjects.get(0).geometry.getCoordinates();
                                        e.originalEvent.target.findMap.setCenter(v, 16);
                                    },
                                    function(err) {
                                        console.log('Ошибка');
                                    }
                                );
                            }
                        }

                    });
                    self.map.events.add('actionend', function(e) {
                        if(!self.drawMap) return;
                        $('.preloader, .overlay').fadeIn();
                        $(self.divInfo).empty();
                        
                        v = e.originalEvent.map.getCenter();
                        self.coordinates = v;
                        e.originalEvent.map.geoObjects.removeAll();
                        var myGeoObject = new ymaps.GeoObject({
                            geometry: {
                                type: "Point",
                                coordinates: v
                            },
                            properties: {}
                        }, {
                            preset: 'islands#blackStretchyIcon',
                            draggable: false
                        });
                        e.originalEvent.map.geoObjects.add(myGeoObject);
                        var map = e.originalEvent.map;
                        map.timerStart = 0;
                        if (map.idtimer == undefined || map.idtimer == null) {
                            map.idtimer = setInterval(function() {
                                map.timerStart++;
                                if (map.timerStart == 4) {
                                    clearTimeout(map.idtimer);
                                    map.idtimer = null;
                                    var url = "//geocode-maps.yandex.ru/1.x/?apikey=80f1ab75-f93f-476a-ab4c-4f8de2496f76&geocode=" + v[1] + "," + v[0] + "&kind=metro&format=json&spn=0.04,0.04";
                                    $.ajax({
                                        form: self,
                                        url: url, // указываем URL и
                                        dataType: "json",
                                        crossDomain: true, // тип загружаемых данных
                                        success: function(data, textStatus) { // вешаем свой обработчик на функцию success
                                            var ar = data.response.GeoObjectCollection.featureMember;
                                            var a = [];
                                            $(self.tableMetro).empty();
                                            for (var i = 0; i < ar.length; i++) {
                                                var g = ar[i].GeoObject.Point.pos.split(' ');
                                                g[0] = 1 * g[0];
                                                g[1] = 1 * g[1];
                                                var metroName = ar[i].GeoObject.name.replace('метро ', '');
                                                if (a.indexOf(metroName) == -1 &&
                                                    metroName.indexOf('E14') == -1 &&
                                                    metroName.indexOf('14E') == -1 &&
                                                    metroName.indexOf('14Е') == -1 &&
                                                    metroName.indexOf('14e') == -1) {
                                                    var tr = $('<tr>').appendTo(self.tableMetro);
                                                    var td = $('<td>').appendTo(tr).html(metroName);
                                                    var td = $('<td>').appendTo(tr);
                                                    var input = $('<input type="text" style="width:30px;height:25px;padding-left:4px">').appendTo(td);
                                                    $(input).inputmask({
                                                        mask: '9{1,2}'
                                                    });
                                                    var td = $('<td>').appendTo(tr);
                                                    input =$('<select class="select-css" style="width:130px">').appendTo(td);
                                                    $('<option value="walk">Пешком</option>').appendTo(input);
                                                    $('<option value="transport">Транспортом</option>').appendTo(input);

                                                    a.push(metroName);
                                                }
                                            }
                                        }
                                    });
                                    var url = "//geocode-maps.yandex.ru/1.x/?apikey=80f1ab75-f93f-476a-ab4c-4f8de2496f76&geocode=" + v[1] + "," + v[0] + "&kind=district&format=json"; //&rspn=1&spn=0.03,0.03";
                                    $.ajax({
                                        form: self,
                                        url: url, // указываем URL и
                                        dataType: "json",
                                        crossDomain: true, // тип загружаемых данных
                                        success: function(data, textStatus) { // вешаем свой обработчик на функцию success
                                            var ar = data.response.GeoObjectCollection.featureMember;
                                            //console.log('ardata',data)
                                            var OKRUG ="";
                                            var RAJON ="";
                                            for (var i = 0; i < ar.length; i++) {
                                                if (ar[i].GeoObject.name.indexOf('административный округ') != -1) {
                                                    OKRUG = ar[i].GeoObject.name.replace(' административный округ', '');
                                                } else {
                                                    RAJON = ar[i].GeoObject.name.replace(' район', '');
                                                }
                                            }
                                                
                                            $.ajax({
                                                form: self,
                                                type: 'POST',
                                                url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                    'Authorization': 'Token ' + dadataToken
                                                },
                                                data: JSON.stringify({
                                                    lat: v[0],
                                                    lon: v[1],
                                                    count: 1
                                                }),
                                                success: function(data) { // вешаем свой обработчик на функцию success
                                                    if (data.suggestions.length > 0) {
                                                        var nalogkode = data.suggestions[0].data;
                                                        //console.log(self.divInfo,data.suggestions[0].data);
                                                        var table= $("<table style='width:100%'>").appendTo(self.divInfo);
                                                        var tr = $("<tr>").appendTo(table);
                                                        var td = $("<td>").appendTo(tr).html(data.suggestions[0].data.city_type_full);
                                                        var td = $("<td>").appendTo(tr).html(data.suggestions[0].data.city);
                                                        self.GOROD = {
                                                            city_type_full:data.suggestions[0].data.city_type_full,
                                                            city:data.suggestions[0].data.city
                                                        };
                                                        var tr = $("<tr>").appendTo(table);
                                                        var td = $("<td>").appendTo(tr).html("район");
                                                        self.RAJON = RAJON;
                                                        var td = $("<td>").appendTo(tr).html(RAJON);
                                                        var tr = $("<tr>").appendTo(table);
                                                        var td = $("<td>").appendTo(tr).html("округ");
                                                        var td = $("<td>").appendTo(tr).html(OKRUG);
                                                        self.OKRUG = OKRUG;
                                                        var tr = $("<tr>").appendTo(table);
                                                        var td = $("<td>").appendTo(tr).html(data.suggestions[0].data.street_type_full);
                                                        var td = $("<td>").appendTo(tr).html(data.suggestions[0].data.street);
                                                        self.STREET = {
                                                            street_type_full:data.suggestions[0].data.street_type_full,
                                                            street:data.suggestions[0].data.street
                                                        };
                                                        
                                                        var tr = $("<tr>").appendTo(table);
                                                        var td = $("<td>").appendTo(tr).html("дом");
                                                        if(data.suggestions[0].data.block!=null){
                                                            var td = $("<td>").appendTo(tr).html(data.suggestions[0].data.house + data.suggestions[0].data.block_type[0] + data.suggestions[0].data.block);
                                                            self.DOM = data.suggestions[0].data.house + data.suggestions[0].data.block_type[0] + data.suggestions[0].data.block;
                                                        }else{
                                                            var td = $("<td>").appendTo(tr).html(data.suggestions[0].data.house);
                                                            self.DOM = data.suggestions[0].data.house;
                                                        }



                                                        $.ajax({
                                                            form: this.form,
                                                            type: 'POST',
                                                            url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/fns_unit',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Accept': 'application/json',
                                                                'Authorization': 'Token ' + dadataToken
                                                            },
                                                            data: JSON.stringify({
                                                                query: nalogkode.tax_office
                                                            }),
                                                            success: function(data) { // вешаем свой обработчик на функцию success
                                                                if (data.suggestions.length > 0) {
                                                                    var tr = $("<tr>").appendTo(table);
                                                                    var td = $("<td>").appendTo(tr).html("налоговая");
                                                                    var td = $("<td>").appendTo(tr).html(data.suggestions[0].data.name+' ('+data.suggestions[0].data.code+')');
                                                                    self.NALOG ={
                                                                        "NAME":data.suggestions[0].data.name,
                                                                        "CODE":data.suggestions[0].data.code
                                                                    }
                                                                }
                                                                $('.preloader, .overlay').fadeOut();
                                                            },
                                                            error: function(data) {
                                                                console.log(JSON.parse(data.responseText))
                                                            }
                                                        });
        
        
        
        
                                                    }
                                                },
                                                error: function(data) {
                                                    console.log(JSON.parse(data.responseText))
                                                }
                                            });
                                        }
                                    });
                                }
                            }, 200);
                        }



                    });


                }

            }, 150);


            /*
                        this.mapDiv = $('<div class="mapDiv" style="height:200px">').appendTo(this.$el);
                        if (ymaps.Map == undefined) {
                            alert();
                        }
                        console.log('ymap', ymaps.Map);
                        this.map = new ymaps.Map(this.mapDiv[0], {
                            center: [55.76, 37.64],
                            zoom: 16,
                            controls: []
                        });

                        this.headerDiv = $('<div class="header" style="display:flex">').appendTo(this.$el);

                        $("<div class='title flex-box'>").appendTo(this.headerDiv).html(this.title);

                        $(this.$el).data('vueComp', this);
                        this.divList = $("<div class='items flex-box'>").appendTo(this.headerDiv);
                        this.divList.css('display', 'flex');

                        for (var i = 0; i < this.list.length; i++) {
                            if (this.multy == 'false' || this.multy == 'undefined') {
                                var b = $("<div class='item nomulty' value='" + this.list[i] + "' >").appendTo(this.divList).html(this.list[i]);
                            }
                            else {
                                var b = $("<div class='item multy' value='" + this.list[i] + "' >").appendTo(this.divList).html(this.list[i]);
                            }
                            b.click($.proxy(this.itemClick));
                        }
                        this.divBoot = $("<div class='flex-box'>").appendTo(this.headerDiv);
            */
        }

    })
})
