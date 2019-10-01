(function($) {

    /*************************/
    /**   UTIL FUNCTIONS    **/
    /*************************/

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

    //switch logic
    function switchLogic(target){
        let sectionSelected = $(target).parents('.section-selected');
        let card = sectionSelected.parent();
        card.find('.section-selected').attr("data-selected", "false");
        sectionSelected.attr("data-selected", "true");
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

    function updateValueElement(cronGenerator){
        cronGenerator.resultJquery.text(Object.values(cronGenerator.value).join(' '));
    }

    function updateMinuteValue(cronGenerator){

        let finalMinuteValue = "";

        let minuteCard = $(document).find(`#collapse-minutes-${cronGenerator.uuid}`);
        let minutesRepeatElement = minuteCard.find(".minutes-repeat");
        let minutesRepeatCheckBox = minutesRepeatElement.find("input[type=checkbox]");
        //if range checkbox is checked
        if(minutesRepeatCheckBox.prop("checked")){
            let inlineMultipleElement = minutesRepeatElement.find(".inline.multiple");
            //for each range selector
            for (var i = 0; i < inlineMultipleElement.length && finalMinuteValue.localeCompare("*")!=0; ++i){
                let firstSelectElement=$(inlineMultipleElement[i]).find(`input[name="start-minute-${cronGenerator.uuid}"]`);
                let secondSelectElement=$(inlineMultipleElement[i]).find(`input[name="end-minute-${cronGenerator.uuid}"]`);
                let inputElement=$(inlineMultipleElement[i]).find(`input[name="minutes-${cronGenerator.uuid}"]`);

                //if input is not a number between 1 and 12, is invalid
                let currentInputValue = Number(inputElement.val());
                if(!Number.isInteger(currentInputValue) || currentInputValue < 0 || currentInputValue > 59){
                    inputElement.addClass("invalid-input");
                }
                else{
                    inputElement.removeClass("invalid-input");
                    // if result is 1-12/1, is equals than *
                    if(inputElement.val().localeCompare("1") == 0 
                    && firstSelectElement.val().localeCompare("0") == 0 
                    && secondSelectElement.val().localeCompare("59") == 0){
                        finalMinuteValue = "*";
                    }
                    else{
                        finalMinuteValue+=firstSelectElement.val()+"-"+secondSelectElement.val();
                        if(inputElement.val().localeCompare("1") != 0)
                            finalMinuteValue += "/"+inputElement.val();
                        finalMinuteValue+=",";
                    }
                }
                    
            }
        }
        
        let selectMinutesElement = minuteCard.find(".select-minutes");
        let selectMinutesCheckBox = selectMinutesElement.find("input[type=checkbox]");
        //if minute selector checkbox is checked
        if(selectMinutesCheckBox.prop("checked") && finalMinuteValue.localeCompare("*")!=0){
            let inputElement=selectMinutesElement.find('input:last');
            inputElement.removeClass("invalid-input");
            let inputElementSplit = inputElement.val().split(',');
            let inputElementValues = [];
            let insertValue = true;
            //for each value between commas
            for (var i = 0; i < inputElementSplit.length && insertValue; ++i){
                let currentSelectValue = Number(inputElementSplit[i]);

                if(insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalMinuteValue+=inputElementValues.join(',');
        }else if(finalMinuteValue.endsWith(",")){
            finalMinuteValue = finalMinuteValue.substring(0,finalMinuteValue.length-1);
        }

        //if no checkbox is selected
        if(finalMinuteValue.localeCompare("") == 0)
            finalMinuteValue ="*";

        cronGenerator.value.minutes = finalMinuteValue;
        updateValueElement(cronGenerator);
    }

    function updateMonthValue(cronGenerator){

        let finalMonthValue = "";

        let monthCard = $(document).find(`#collapse-months-${cronGenerator.uuid}`);
        let monthsRepeatElement = monthCard.find(".months-repeat");
        let monthsRepeatCheckBox = monthsRepeatElement.find("input[type=checkbox]");
        //if range checkbox is checked
        if(monthsRepeatCheckBox.prop("checked")){
            let inlineMultipleElement = monthsRepeatElement.find(".inline.multiple");
            //for each range selector
            for (var i = 0; i < inlineMultipleElement.length && finalMonthValue.localeCompare("*")!=0; ++i){
                let firstSelectElement=$(inlineMultipleElement[i]).find('select:first');
                let secondSelectElement=$(inlineMultipleElement[i]).find('select:last');
                let inputElement=$(inlineMultipleElement[i]).find('input');

                //if input is not a number between 1 and 12, is invalid
                let currentInputValue = Number(inputElement.val());
                if(!Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > 12){
                    inputElement.addClass("invalid-input");
                }
                else{
                    inputElement.removeClass("invalid-input");
                    // if result is 1-12/1, is equals than *
                    if(inputElement.val().localeCompare("1") == 0 
                    && firstSelectElement.val().localeCompare("1") == 0 
                    && secondSelectElement.val().localeCompare("12") == 0){
                        finalMonthValue = "*";
                    }
                    else{
                        finalMonthValue+=firstSelectElement.val()+"-"+secondSelectElement.val();
                        if(inputElement.val().localeCompare("1") != 0)
                            finalMonthValue += "/"+inputElement.val();
                        finalMonthValue+=",";
                    }
                }
                    
            }
        }

        let monthsDictionary = {
            "enero":1,
            "febrero":2,
            "marzo":3,
            "abril":4,
            "mayo":5,
            "junio":6,
            "julio":7,
            "agosto":8,
            "septiembre":9,
            "octubre":10,
            "noviembre":11,
            "diciembre":12,
        }

        let selectMonthsElement = monthCard.find(".select-months");
        let selectMonthsCheckBox = selectMonthsElement.find("input[type=checkbox]");
        //if month selector checkbox is checked
        if(selectMonthsCheckBox.prop("checked") && finalMonthValue.localeCompare("*")!=0){
            let inputElement=selectMonthsElement.find('input:last');
            inputElement.removeClass("invalid-input");
            let inputElementSplit = inputElement.val().split(',');
            let inputElementValues = [];
            let insertValue = true;
            //for each value between commas
            for (var i = 0; i < inputElementSplit.length && insertValue; ++i){
                let currentSelectValue = Number(inputElementSplit[i]);
                //if is not an integet between 1 and 12
                if(!Number.isInteger(currentSelectValue) || currentSelectValue < 1 || currentSelectValue > 12){
                    //if is a month name
                    if(inputElementSplit[i].toLowerCase() in monthsDictionary){
                        currentSelectValue = monthsDictionary[inputElementSplit[i].toLowerCase()];
                    }else{ 
                        //else, can't parse, if empty, mark as invalid
                        insertValue = false;
                        if(inputElementSplit[i].localeCompare("")!=0)
                            inputElement.addClass("invalid-input");
                    }
                }

                if(insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalMonthValue+=inputElementValues.join(',');
        }else if(finalMonthValue.endsWith(",")){
            finalMonthValue = finalMonthValue.substring(0,finalMonthValue.length-1);
        }

        //if no checkbox is selected
        if(finalMonthValue.localeCompare("") == 0)
            finalMonthValue ="*";

        cronGenerator.value.months = finalMonthValue;
        updateValueElement(cronGenerator);
    }

    /**********************************/
    /**  DOM MODIFICATION FUNCTIONS  **/
    /**********************************/

    function makeSecondsSection(cronGenerator){
        return $(`
            <label>Cada <input type="text" maxlength="2" size="2" value="1" name="seconds-${cronGenerator.uuid}" /> segundo/s</label>
        `);
    }

    //create month range element
    function createRepeatMinutes(cronGenerator){

        let repeatMinutes = $('<div class="inline multiple"></div>');

        repeatMinutes
            .append($(` 
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="minutes-${cronGenerator.uuid}" /> minuto/s
                entre el minuto <input type="text" maxlength="2" size="2" value="0" name="start-minute-${cronGenerator.uuid}" />
                y <input type="text" maxlength="2" size="2" value="59" name="end-minute-${cronGenerator.uuid}" /></label>
            `))
            .append(
                $(`<em class="far fa-2x fa-minus-square"></em>`)
                    .on('click', function(){
                        if($(this).parent().siblings().length == 2){
                            repeatMinutes.find(`input[name="start-minute-${cronGenerator.uuid}"]`).val("0");
                            repeatMinutes.find(`input[name="end-minute-${cronGenerator.uuid}"]`).val("59");
                            repeatMinutes.find(`input[name="minutes-${cronGenerator.uuid}"]`).val("1");
                        }else{
                            $(this).parent().remove();
                        }
                        updateMinuteValue(cronGenerator);
                    })
            );

        return repeatMinutes;
    }

    function makeMinutesSection(cronGenerator){
        //element to select month's range
        let repeatMinutesSubsection = $('<div class="minutes-subsection minutes-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatMinutesSubsection = $('<input type="checkbox">');
        checkBoxRepeatMinutesSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
            updateMinuteValue(cronGenerator);
        });

        let htmlTooltipMessageRange = "<em>Elige un rango de minutos, puedes añadir o eliminar rangos con los botones + y -<em>"
        let heplIconRepeat=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageRange}"></i>`);
        heplIconRepeat.tooltip();
        checkboxRepeatLabel
            .append(checkBoxRepeatMinutesSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconRepeat);

        let repeatMinutes = createRepeatMinutes(cronGenerator);

        let addMinute = $('<div class="add-element"></div>')
            .append($(`<em class="far fa-plus-square fa-2x"></em>`)
                .on('click', function() {
                    let newRepeatMinutes = createRepeatMinutes(cronGenerator);
                    repeatMinutesSubsection.find("div:last").before(newRepeatMinutes);
                    updateMinuteValue(cronGenerator);
                })
            );

        repeatMinutesSubsection
            .append(checkboxRepeatLabel)
            .append(repeatMinutes)
            .append(addMinute);
        
        //element to select many minutes
        let selectMinutes = $('<div class="minutes-subsection select-minutes section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectMinutesSubsection = $('<input type="checkbox">');
        checkBoxSelectMinutesSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
            updateMinuteValue(cronGenerator);
        });

        let htmlTooltipMessageSelection = "<em>Elige una serie de minutos separados por coma<em>";
        let heplIconSelect=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageSelection}"></i>`);
        heplIconSelect.tooltip();
        checkboxSelectLabel
            .find("label")
            .append(checkBoxSelectMinutesSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconSelect);

        selectMinutes
            .append(checkboxSelectLabel)
            .append($(`
                <label>El/Los minuto/s <input type="text" size="20" value="" name="minutes-${cronGenerator.uuid}" />
            `));

        selectMinutes.find('input:last').change(function () {
            updateMinuteValue(cronGenerator);
        });

        //parent element which includes all the selectors
        let minutes = $('<div></div>')
            .append(repeatMinutesSubsection)
            .append(selectMinutes);

        return minutes;
    }

    function makeHoursSection(cronGenerator){
        return $('<div class="minutes-repeat"></div>')
            .append($(`
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="hours-${cronGenerator.uuid}" /> hora/s
                 entre la hora <input type="text" maxlength="2" size="2" value="0" name="start-hour-${cronGenerator.uuid}" />
                 y <input type="text" maxlength="2" size="2" value="23" name="end-hour-${cronGenerator.uuid}" /></label>
            `));
    }

    //create month range element
    function createRepeatMonths(cronGenerator){

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
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
        `;

        let repeatMonths = $('<div class="inline multiple"></div>');

        repeatMonths
            .append($(`
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="months-${cronGenerator.uuid}" /> mes/es
                entre <select size="1" value="Enero" name="start-month-${cronGenerator.uuid}">${monthSelectOptions}</select>
                y <select size="1" value="Diciembre" name="end-month-${cronGenerator.uuid}">${monthSelectOptions}</select>
                </label>
            `))
            .append(
                $(`<em class="far fa-2x fa-minus-square"></em>`)
                    .on('click', function(){createRepeatMo
                        if($(this).parent().siblings().length == 2){
                            repeatMonths.find('select:first').val("1");
                            repeatMonths.find('select:last').val("12");
                            repeatMonths.find('input').val("1");
                        }else{
                            $(this).parent().remove();
                        }
                        updateMonthValue(cronGenerator);
                    })
            );

        repeatMonths.find('select:last').val("12");

        repeatMonths.find('input').change(function () {
            updateMonthValue(cronGenerator);
        });  

        repeatMonths.find('select:first').change(function () {
            updateMonthValue(cronGenerator);
        });  

        repeatMonths.find('select:last').change(function () {
            updateMonthValue(cronGenerator);
        });  

        return repeatMonths;
    }

    function makeMonthsSection(cronGenerator){

        //element to select month's range
        let repeatMonthsSubsection = $('<div class="months-subsection months-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatMonthsSubsection = $('<input type="checkbox">');
        checkBoxRepeatMonthsSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
            updateMonthValue(cronGenerator);
        });

        let htmlTooltipMessageRange = "<em>Elige un rango de meses, puedes añadir o eliminar rangos con los botones + y -<em>"
        let heplIconRepeat=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageRange}"></i>`);
        heplIconRepeat.tooltip();
        checkboxRepeatLabel
            .append(checkBoxRepeatMonthsSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconRepeat);

        let repeatMonths = createRepeatMonths(cronGenerator);

        let addMonth = $('<div class="add-element"></div>')
            .append($(`<em class="far fa-plus-square fa-2x"></em>`)
                .on('click', function() {
                    let newRepeatMonths = createRepeatMonths(cronGenerator);
                    repeatMonthsSubsection.find("div:last").before(newRepeatMonths);
                    updateMonthValue(cronGenerator);
                })
            );

        repeatMonthsSubsection
            .append(checkboxRepeatLabel)
            .append(repeatMonths)
            .append(addMonth);
        
        //element to select many months
        let selectMonths = $('<div class="months-subsection select-months section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectMonthsSubsection = $('<input type="checkbox">');
        checkBoxSelectMonthsSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
            updateMonthValue(cronGenerator);
        });

        let htmlTooltipMessageSelection = "<em>Elige una serie de meses separados por coma, puedes escribir el número o su nombre<em>";
        let heplIconSelect=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageSelection}"></i>`);
        heplIconSelect.tooltip();
        checkboxSelectLabel
            .find("label")
            .append(checkBoxSelectMonthsSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconSelect);

        selectMonths
            .append(checkboxSelectLabel)
            .append($(`<label class='selection-label'>El/Los mes/es <input type="text" size="20" value="" name="months-${cronGenerator.uuid}" />`));

        selectMonths.find('input:last').change(function () {
            updateMonthValue(cronGenerator);
        });

        //parent element which includes all the selectors
        let months = $('<div></div>')
            .append(repeatMonthsSubsection)
            .append(selectMonths);

        return months;
    }

    //create structure of visual generator
    function makeConfigurator(cronGenerator){
        cronGenerator.jqueryElement.data('id', this.uuid);

        cronGenerator.accordion = $('<div class="cron-component accordion" id="accordion-'+cronGenerator.uuid+'" style="width: ' + cronGenerator.allOptions.width + '"></div>');
        
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
        cronGenerator.resultJquery.text(Object.values(cronGenerator.value).join(' '));

        cronGenerator.accordion.append(cronGenerator.resultJquery);
        cronGenerator.jqueryElement.append(cronGenerator.accordion);
    }


    /*********************************/
    /**    CRON OBJECT FUNCTIONS    **/
    /*********************************/

	let defaultOptions = {
        initial : "* * * * * ? *",
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
        width : '100%',
        customValues : undefined,
        onChange: undefined
	};

    function CronGenerator(element, opts = {}) {
        let allOptions = {...defaultOptions, ...opts}

        this.uuid=create_UUID();
        this.element = element;
        this.jqueryElement=$(element);
        this.allOptions=allOptions;
        let splitValue = allOptions.initial.split(' ');
        this.value={};
        this.value.seconds = splitValue[0];
        this.value.minutes = splitValue[1];
        this.value.hours = splitValue[2];
        this.value.days = splitValue[3];
        this.value.months = splitValue[4];
        this.value.daysOfWeek = splitValue[5];
        this.value.years = splitValue[6];
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

        $.each($(this), function(){
            cronGenerators.push(new CronGenerator(this, options));
        });

        return cronGenerators;
    };

})(jQuery);
