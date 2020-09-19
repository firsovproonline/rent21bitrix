(function($) {
    jQuery.fn.farmer = function(indata) {
        var self = this;
        if (window.ymaps == undefined) {
            // надо грузить яндекс карту
            console.log('error load map api');
            $('<script src="//api-maps.yandex.ru/2.1/?apikey=' + indata.ymapkey + '&lang=ru_RU">').appendTo(document.body);
        }
        var intervalMap = setInterval(function() {
            if (window.ymaps == undefined) {
                return;
            }
            else {
                if (window.ymaps.Map == undefined) {
                    return;
                }
                clearInterval(intervalMap);
                self.map = new ymaps.Map(self[0], {
                    center: [55.76, 37.64],
                    zoom: 10,
                    controls: []
                });
                self.map.controls.add('zoomControl', {
                    position: {
                        right: 10,
                        top: 10
                    }
                });
                var myPolygon = new ymaps.Polygon(indata.poligon, {
                    hintContent: "Многоугольник"
                }, {
                    fillColor: '#ddccdd',
                    strokeWidth: 2
                });

                self.map.geoObjects.add(myPolygon);


                console.log(self, indata);
            }
        }, 100);

    };
})(jQuery);
