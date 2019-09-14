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

    function makeSwitch({id, checked} = {id: null, checked: false}) {
        return $(`
            <div class="onoffswitch">
                <input type="checkbox" name="${id}" class="onoffswitch-checkbox" id="${id}" disabled ${ checked ? 'checked' :'' }>
                <label class="onoffswitch-label" for="${id}">
                    <span class="onoffswitch-inner"></span>
                    <span class="onoffswitch-switch"></span>
                </label>
            </div>
        `);

    }

    function makeSecondsSection(cronGenerator){
        return $(`
            <label>Cada <input type="text" maxlength="2" size="2" value="1" name="seconds-${cronGenerator.uuid}" /> segundo/s</label>
        `);
    }

    function makeMinutesSection(cronGenerator){
        let repeatMinutes = $('<div class="minutes-subsection minutes-repeat inline"></div>')
            .append(makeSwitch({checked: true}))
            .append($(`
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="minutes-${cronGenerator.uuid}" /> minuto/s
                entre el minuto <input type="text" maxlength="2" size="2" value="0" name="start-minute-${cronGenerator.uuid}" />
                y <input type="text" maxlength="2" size="2" value="59" name="end-minute-${cronGenerator.uuid}" /></label>
            `));

        let selectMinutes = $('<div class="minutes-subsection select-minutes inline"></div>')
            .append(makeSwitch())
            .append($(`
                <label>El/Los minuto/s <input type="text" size="20" value="" name="minutes-${cronGenerator.uuid}" />
            `));

        
        let minutes = $('<div></div>')
            .append(repeatMinutes)
            .append(selectMinutes);

        minutes.find('input').on('focus', function(event){
            let minutesRepeat = $(event.target).parents('.minutes-subsection');
            let card = minutesRepeat.parent();
            let checkbox = minutesRepeat.find('.onoffswitch-checkbox').prop("checked", true);
            card.find('.onoffswitch-checkbox').not(checkbox).prop("checked", false);
        });
    
        return minutes;
    }

    function makeHoursSection(cronGenerator){
        return $('<div class="minutes-repeat"></div>')
            .append(makeSwitch())
            .append($(`
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="hours-${cronGenerator.uuid}" /> hora/s
                 entre la hora <input type="text" maxlength="2" size="2" value="0" name="start-hour-${cronGenerator.uuid}" />
                 y <input type="text" maxlength="2" size="2" value="23" name="end-hour-${cronGenerator.uuid}" /></label>
            `));
    }

    function makeMonthsSection(cronGenerator){

        //month select options
        let monthSelectOptions = `
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="1">Noviembre</option>
                <option value="12">Diciembre</option>
            `;

        //element to select month's range
        let repeatMonths = $('<div class="months-subsection months-repeat inline"></div>')
            .append(makeSwitch({checked: true}))
            .append($(`
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="months-${cronGenerator.uuid}" /> mes/es
                entre <select size="1" value="Enero" name="start-month-${cronGenerator.uuid}">${monthSelectOptions}</select>
                y <select size="1" value="Diciembre" name="end-month-${cronGenerator.uuid}">${monthSelectOptions}</select>
                <button type="button" class="add-range-months">+</button></label>
            `));
        repeatMonths[0].getElementsByTagName('select')[1].value = "12";

        //element to select many months
        let selectMonths = $('<div class="months-subsection select-months inline"></div>')
            .append(makeSwitch())
            .append($(`
                <label>El/Los mes/es <input type="text" size="20" value="" name="months-${cronGenerator.uuid}" />
            `));

        //parent element which includes all the selectors
        let months = $('<div></div>')
            .append(repeatMonths)
            .append(selectMonths);

        //switch logic
        months.find('input').on('focus', function(event){
            let monthsRepeat = $(event.target).parents('.months-subsection');
            let card = monthsRepeat.parent();
            let checkbox = monthsRepeat.find('.onoffswitch-checkbox').prop("checked", true);
            card.find('.onoffswitch-checkbox').not(checkbox).prop("checked", false);
        });

        //button logic to add month's range selectors
        repeatMonths[0].getElementsByTagName('button')[0].onclick=function(event){
            let repeatMonthsNewLine = $('<div class="months-subsection months-repeat inline"></div>')
            .append($(`
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="months-${cronGenerator.uuid}" /> mes/es
                entre <select size="1" value="Enero" name="start-month-${cronGenerator.uuid}">${monthSelectOptions}</select>
                y <select size="1" value="Diciembre" name="end-month-${cronGenerator.uuid}">${monthSelectOptions}</select>
                <button type="button" class="remove-range-months">-</button></label>
            `));
            repeatMonthsNewLine[0].getElementsByTagName('select')[1].value = "12";
            repeatMonthsNewLine[0].getElementsByTagName('button')[0].onclick=function(event){
                event.currentTarget.parentNode.parentNode.removeChild(event.currentTarget.parentNode);
            };
    
            selectMonths[0].parentNode.insertBefore(repeatMonthsNewLine[0], selectMonths[0]);
        };


        return months;
    }

    //TODO create structure of visual generator
    function makeConfigurator(cronGenerator){
        cronGenerator.jqueryElement.data('id', this.uuid);

        cronGenerator.accordion = $('<div class="cron-component accordion" id="accordion-'+cronGenerator.uuid+'"></div>');
        
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
            card.body.html(makeMonthsSection(cronGenerator))
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
