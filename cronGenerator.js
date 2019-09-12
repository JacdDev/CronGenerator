(function($) {

    //Create a UUIDv4
    function create_UUID(){
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    function newAccordionCard(cronGenerator, id) {
        let card = {};
        let referedId = id + '-' + cronGenerator.uuid;

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
            let card = newAccordionCard(cronGenerator, 'seconds');
            card.header.text('SEGUNDOS')
            card.body.html(makeSecondsSection(cronGenerator))
        }

        // Minutes
        if (cronGenerator.allOptions.minutes.allowConfigure){
            let card = newAccordionCard(cronGenerator, 'minutes');
            card.header.text('MINUTOS')
            card.body.html(makeMinutesSection(cronGenerator))
        }

        // Hours
        if (cronGenerator.allOptions.hours.allowConfigure){
            let card = newAccordionCard(cronGenerator, 'hours');
            card.header.text('HORAS')
            card.body.html(makeHoursSection(cronGenerator))
        }

        // Days
        if (cronGenerator.allOptions.days.allowConfigure){
            let card = newAccordionCard(cronGenerator, 'days');
            card.header.text('DÍAS')
            card.body.text('Días')
        }

        // Days of Week
        if (cronGenerator.allOptions.daysOfWeek.allowConfigure){
            let card = newAccordionCard(cronGenerator, 'days-week');
            card.header.text('DÍAS DE LA SEMANA')
            card.body.text('Días de la semana')
        }

        // Months
        if (cronGenerator.allOptions.months.allowConfigure){
            let card = newAccordionCard(cronGenerator, 'months');
            card.header.text('MESES')
            card.body.text('Meses')
        }

        // Years
        if (cronGenerator.allOptions.years.allowConfigure){
            let card = newAccordionCard(cronGenerator, 'years');
            card.header.text('AÑOS')
            card.body.text('Años')
        }

        // Result
        cronGenerator.resultJquery = $('<div class="result"></div>');
        cronGenerator.resultJquery.text(cronGenerator.value);

        cronGenerator.accordion.append(cronGenerator.resultJquery);
        cronGenerator.jqueryElement.append(cronGenerator.accordion);
    }

	let defaultOptions = {
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

    function CronGenerator(element, opts = {}) {
        let allOptions = {...defaultOptions, ...opts}

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
