(function($) {

	var defaultOptions = {
		initial : "* * * * * *",
	};

    var methods = {
        init : function(opts) {

            var options = opts ? opts : {};
            var allOptions = $.extend([], defaultOptions, options);
			this.value=allOptions.initial;

			this.getValue = function getValue(){
				return this.value;
			}

			return this;
        }
    };

    $.fn.cronGenerator = function(method) {
        return methods.init.apply(this, arguments);
    };

})(jQuery);
