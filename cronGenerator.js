(function($) {

    //TODO create structure of visual generator
    function makeConfigurator(cronGenerator,options){
$('<div class="tab">').appendTo(cronGenerator);
$('<button class="tablinks" onclick="openTab(event, ""seconds"")">Seconds</button>').appendTo(cronGenerator);
$('<button class="tablinks" onclick="openCity(event, ""minutes"")">Minutes</button>').appendTo(cronGenerator);
$('<button class="tablinks" onclick="openCity(event, ""Tokyo"")">Hours</button>').appendTo(cronGenerator);
$('</div>').appendTo(cronGenerator);
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
        daysOfWeek : { //TODO delete this option?
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

    function CronGenerator($this, opts) {

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

        this.element = $this;
        this.value=allOptions.initial;

        //makeConfigurator(this,allOptions);
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
