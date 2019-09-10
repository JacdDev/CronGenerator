(function($) {

    //TODO create structure of visual generator
    function makeConfigurator(element, options){

        //TODO add jqueryui
        if(element.getElementsByClassName("tabsCronGenerator").length == 0){
            var tabs = $('<div class="tabsCronGenerator">').appendTo(element);
            var tabOptions = $('<div class="tabsCronGenerator">').appendTo(tabs);
            $('<li><a href="#tabs-seconds">Segundos</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-minutes">Minutos</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-hours">Horas</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-days">Días</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-daysOfWeek">Días de la semana</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-months">Meses</li>').appendTo(tabOptions);
            $('<li><a href="#tabs-years">Años</li>').appendTo(tabOptions);
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

        this.element = element;
        this.value=allOptions.initial;

        makeConfigurator(element,allOptions);
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
