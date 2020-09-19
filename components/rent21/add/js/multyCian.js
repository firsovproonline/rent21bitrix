const multyCian = Vue.component('multyCian', function(resolve, reject) {
    resolve({
        props: {
            'field': String,
            'title': String,
            'list': Array,
            'multy': String
        },
        template: '<div v-bind:class="\'multycian multycian_\'+field"></div>',
        computed: {

        },
        methods: {
            send() {
                app.showModal = true;
            },
            itemClick(ev) {
                if (this.multy == 'false' || this.multy == 'undefined') {
                    $(this.divList).find('.item').removeClass('selectItem');
                    $(ev.delegateTarget).addClass('selectItem');
                    this.$parent.selectItem(this.field,$(ev.delegateTarget).attr('value'));
                }
            },
            getValue(){
                //console.log()
                return $(this.divList).find('.selectItem').attr('value');
            },
            setValue(v){
                $(this.divList).find('.item').removeClass('selectItem');
                var list = $(this.divList).find('.item');
                for(var i=0;i<list.length;i++){
                    if(v == $(list[i]).attr('value')){
                        $(list[i]).addClass('selectItem');
                    }
                }
            },
            setList(list){
                $(this.divList).empty();
                for (var i = 0; i < list.length; i++) {
                    if (this.multy == 'false' || this.multy == 'undefined') {
                        var b = $("<div class='item nomulty' value='" + list[i] + "' >").appendTo(this.divList).html(list[i]);
                    }
                    else {
                        var b = $("<div class='item multy' value='" + list[i] + "' >").appendTo(this.divList).html(list[i]);
                    }
                    b.click($.proxy(this.itemClick));
                }
                
            }
        },
        created() {
            //            console.log('multyCian создание', this.field)
        },
        mounted() {
            //            console.log('multyCian mounted', this);
            //$(this.$el).css('padding-top', '8px');
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

        }

    })
})
