(function($) {

    function makeConfigurator(options){

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

    var methods = {
        init : function(opts) {

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

			this.value=allOptions.initial;

			this.getValue = function getValue(){
				return this.value;
			}

            makeConfigurator(allOptions);

			return this;
        }
    };

    $.fn.cronGenerator = function(method) {
        return methods.init.apply(this, arguments);
    };

})(jQuery);
