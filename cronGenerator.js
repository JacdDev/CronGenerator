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

    function newAccordionCard(cronGenerator, id) {
        var card = {};
        var referedId = id + '-' + cronGenerator.uuid;

        card.jqueryElement = $('<div class="card"></div>');
        
        // Header
        card.header = $('<button class="btn btn-link btn-sm" data-toggle="collapse" data-target="#collapse-'+referedId+'" aria-expanded="false" aria-controls="collapse-'+referedId+'"></button>');
        card.jqueryElement.append(
            $('<div class="card-header" id="heading-'+referedId+'"><em class="fas fa-chevron-right"></em></div>')
                .on('click', function(event){
                    $(event.target).find('button').click();
                })
                .append(card.header)
        );

        // Body
        card.body = $('<div class="card-body"></div>');
        card.jqueryElement.append(
            $('<div id="collapse-'+referedId+'" class="collapse" aria-labelledby="heading-'+referedId+'" data-parent="#accordion-'+cronGenerator.uuid+'"></div>')
                .on('hide.bs.collapse show.bs.collapse', function (event) {
                    if ($(this).is(event.target)) {
                        $(event.target)
                            .parents('.card:first')
                            .find('.card-header:first em')
                            .toggleClass("fa-chevron-down fa-chevron-right");
            
                        if (event.type == 'hide') {
                            $(event.target).find('.collapse').collapse('hide');
                        }
                    }
            
                })
                .append(card.body)
        );
        
        cronGenerator.accordion.append(card.jqueryElement);

        return card;
    }

    //TODO create structure of visual generator
    function makeConfigurator(cronGenerator){
        cronGenerator.jqueryElement.data('id', this.uuid);

        cronGenerator.accordion = $('<div class="accordion" id="accordion-'+cronGenerator.uuid+'"></div>');
        
        // Seconds
        if (cronGenerator.allOptions.seconds.allowConfigure){
            var secondCard = newAccordionCard(cronGenerator, 'seconds');
            secondCard.header.text('SEGUNDOS')
            secondCard.body.text('segundos')
        }

        // Minutes
        if (cronGenerator.allOptions.minutes.allowConfigure){
            var secondCard = newAccordionCard(cronGenerator, 'minutes');
            secondCard.header.text('MINUTOS')
            secondCard.body.text('minutos')
        }

        // Hours
        if (cronGenerator.allOptions.hours.allowConfigure){
            var secondCard = newAccordionCard(cronGenerator, 'hours');
            secondCard.header.text('HORAS')
            secondCard.body.text('horas')
        }

        // Days
        if (cronGenerator.allOptions.days.allowConfigure){
            var secondCard = newAccordionCard(cronGenerator, 'days');
            secondCard.header.text('DÍAS')
            secondCard.body.text('Días')
        }

        // Days of Week
        if (cronGenerator.allOptions.daysOfWeek.allowConfigure){
            var secondCard = newAccordionCard(cronGenerator, 'days-week');
            secondCard.header.text('DÍAS DE LA SEMANA')
            secondCard.body.text('Días de la semana')
        }

        // Months
        if (cronGenerator.allOptions.months.allowConfigure){
            var secondCard = newAccordionCard(cronGenerator, 'months');
            secondCard.header.text('MESES')
            secondCard.body.text('Meses')
        }

        // Years
        if (cronGenerator.allOptions.years.allowConfigure){
            var secondCard = newAccordionCard(cronGenerator, 'years');
            secondCard.header.text('AÑOS')
            secondCard.body.text('Años')
        }

        // Result
        cronGenerator.resultJquery = $('<div class="result"></div>');
        cronGenerator.resultJquery.text(cronGenerator.value)

        cronGenerator.jqueryElement
            .append(cronGenerator.accordion)
            .append(cronGenerator.resultJquery);
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
        this.jqueryElement=$(element)
        this.value=allOptions.initial;
        this.allOptions=allOptions;

        makeConfigurator(this);
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

        // TODO: retuns always the list?
        if(cronGenerators.length==1)
            return cronGenerators[0];
        else
            return cronGenerators;
    };

})(jQuery);
