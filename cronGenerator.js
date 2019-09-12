(function($) {

    //Returns an UUIDv4
    function create_UUID(){
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    function makeContentConfiguratorSeconds(contentElement,cronGenerator){
        var checkboxEverySecond = $('<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox"><label class="form-check-label">Cada Segundo</label></input></div>').appendTo(contentElement);
        var checkboxSelection = $('<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox"><label class="form-check-label">Seleccion</label></input></div>').appendTo(contentElement);
        
        checkboxEverySecond[0].getElementsByTagName('input')[0].onclick = function(e){
            checkboxSelection[0].getElementsByTagName('input')[0].checked=false;
        };
        checkboxSelection[0].getElementsByTagName('input')[0].onclick=function(e){
            checkboxEverySecond[0].getElementsByTagName('input')[0].checked=false;
        };
    }

    //create structure of visual generator
    function makeConfigurator(element, cronGenerator){

        //if it is not configured yet
        if(element.getElementsByClassName("tabsCronGenerator").length == 0){
            var tabs = $('<div class="tabsCronGenerator"></div>').appendTo(element);
            var tabOptions = $('<ul class="nav nav-tabs" role="tablist"></ul>').appendTo(tabs);
            $('<li class="nav-item"><a class="nav-link active" data-toggle="tab" role="tab" href="#tabs-seconds-'+cronGenerator.uuid+'">Segundos</a></li>').appendTo(tabOptions);
            $('<li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tabs-minutes-'+cronGenerator.uuid+'">Minutos</a></li>').appendTo(tabOptions);
            $('<li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tabs-hours-'+cronGenerator.uuid+'">Horas</a></li>').appendTo(tabOptions);
            $('<li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tabs-days-'+cronGenerator.uuid+'">Días</a></li>').appendTo(tabOptions);
            $('<li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tabs-daysOfWeek-'+cronGenerator.uuid+'">Días de la semana</a></li>').appendTo(tabOptions);
            $('<li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tabs-months-'+cronGenerator.uuid+'">Meses</a></li>').appendTo(tabOptions);
            $('<li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tabs-years-'+cronGenerator.uuid+'">Años</a></li>').appendTo(tabOptions);
            
            var tabsContent= $('<div class="tab-content"></div>').appendTo(tabs);
            var tabContentSeconds=$('<div class="tab-pane fade show active" role="tabpanel" id="tabs-seconds-'+cronGenerator.uuid+'"></div>').appendTo(tabsContent);
            var tabContentMinutes=$('<div class="tab-pane fade" role="tabpanel" id="tabs-minutes-'+cronGenerator.uuid+'"></div>').appendTo(tabsContent);
            var tabContentHours=$('<div class="tab-pane fade" role="tabpanel" id="tabs-hours-'+cronGenerator.uuid+'"></div>').appendTo(tabsContent);
            var tabContentDays=$('<div class="tab-pane fade" role="tabpanel" id="tabs-days-'+cronGenerator.uuid+'"></div>').appendTo(tabsContent);
            var tabContentDaysOfWeek=$('<div class="tab-pane fade" role="tabpanel" id="tabs-daysOfWeek-'+cronGenerator.uuid+'"></div>').appendTo(tabsContent);
            var tabContentMonths=$('<div class="tab-pane fade" role="tabpanel" id="tabs-months-'+cronGenerator.uuid+'"></div>').appendTo(tabsContent);
            var tabContentYears=$('<div class="tab-pane fade" role="tabpanel" id="tabs-years-'+cronGenerator.uuid+'"></div>').appendTo(tabsContent);

            //TODO create content for all tabs
            makeContentConfiguratorSeconds(tabContentSeconds,cronGenerator);
        }
    }

	var defaultOptions = {
        initial : "* * * * * *",
        seconds : {
            allowConfigure  : true,
        },
        minutes : {
            allowConfigure  : true,
        },
        hours : {
            allowConfigure  : true,
        },
        days : {
            allowConfigure  : true,
        },
        daysOfWeek : {
            allowConfigure  : true,
        },
        months : {
            allowConfigure  : true,
        },
        years : {
            allowConfigure  : true,
        },
        customValues : undefined,
        onChange: undefined
	};

    function CronGenerator(element, opts) {

        //initialize options with user options and default options
        var options = opts ? opts : {};
        var allOptions = $.extend([], defaultOptions, options);
        $.extend(allOptions, {
            seconds     : $.extend({}, defaultOptions.seconds, allOptions, options.seconds),
            minutes     : $.extend({}, defaultOptions.minutes, allOptions, options.minutes),
            hours       : $.extend({}, defaultOptions.hours, allOptions, options.hours),
            days        : $.extend({}, defaultOptions.days, allOptions, options.days),
            daysOfWeek  : $.extend({}, defaultOptions.daysOfWeek, allOptions, options.daysOfWeek),
            months      : $.extend({}, defaultOptions.months, allOptions, options.months),
            years       : $.extend({}, defaultOptions.years, allOptions, options.years),
        });

        //set attributes
        this.uuid=create_UUID();
        this.element = element;
        this.value=allOptions.initial;
        this.allOptions=allOptions;

        //create elements
        makeConfigurator(element,this);
    };

    CronGenerator.prototype.getValue = function () {
        return this.value;
    };

    CronGenerator.prototype.getElement = function () {
        return this.element;
    };

    //Returns the CronGenerator associated to element
    //If many elements are passed, it returns a list of cronGenerators
    $.fn.cronGenerator = function(options) {
        cronGenerators = [];

        this.each(function(){
            cronGenerators.push(new CronGenerator(this, options));
        });

        //TODO retuns always the list?
        if(cronGenerators.length==1)
            return cronGenerators[0];
        else
            return cronGenerators;
    };

})(jQuery);
