(function($) {

    //Create a UUIDv4
    function create_UUID(){
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    //TODO create structure of visual generator
    function makeConfigurator(element, cronGenerator){

        if(element.getElementsByClassName("tabsCronGenerator").length == 0){
            var tabs = $('<div class="tabsCronGenerator">').appendTo(element);
            var tabOptions = $('<ul>').appendTo(tabs);
            $('<li><a href="#tabs-seconds-'+cronGenerator.uuid+'">Segundos</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-minutes-'+cronGenerator.uuid+'">Minutos</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-hours-'+cronGenerator.uuid+'">Horas</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-days-'+cronGenerator.uuid+'">Días</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-daysOfWeek-'+cronGenerator.uuid+'">Días de la semana</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-months-'+cronGenerator.uuid+'">Meses</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-years-'+cronGenerator.uuid+'">Años</li>').appendTo(tabOptions);
            
            $('<div id="tabs-seconds-'+cronGenerator.uuid+'"><p>seconds</p></div>').appendTo(tabs);
            $('<div id="tabs-minutes-'+cronGenerator.uuid+'"><p>minutes</p></div>').appendTo(tabs);
            $('<div id="tabs-hours-'+cronGenerator.uuid+'"><p>hours</p></div>').appendTo(tabs);
            $('<div id="tabs-days-'+cronGenerator.uuid+'"><p>days</p></div>').appendTo(tabs);
            $('<div id="tabs-daysOfWeek-'+cronGenerator.uuid+'"><p>daysOfWeek</p></div>').appendTo(tabs);
            $('<div id="tabs-months-'+cronGenerator.uuid+'"><p>months</p></div>').appendTo(tabs);
            $('<div id="tabs-years-'+cronGenerator.uuid+'"><p>years</p></div>').appendTo(tabs);

            tabs.tabs();
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

        this.uuid=create_UUID();
        this.element = element;
        this.value=allOptions.initial;
        this.allOptions=allOptions;

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
