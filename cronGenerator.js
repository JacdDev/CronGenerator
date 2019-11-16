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

    function updateSecondValue(cronGenerator){

        let finalSecondValue = "";

        let secondCard = $(document).find(`#collapse-seconds-${cronGenerator.uuid}`);
        let secondsRepeatElement = secondCard.find(".seconds-repeat");
        let secondsRepeatCheckBox = secondsRepeatElement.find("input[type=checkbox]");
        //if range checkbox is checked
        if(secondsRepeatCheckBox.prop("checked")){
            let inlineMultipleElement = secondsRepeatElement.find(".inline.multiple");
            //for each range selector
            for (var i = 0; i < inlineMultipleElement.length && finalSecondValue.localeCompare("*")!=0; ++i){
                let firstSelectElement=$(inlineMultipleElement[i]).find(`input[name="start-second-${cronGenerator.uuid}"]`);
                let secondSelectElement=$(inlineMultipleElement[i]).find(`input[name="end-second-${cronGenerator.uuid}"]`);
                let inputElement=$(inlineMultipleElement[i]).find(`input[name="seconds-${cronGenerator.uuid}"]`);

                //if input is not a number between 1 and 59, is invalid
                let validInput = true;
                let currentInputValue = Number(inputElement.val());
                if(!Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > 59){
                    inputElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    inputElement.removeClass("invalid-input");
                }
                currentInputValue = Number(firstSelectElement.val());
                if(firstSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < 0 || currentInputValue > 59){
                    firstSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    firstSelectElement.removeClass("invalid-input");
                }
                currentInputValue = Number(secondSelectElement.val());
                if(secondSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < 0 || currentInputValue > 59){
                    secondSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    secondSelectElement.removeClass("invalid-input");
                }
                if(validInput){
                    // if result is 0-59/1, is equals than *
                    if(inputElement.val().localeCompare("1") == 0 
                    && firstSelectElement.val().localeCompare("0") == 0 
                    && secondSelectElement.val().localeCompare("59") == 0){
                        finalSecondValue = "*";
                    }
                    else{
                        finalSecondValue+=firstSelectElement.val()+"-"+secondSelectElement.val();
                        if(inputElement.val().localeCompare("1") != 0)
                            finalSecondValue += "/"+inputElement.val();
                        finalSecondValue+=",";
                    }
                }
                    
            }
        }
        
        let selectSecondsElement = secondCard.find(".select-seconds");
        let selectSecondsCheckBox = selectSecondsElement.find("input[type=checkbox]");
        //if second selector checkbox is checked
        if(selectSecondsCheckBox.prop("checked") && finalSecondValue.localeCompare("*")!=0){
            let inputElement=selectSecondsElement.find('input:last');
            inputElement.removeClass("invalid-input");
            let inputElementSplit = inputElement.val().split(',');
            let inputElementValues = [];
            let insertValue = true;
            //for each value between commas
            for (var i = 0; i < inputElementSplit.length && insertValue; ++i){
                let currentSelectValue = Number(inputElementSplit[i]);
                //if is not an integet between 0 and 59
                if(inputElementSplit[i].localeCompare("")==0 || !Number.isInteger(currentSelectValue) || currentSelectValue < 0 || currentSelectValue > 59){
                    //can't parse, mark as invalid
                    insertValue = false;
                    inputElement.addClass("invalid-input");
                }

                if(finalSecondValue.localeCompare("*")!=0 && insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalSecondValue+=inputElementValues.join(',');
        }

        //delete last comma
        if(finalSecondValue.endsWith(","))
        finalSecondValue = finalSecondValue.substring(0,finalSecondValue.length-1);

        //if no checkbox is selected
        if(finalSecondValue.localeCompare("") == 0)
        finalSecondValue ="*";

        cronGenerator.value.seconds = finalSecondValue;
        updateValueElement(cronGenerator);
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

                //if input is not a number between 1 and 59, is invalid
                let validInput = true;
                let currentInputValue = Number(inputElement.val());
                if(!Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > 59){
                    inputElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    inputElement.removeClass("invalid-input");
                }
                currentInputValue = Number(firstSelectElement.val());
                if(firstSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < 0 || currentInputValue > 59){
                    firstSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    firstSelectElement.removeClass("invalid-input");
                }
                currentInputValue = Number(secondSelectElement.val());
                if(secondSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < 0 || currentInputValue > 59){
                    secondSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    secondSelectElement.removeClass("invalid-input");
                }
                if(validInput){
                    // if result is 0-59/1, is equals than *
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
                //if is not an integet between 0 and 59
                if(inputElementSplit[i].localeCompare("")==0 || !Number.isInteger(currentSelectValue) || currentSelectValue < 0 || currentSelectValue > 59){
                    //can't parse, mark as invalid
                    insertValue = false;
                    inputElement.addClass("invalid-input");
                }

                if(finalMinuteValue.localeCompare("*")!=0 && insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalMinuteValue+=inputElementValues.join(',');
        }

        //delete last comma
        if(finalMinuteValue.endsWith(","))
        finalMinuteValue = finalMinuteValue.substring(0,finalMinuteValue.length-1);

        //if no checkbox is selected
        if(finalMinuteValue.localeCompare("") == 0)
        finalMinuteValue ="*";

        cronGenerator.value.minutes = finalMinuteValue;
        updateValueElement(cronGenerator);
    }

    function updateHourValue(cronGenerator){

        let finalHourValue = "";

        let hourCard = $(document).find(`#collapse-hours-${cronGenerator.uuid}`);
        let hoursRepeatElement = hourCard.find(".hours-repeat");
        let hoursRepeatCheckBox = hoursRepeatElement.find("input[type=checkbox]");
        //if range checkbox is checked
        if(hoursRepeatCheckBox.prop("checked")){
            let inlineMultipleElement = hoursRepeatElement.find(".inline.multiple");
            //for each range selector
            for (var i = 0; i < inlineMultipleElement.length && finalHourValue.localeCompare("*")!=0; ++i){
                let firstSelectElement=$(inlineMultipleElement[i]).find(`input[name="start-hour-${cronGenerator.uuid}"]`);
                let secondSelectElement=$(inlineMultipleElement[i]).find(`input[name="end-hour-${cronGenerator.uuid}"]`);
                let inputElement=$(inlineMultipleElement[i]).find(`input[name="hours-${cronGenerator.uuid}"]`);

                //if input is not a number between 1 and 23, is invalid
                let validInput = true;
                let currentInputValue = Number(inputElement.val());
                if(!Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > 23){
                    inputElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    inputElement.removeClass("invalid-input");
                }
                currentInputValue = Number(firstSelectElement.val());
                if(firstSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < 0 || currentInputValue > 23){
                    firstSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    firstSelectElement.removeClass("invalid-input");
                }
                currentInputValue = Number(secondSelectElement.val());
                if(secondSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < 0 || currentInputValue > 23){
                    secondSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    secondSelectElement.removeClass("invalid-input");
                }
                if(validInput){
                    // if result is 0-23/1, is equals than *
                    if(inputElement.val().localeCompare("1") == 0 
                    && firstSelectElement.val().localeCompare("0") == 0 
                    && secondSelectElement.val().localeCompare("23") == 0){
                        finalHourValue = "*";
                    }
                    else{
                        finalHourValue+=firstSelectElement.val()+"-"+secondSelectElement.val();
                        if(inputElement.val().localeCompare("1") != 0)
                            finalHourValue += "/"+inputElement.val();
                        finalHourValue+=",";
                    }
                }
                    
            }
        }
        
        let selectHoursElement = hourCard.find(".select-hours");
        let selectHoursCheckBox = selectHoursElement.find("input[type=checkbox]");
        //if hour selector checkbox is checked
        if(selectHoursCheckBox.prop("checked") && finalHourValue.localeCompare("*")!=0){
            let inputElement=selectHoursElement.find('input:last');
            inputElement.removeClass("invalid-input");
            let inputElementSplit = inputElement.val().split(',');
            let inputElementValues = [];
            let insertValue = true;
            //for each value between commas
            for (var i = 0; i < inputElementSplit.length && insertValue; ++i){
                let currentSelectValue = Number(inputElementSplit[i]);
                //if is not an integet between 0 and 23
                if(inputElementSplit[i].localeCompare("")==0 || !Number.isInteger(currentSelectValue) || currentSelectValue < 0 || currentSelectValue > 23){
                    //can't parse, mark as invalid
                    insertValue = false;
                    inputElement.addClass("invalid-input");
                }

                if(finalHourValue.localeCompare("*")!=0 && insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalHourValue+=inputElementValues.join(',');
        }

        //delete last comma
        if(finalHourValue.endsWith(","))
        finalHourValue = finalHourValue.substring(0,finalHourValue.length-1);

        //if no checkbox is selected
        if(finalHourValue.localeCompare("") == 0)
        finalHourValue ="*";

        cronGenerator.value.hours = finalHourValue;
        updateValueElement(cronGenerator);
    }

    function updateDayValue(cronGenerator){

        let finalDayValue = "";

        let dayCard = $(document).find(`#collapse-days-${cronGenerator.uuid}`);
        let daysRepeatElement = dayCard.find(".days-repeat");
        let daysRepeatCheckBox = daysRepeatElement.find("input[type=checkbox]");
        //if range checkbox is checked
        if(daysRepeatCheckBox.prop("checked")){
            let inlineMultipleElement = daysRepeatElement.find(".inline.multiple");
            //for each range selector
            for (var i = 0; i < inlineMultipleElement.length && finalDayValue.localeCompare("*")!=0; ++i){
                let firstSelectElement=$(inlineMultipleElement[i]).find(`input[name="start-day-${cronGenerator.uuid}"]`);
                let secondSelectElement=$(inlineMultipleElement[i]).find(`input[name="end-day-${cronGenerator.uuid}"]`);
                let inputElement=$(inlineMultipleElement[i]).find(`input[name="days-${cronGenerator.uuid}"]`);

                //if input is not a number between 1 and 31, is invalid
                let validInput = true;
                let currentInputValue = Number(inputElement.val());
                if(!Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > 31){
                    inputElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    inputElement.removeClass("invalid-input");
                }
                currentInputValue = Number(firstSelectElement.val());
                if(firstSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > 31){
                    firstSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    firstSelectElement.removeClass("invalid-input");
                }
                currentInputValue = Number(secondSelectElement.val());
                if(secondSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > 31){
                    secondSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    secondSelectElement.removeClass("invalid-input");
                }
                if(validInput){
                    // if result is 0-23/1, is equals than *
                    if(inputElement.val().localeCompare("1") == 0 
                    && firstSelectElement.val().localeCompare("1") == 0 
                    && secondSelectElement.val().localeCompare("31") == 0){
                        finalDayValue = "*";
                    }
                    else{
                        finalDayValue+=firstSelectElement.val()+"-"+secondSelectElement.val();
                        if(inputElement.val().localeCompare("1") != 0)
                            finalDayValue += "/"+inputElement.val();
                        finalDayValue+=",";
                    }
                }
                    
            }
        }
        
        let selectDaysElement = dayCard.find(".select-days");
        let selectDaysCheckBox = selectDaysElement.find("input[type=checkbox]");
        //if day selector checkbox is checked
        if(selectDaysCheckBox.prop("checked") && finalDayValue.localeCompare("*")!=0){
            let inputElement=selectDaysElement.find('input:last');
            inputElement.removeClass("invalid-input");
            let inputElementSplit = inputElement.val().split(',');
            let inputElementValues = [];
            let insertValue = true;
            //for each value between commas
            for (var i = 0; i < inputElementSplit.length && insertValue; ++i){
                let currentSelectValue = Number(inputElementSplit[i]);
                //if is not an integet between 1 and 31
                if(inputElementSplit[i].localeCompare("")==0 || !Number.isInteger(currentSelectValue) || currentSelectValue < 1 || currentSelectValue > 31){
                    //can't parse, mark as invalid
                    insertValue = false;
                    inputElement.addClass("invalid-input");
                }

                if(finalDayValue.localeCompare("*")!=0 && insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalDayValue+=inputElementValues.join(',');
        }

        //delete last comma
        if(finalDayValue.endsWith(","))
        finalDayValue = finalDayValue.substring(0,finalDayValue.length-1);

        //if no checkbox is selected
        if(finalDayValue.localeCompare("") == 0)
        finalDayValue ="*";

        cronGenerator.value.days = finalDayValue;

        //reset day of week
        cronGenerator.value.daysOfWeek = "?";
        var daysOfWeekCheckbox = $(document).find(`#collapse-dayOfWeeks-${cronGenerator.uuid} input[type=checkbox]`)
        daysOfWeekCheckbox.prop("checked",false);
        var daysOfWeekSection =$(".dayOfWeeks-subsection")
        daysOfWeekSection.attr("data-selected",false);

        updateValueElement(cronGenerator);
    }

    function updateDayOfWeekValue(cronGenerator){

        let finalDayOfWeekValue = "";

        let dayOfWeekCard = $(document).find(`#collapse-dayOfWeeks-${cronGenerator.uuid}`);
        let dayOfWeeksRepeatElement = dayOfWeekCard.find(".dayOfWeeks-repeat");
        let dayOfWeeksRepeatCheckBox = dayOfWeeksRepeatElement.find("input[type=checkbox]");
        //if range checkbox is checked
        if(dayOfWeeksRepeatCheckBox.prop("checked")){
            let inlineMultipleElement = dayOfWeeksRepeatElement.find(".inline.multiple");
            //for each range selector
            for (var i = 0; i < inlineMultipleElement.length && finalDayOfWeekValue.localeCompare("*")!=0; ++i){
                let firstSelectElement=$(inlineMultipleElement[i]).find('select:first');
                let secondSelectElement=$(inlineMultipleElement[i]).find('select:last');
                let inputElement=$(inlineMultipleElement[i]).find('input');

                //if input is not a number between 1 and 12, is invalid
                let currentInputValue = Number(inputElement.val());
                if(!Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > 7){
                    inputElement.addClass("invalid-input");
                }
                else{
                    inputElement.removeClass("invalid-input");
                    // if result is 1-7/1, is equals than *
                    if(inputElement.val().localeCompare("1") == 0 
                    && firstSelectElement.val().localeCompare("1") == 0 
                    && secondSelectElement.val().localeCompare("7") == 0){
                        finalDayOfWeekValue = "*";
                    }
                    else{
                        finalDayOfWeekValue+=firstSelectElement.val()+"-"+secondSelectElement.val();
                        if(inputElement.val().localeCompare("1") != 0)
                            finalDayOfWeekValue += "/"+inputElement.val();
                        finalDayOfWeekValue+=",";
                    }
                }
                    
            }
        }

        let dayOfWeeksDictionary = {
            "domingo":1,
            "lunes":2,
            "martes":3,
            "miércoles":4,
            "jueves":5,
            "viernes":6,
            "sábado":7,
        }

        let selectDayOfWeeksElement = dayOfWeekCard.find(".select-dayOfWeeks");
        let selectDayOfWeeksCheckBox = selectDayOfWeeksElement.find("input[type=checkbox]");
        //if dayOfWeek selector checkbox is checked
        if(selectDayOfWeeksCheckBox.prop("checked")){
            let inputElement=selectDayOfWeeksElement.find('input:last');
            inputElement.removeClass("invalid-input");
            let inputElementSplit = inputElement.val().split(',');
            let inputElementValues = [];
            let insertValue = true;
            //for each value between commas
            for (var i = 0; i < inputElementSplit.length && insertValue; ++i){
                let currentSelectValue = Number(inputElementSplit[i]);
                //if is not an integet between 1 and 7
                if(!Number.isInteger(currentSelectValue) || currentSelectValue < 1 || currentSelectValue > 7){
                    //if is a dayOfWeek name
                    if(inputElementSplit[i].toLowerCase() in dayOfWeeksDictionary){
                        currentSelectValue = dayOfWeeksDictionary[inputElementSplit[i].toLowerCase()];
                    }else{ 
                        //else, can't parse, mark as invalid
                        insertValue = false;
                        inputElement.addClass("invalid-input");
                    }
                }

                if(finalDayOfWeekValue.localeCompare("*")!=0 && insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalDayOfWeekValue+=inputElementValues.join(',');
        }

        //delete last comma
        if(finalDayOfWeekValue.endsWith(","))
            finalDayOfWeekValue = finalDayOfWeekValue.substring(0,finalDayOfWeekValue.length-1);

        //if no checkbox is selected
        if(finalDayOfWeekValue.localeCompare("") == 0)
            finalDayOfWeekValue ="*";

        cronGenerator.value.daysOfWeek = finalDayOfWeekValue;
         //reset day 
         cronGenerator.value.days = "?";
         var daysCheckbox = $(document).find(`#collapse-days-${cronGenerator.uuid} input[type=checkbox]`)
         daysCheckbox.prop("checked",false);
         var daysSection =$(".days-subsection")
         daysSection.attr("data-selected",false);

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
        if(selectMonthsCheckBox.prop("checked")){
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
                        //else, can't parse, mark as invalid
                        insertValue = false;
                        inputElement.addClass("invalid-input");
                    }
                }

                if(finalMonthValue.localeCompare("*")!=0 && insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalMonthValue+=inputElementValues.join(',');
        }

        //delete last comma
        if(finalMonthValue.endsWith(","))
            finalMonthValue = finalMonthValue.substring(0,finalMonthValue.length-1);

        //if no checkbox is selected
        if(finalMonthValue.localeCompare("") == 0)
            finalMonthValue ="*";

        cronGenerator.value.months = finalMonthValue;
        updateValueElement(cronGenerator);
    }

    function updateYearValue(cronGenerator){

        let finalYearValue = "";

        let yearCard = $(document).find(`#collapse-years-${cronGenerator.uuid}`);
        let yearsRepeatElement = yearCard.find(".years-repeat");
        let yearsRepeatCheckBox = yearsRepeatElement.find("input[type=checkbox]");
        //if range checkbox is checked
        if(yearsRepeatCheckBox.prop("checked")){
            let inlineMultipleElement = yearsRepeatElement.find(".inline.multiple");
            //for each range selector
            for (var i = 0; i < inlineMultipleElement.length && finalYearValue.localeCompare("*")!=0; ++i){
                let firstSelectElement=$(inlineMultipleElement[i]).find(`input[name="start-year-${cronGenerator.uuid}"]`);
                let secondSelectElement=$(inlineMultipleElement[i]).find(`input[name="end-year-${cronGenerator.uuid}"]`);
                let inputElement=$(inlineMultipleElement[i]).find(`input[name="years-${cronGenerator.uuid}"]`);

                //if input is not a number between this year and 100 years ahead, is invalid
                let validInput = true;
                let currentInputValue = Number(inputElement.val());
                if(!Number.isInteger(currentInputValue) || currentInputValue < 1 || currentInputValue > (new Date().getFullYear()+100)){
                    inputElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    inputElement.removeClass("invalid-input");
                }
                currentInputValue = Number(firstSelectElement.val());
                if(firstSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < new Date().getFullYear() || currentInputValue > (new Date().getFullYear()+100)){
                    firstSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    firstSelectElement.removeClass("invalid-input");
                }
                currentInputValue = Number(secondSelectElement.val());
                if(secondSelectElement.val().localeCompare("") == 0 || !Number.isInteger(currentInputValue) || currentInputValue < new Date().getFullYear() || currentInputValue > (new Date().getFullYear()+100)){
                    secondSelectElement.addClass("invalid-input");
                    validInput = false;
                }else{
                    secondSelectElement.removeClass("invalid-input");
                }
                if(validInput){
                    // if result is 100 years ahead-this year/1, is equals than *
                    if(inputElement.val().localeCompare("1") == 0 
                    && firstSelectElement.val().localeCompare(new Date().getFullYear().toString()) == 0 
                    && secondSelectElement.val().localeCompare((new Date().getFullYear()+100).toString()) == 0){
                        finalYearValue = "*";
                    }
                    else{
                        finalYearValue+=firstSelectElement.val()+"-"+secondSelectElement.val();
                        if(inputElement.val().localeCompare("1") != 0)
                            finalYearValue += "/"+inputElement.val();
                        finalYearValue+=",";
                    }
                }
                    
            }
        }
        
        let selectYearsElement = yearCard.find(".select-years");
        let selectYearsCheckBox = selectYearsElement.find("input[type=checkbox]");
        //if year selector checkbox is checked
        if(selectYearsCheckBox.prop("checked") && finalYearValue.localeCompare("*")!=0){
            let inputElement=selectYearsElement.find('input:last');
            inputElement.removeClass("invalid-input");
            let inputElementSplit = inputElement.val().split(',');
            let inputElementValues = [];
            let insertValue = true;
            //for each value between commas
            for (var i = 0; i < inputElementSplit.length && insertValue; ++i){
                let currentSelectValue = Number(inputElementSplit[i]);
                //if is not an integet between 0 and 23
                if(inputElementSplit[i].localeCompare("")==0 || !Number.isInteger(currentSelectValue) || currentSelectValue < new Date().getFullYear() || currentSelectValue > (new Date().getFullYear()+100)){
                    //can't parse, mark as invalid
                    insertValue = false;
                    inputElement.addClass("invalid-input");
                }

                if(finalYearValue.localeCompare("*")!=0 && insertValue && !inputElementValues.includes(currentSelectValue)){
                    inputElementValues.push(currentSelectValue);
                }
            }
            finalYearValue+=inputElementValues.join(',');
        }

        //delete last comma
        if(finalYearValue.endsWith(","))
        finalYearValue = finalYearValue.substring(0,finalYearValue.length-1);

        //if no checkbox is selected
        if(finalYearValue.localeCompare("") == 0)
        finalYearValue ="*";

        cronGenerator.value.years = finalYearValue;
        updateValueElement(cronGenerator);
    }

    /**********************************/
    /**  DOM MODIFICATION FUNCTIONS  **/
    /**********************************/

    //seconds section
    function createRepeatSeconds(cronGenerator){

        let repeatSeconds = $('<div class="inline multiple"></div>');

        repeatSeconds
            .append($(` 
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="seconds-${cronGenerator.uuid}" /> segundo/s
                entre el segundo <input type="text" maxlength="2" size="2" value="0" name="start-second-${cronGenerator.uuid}" />
                y <input type="text" maxlength="2" size="2" value="59" name="end-second-${cronGenerator.uuid}" /></label>
            `))
            .append(
                $(`<em class="far fa-2x fa-minus-square"></em>`)
                    .on('click', function(event){
                        defineSecondsEventProcess(cronGenerator,event);
                        if($(this).parent().siblings().length == 2){
                            repeatSeconds.find(`input[name="start-second-${cronGenerator.uuid}"]`).val("0");
                            repeatSeconds.find(`input[name="end-second-${cronGenerator.uuid}"]`).val("59");
                            repeatSeconds.find(`input[name="seconds-${cronGenerator.uuid}"]`).val("1");
                        }else{
                            $(this).parent().remove();
                        }
                        updateSecondValue(cronGenerator);
                    })
            );

        defineSecondsEvents(cronGenerator,repeatSeconds);

        return repeatSeconds;
    }

    function makeSecondsSection(cronGenerator){
        //element to select second's range
        let repeatSecondsSubsection = $('<div class="seconds-subsection seconds-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatSecondsSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxRepeatSecondsSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageRange = "<em>Elige un rango de segundos, puedes añadir o eliminar rangos con los botones + y -<em>"
        let heplIconRepeat=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageRange}"></i>`);
        heplIconRepeat.tooltip();
        checkboxRepeatLabel
            .append(checkBoxRepeatSecondsSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconRepeat);

        let repeatSeconds = createRepeatSeconds(cronGenerator);

        let addSecond = $('<div class="add-element"></div>')
            .append($(`<em class="far fa-plus-square fa-2x recalc-class"></em>`)
                .on('click', function() {
                    let newRepeatSeconds = createRepeatSeconds(cronGenerator);
                    repeatSecondsSubsection.find("div:last").before(newRepeatSeconds);
                })
            );

        repeatSecondsSubsection
            .append(checkboxRepeatLabel)
            .append(repeatSeconds)
            .append(addSecond);
        
        //element to select many seconds
        let selectSeconds = $('<div class="seconds-subsection select-seconds section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectSecondsSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxSelectSecondsSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageSelection = "<em>Elige una serie de segundos separados por coma, puedes escribir el número<em>";
        let heplIconSelect=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageSelection}"></i>`);
        heplIconSelect.tooltip();
        checkboxSelectLabel
            .find("label")
            .append(checkBoxSelectSecondsSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconSelect);

        selectSeconds
            .append(checkboxSelectLabel)
            .append($(`<label class='selection-label'>El/Los segundo/s <input type="text" size="20" value="" name="seconds-${cronGenerator.uuid}" />`));


        //parent element which includes all the selectors
        let seconds = $('<div></div>')
            .append(repeatSecondsSubsection)
            .append(selectSeconds);

        defineSecondsEvents(cronGenerator,seconds);

        return seconds;
    }

    function defineSecondsEvents(cronGenerator,section) {
        section.find('input[type="checkbox"],input[type="text"],select,.recalc-class').on("change keyup click",function(event){
            defineSecondsEventProcess(cronGenerator,event)
        });
    }

    function defineSecondsEventProcess(cronGenerator,event) {
        let target = $(event.target);
        let checkbox = target.parents('.section-selected').find('.checkbox-select-section');
        if(!target.hasClass('checkbox-select-section') && !checkbox.prop('checked')) checkbox.click();
        updateSecondValue(cronGenerator);
    }

    //minutes section
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
                    .on('click', function(event){
                        defineMinutesEventProcess(cronGenerator,event);
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

        defineMinutesEvents(cronGenerator,repeatMinutes);

        return repeatMinutes;
    }

    function makeMinutesSection(cronGenerator){
        //element to select minute's range
        let repeatMinutesSubsection = $('<div class="minutes-subsection minutes-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatMinutesSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxRepeatMinutesSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
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
            .append($(`<em class="far fa-plus-square fa-2x recalc-class"></em>`)
                .on('click', function() {
                    let newRepeatMinutes = createRepeatMinutes(cronGenerator);
                    repeatMinutesSubsection.find("div:last").before(newRepeatMinutes);
                })
            );

        repeatMinutesSubsection
            .append(checkboxRepeatLabel)
            .append(repeatMinutes)
            .append(addMinute);
        
        //element to select many minutes
        let selectMinutes = $('<div class="minutes-subsection select-minutes section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectMinutesSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxSelectMinutesSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageSelection = "<em>Elige una serie de minutos separados por coma, puedes escribir el número<em>";
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
            .append($(`<label class='selection-label'>El/Los minuto/s <input type="text" size="20" value="" name="minutes-${cronGenerator.uuid}" />`));


        //parent element which includes all the selectors
        let minutes = $('<div></div>')
            .append(repeatMinutesSubsection)
            .append(selectMinutes);

        defineMinutesEvents(cronGenerator,minutes);

        return minutes;
    }

    function defineMinutesEvents(cronGenerator,section) {
        section.find('input[type="checkbox"],input[type="text"],select,.recalc-class').on("change keyup click",function(event){
            defineMinutesEventProcess(cronGenerator,event)
        });
    }

    function defineMinutesEventProcess(cronGenerator,event) {
        let target = $(event.target);
        let checkbox = target.parents('.section-selected').find('.checkbox-select-section');
        if(!target.hasClass('checkbox-select-section') && !checkbox.prop('checked')) checkbox.click();
        updateMinuteValue(cronGenerator);
    }

    //hours section
    function createRepeatHours(cronGenerator){

        let repeatHours = $('<div class="inline multiple"></div>');

        repeatHours
            .append($(` 
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="hours-${cronGenerator.uuid}" /> hora/s
                entre la hora <input type="text" maxlength="2" size="2" value="0" name="start-hour-${cronGenerator.uuid}" />
                y <input type="text" maxlength="2" size="2" value="23" name="end-hour-${cronGenerator.uuid}" /></label>
            `))
            .append(
                $(`<em class="far fa-2x fa-minus-square"></em>`)
                    .on('click', function(event){
                        defineHoursEventProcess(cronGenerator,event);
                        if($(this).parent().siblings().length == 2){
                            repeatHours.find(`input[name="start-hour-${cronGenerator.uuid}"]`).val("0");
                            repeatHours.find(`input[name="end-hour-${cronGenerator.uuid}"]`).val("23");
                            repeatHours.find(`input[name="hours-${cronGenerator.uuid}"]`).val("1");
                        }else{
                            $(this).parent().remove();
                        }
                        updateHourValue(cronGenerator);
                    })
            );

        defineHoursEvents(cronGenerator,repeatHours);

        return repeatHours;
    }

    function makeHoursSection(cronGenerator){
        //element to select hour's range
        let repeatHoursSubsection = $('<div class="hours-subsection hours-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatHoursSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxRepeatHoursSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageRange = "<em>Elige un rango de horas, puedes añadir o eliminar rangos con los botones + y -<em>"
        let heplIconRepeat=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageRange}"></i>`);
        heplIconRepeat.tooltip();
        checkboxRepeatLabel
            .append(checkBoxRepeatHoursSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconRepeat);

        let repeatHours = createRepeatHours(cronGenerator);

        let addHour = $('<div class="add-element"></div>')
            .append($(`<em class="far fa-plus-square fa-2x recalc-class"></em>`)
                .on('click', function() {
                    let newRepeatHours = createRepeatHours(cronGenerator);
                    repeatHoursSubsection.find("div:last").before(newRepeatHours);
                })
            );

        repeatHoursSubsection
            .append(checkboxRepeatLabel)
            .append(repeatHours)
            .append(addHour);
        
        //element to select many hours
        let selectHours = $('<div class="hours-subsection select-hours section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectHoursSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxSelectHoursSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageSelection = "<em>Elige una serie de horas separados por coma, puedes escribir el número<em>";
        let heplIconSelect=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageSelection}"></i>`);
        heplIconSelect.tooltip();
        checkboxSelectLabel
            .find("label")
            .append(checkBoxSelectHoursSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconSelect);

        selectHours
            .append(checkboxSelectLabel)
            .append($(`<label class='selection-label'>La/s hora/s <input type="text" size="20" value="" name="hours-${cronGenerator.uuid}" />`));


        //parent element which includes all the selectors
        let hours = $('<div></div>')
            .append(repeatHoursSubsection)
            .append(selectHours);

        defineHoursEvents(cronGenerator,hours);

        return hours;
    }

    function defineHoursEvents(cronGenerator,section) {
        section.find('input[type="checkbox"],input[type="text"],select,.recalc-class').on("change keyup click",function(event){
            defineHoursEventProcess(cronGenerator,event)
        });
    }

    function defineHoursEventProcess(cronGenerator,event) {
        let target = $(event.target);
        let checkbox = target.parents('.section-selected').find('.checkbox-select-section');
        if(!target.hasClass('checkbox-select-section') && !checkbox.prop('checked')) checkbox.click();
        updateHourValue(cronGenerator);
    }

    //days section
    function createRepeatDays(cronGenerator){

        let repeatDays = $('<div class="inline multiple"></div>');

        repeatDays
            .append($(` 
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="days-${cronGenerator.uuid}" /> día/s
                entre el día <input type="text" maxlength="2" size="2" value="1" name="start-day-${cronGenerator.uuid}" />
                y <input type="text" maxlength="2" size="2" value="31" name="end-day-${cronGenerator.uuid}" /></label>
            `))
            .append(
                $(`<em class="far fa-2x fa-minus-square"></em>`)
                    .on('click', function(event){
                        defineDaysEventProcess(cronGenerator,event);
                        if($(this).parent().siblings().length == 2){
                            repeatDays.find(`input[name="start-day-${cronGenerator.uuid}"]`).val("1");
                            repeatDays.find(`input[name="end-day-${cronGenerator.uuid}"]`).val("31");
                            repeatDays.find(`input[name="days-${cronGenerator.uuid}"]`).val("1");
                        }else{
                            $(this).parent().remove();
                        }
                        updateDayValue(cronGenerator);
                    })
            );

        defineDaysEvents(cronGenerator,repeatDays);

        return repeatDays;
    }

    function makeDaysSection(cronGenerator){
        //element to select day's range
        let repeatDaysSubsection = $('<div class="days-subsection days-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatDaysSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxRepeatDaysSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageRange = "<em>Elige un rango de días, puedes añadir o eliminar rangos con los botones + y -<em>"
        let heplIconRepeat=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageRange}"></i>`);
        heplIconRepeat.tooltip();
        checkboxRepeatLabel
            .append(checkBoxRepeatDaysSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconRepeat);

        let repeatDays = createRepeatDays(cronGenerator);

        let addDay = $('<div class="add-element"></div>')
            .append($(`<em class="far fa-plus-square fa-2x recalc-class"></em>`)
                .on('click', function() {
                    let newRepeatDays = createRepeatDays(cronGenerator);
                    repeatDaysSubsection.find("div:last").before(newRepeatDays);
                })
            );

        repeatDaysSubsection
            .append(checkboxRepeatLabel)
            .append(repeatDays)
            .append(addDay);
        
        //element to select many days
        let selectDays = $('<div class="days-subsection select-days section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectDaysSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxSelectDaysSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageSelection = "<em>Elige una serie de días separados por coma, puedes escribir el número<em>";
        let heplIconSelect=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageSelection}"></i>`);
        heplIconSelect.tooltip();
        checkboxSelectLabel
            .find("label")
            .append(checkBoxSelectDaysSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconSelect);

        selectDays
            .append(checkboxSelectLabel)
            .append($(`<label class='selection-label'>El/Los día/s <input type="text" size="20" value="" name="days-${cronGenerator.uuid}" />`));


        //parent element which includes all the selectors
        let days = $('<div></div>')
            .append(repeatDaysSubsection)
            .append(selectDays);

        defineDaysEvents(cronGenerator,days);

        return days;
    }

    function defineDaysEvents(cronGenerator,section) {
        section.find('input[type="checkbox"],input[type="text"],select,.recalc-class').on("change keyup click",function(event){
            defineDaysEventProcess(cronGenerator,event)
        });
    }

    function defineDaysEventProcess(cronGenerator,event) {
        let target = $(event.target);
        let checkbox = target.parents('.section-selected').find('.checkbox-select-section');
        if(!target.hasClass('checkbox-select-section') && !checkbox.prop('checked')) checkbox.click();
        updateDayValue(cronGenerator);
    }

    //days of week section
    function createRepeatDayOfWeeks(cronGenerator){

        //dayOfWeek select options
        let dayOfWeekSelectOptions = `
            <option value="1">Domingo</option>
            <option value="2">Lunes</option>
            <option value="3">Martes</option>
            <option value="4">Miércoles</option>
            <option value="5">Jueves</option>
            <option value="6">Viernes</option>
            <option value="7">Sábado</option>
        `;

        let repeatDayOfWeeks = $('<div class="inline multiple"></div>');

        repeatDayOfWeeks
            .append($(`
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="dayOfWeeks-${cronGenerator.uuid}" /> día/s
                entre <select size="1" value="Domingo" name="start-dayOfWeek-${cronGenerator.uuid}">${dayOfWeekSelectOptions}</select>
                y <select size="1" value="Sábado" name="end-dayOfWeek-${cronGenerator.uuid}">${dayOfWeekSelectOptions}</select>
                </label>
            `))
            .append(
                $(`<em class="far fa-2x fa-minus-square recalc-class"></em>`)
                    .on('click', function(event){
                        defineDayOfWeeksEventProcess(cronGenerator,event);
                        if($(this).parent().siblings().length == 2){
                            repeatDayOfWeeks.find('select:first').val("1");
                            repeatDayOfWeeks.find('select:last').val("7");
                            repeatDayOfWeeks.find('input').val("1");
                        }else{
                            $(this).parent().remove();
                        }
                    })
            );

        repeatDayOfWeeks.find('select:last').val("7"); 

        defineDayOfWeekEvents(cronGenerator,repeatDayOfWeeks);

        return repeatDayOfWeeks;
    }

    function makeDayOfWeeksSection(cronGenerator){
        //element to select dayOfWeek's range
        let repeatDayOfWeeksSubsection = $('<div class="dayOfWeeks-subsection dayOfWeeks-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatDayOfWeeksSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxRepeatDayOfWeeksSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageRange = "<em>Elige un rango de días, puedes añadir o eliminar rangos con los botones + y -<em>"
        let heplIconRepeat=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageRange}"></i>`);
        heplIconRepeat.tooltip();
        checkboxRepeatLabel
            .append(checkBoxRepeatDayOfWeeksSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconRepeat);

        let repeatDayOfWeeks = createRepeatDayOfWeeks(cronGenerator);

        let addDayOfWeek = $('<div class="add-element"></div>')
            .append($(`<em class="far fa-plus-square fa-2x recalc-class"></em>`)
                .on('click', function() {
                    let newRepeatDayOfWeeks = createRepeatDayOfWeeks(cronGenerator);
                    repeatDayOfWeeksSubsection.find("div:last").before(newRepeatDayOfWeeks);
                })
            );

        repeatDayOfWeeksSubsection
            .append(checkboxRepeatLabel)
            .append(repeatDayOfWeeks)
            .append(addDayOfWeek);
        
        //element to select many dayOfWeeks
        let selectDayOfWeeks = $('<div class="dayOfWeeks-subsection select-dayOfWeeks section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectDayOfWeeksSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxSelectDayOfWeeksSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageSelection = "<em>Elige una serie de días separados por coma, puedes escribir el número o su nombre<em>";
        let heplIconSelect=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageSelection}"></i>`);
        heplIconSelect.tooltip();
        checkboxSelectLabel
            .find("label")
            .append(checkBoxSelectDayOfWeeksSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconSelect);

        selectDayOfWeeks
            .append(checkboxSelectLabel)
            .append($(`<label class='selection-label'>El/Los día/s <input type="text" size="20" value="" name="dayOfWeeks-${cronGenerator.uuid}" />`));


        //parent element which includes all the selectors
        let dayOfWeeks = $('<div></div>')
            .append(repeatDayOfWeeksSubsection)
            .append(selectDayOfWeeks);

        defineDayOfWeekEvents(cronGenerator,dayOfWeeks);

        return dayOfWeeks;
    }

    function defineDayOfWeekEvents(cronGenerator,section) {
        section.find('input[type="checkbox"],input[type="text"],select,.recalc-class').on("change keyup click",function(event){
            defineDayOfWeeksEventProcess(cronGenerator,event)
        });
    }

    function defineDayOfWeeksEventProcess(cronGenerator,event) {
        let target = $(event.target);
        let checkbox = target.parents('.section-selected').find('.checkbox-select-section');
        if(!target.hasClass('checkbox-select-section') && !checkbox.prop('checked')) checkbox.click();
        updateDayOfWeekValue(cronGenerator);
    }

    //months section
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
                $(`<em class="far fa-2x fa-minus-square recalc-class"></em>`)
                    .on('click', function(event){
                        defineMonthsEventProcess(cronGenerator,event);
                        if($(this).parent().siblings().length == 2){
                            repeatMonths.find('select:first').val("1");
                            repeatMonths.find('select:last').val("12");
                            repeatMonths.find('input').val("1");
                        }else{
                            $(this).parent().remove();
                        }
                    })
            );

        repeatMonths.find('select:last').val("12"); 

        defineMonthEvents(cronGenerator,repeatMonths);

        return repeatMonths;
    }

    function makeMonthsSection(cronGenerator){
        //element to select month's range
        let repeatMonthsSubsection = $('<div class="months-subsection months-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatMonthsSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxRepeatMonthsSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
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
            .append($(`<em class="far fa-plus-square fa-2x recalc-class"></em>`)
                .on('click', function() {
                    let newRepeatMonths = createRepeatMonths(cronGenerator);
                    repeatMonthsSubsection.find("div:last").before(newRepeatMonths);
                })
            );

        repeatMonthsSubsection
            .append(checkboxRepeatLabel)
            .append(repeatMonths)
            .append(addMonth);
        
        //element to select many months
        let selectMonths = $('<div class="months-subsection select-months section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectMonthsSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxSelectMonthsSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
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


        //parent element which includes all the selectors
        let months = $('<div></div>')
            .append(repeatMonthsSubsection)
            .append(selectMonths);

        defineMonthEvents(cronGenerator,months);

        return months;
    }

    function defineMonthEvents(cronGenerator,section) {
        section.find('input[type="checkbox"],input[type="text"],select,.recalc-class').on("change keyup click",function(event){
            defineMonthsEventProcess(cronGenerator,event)
        });
    }

    function defineMonthsEventProcess(cronGenerator,event) {
        let target = $(event.target);
        let checkbox = target.parents('.section-selected').find('.checkbox-select-section');
        if(!target.hasClass('checkbox-select-section') && !checkbox.prop('checked')) checkbox.click();
        updateMonthValue(cronGenerator);
    }

    //years section
    function createRepeatYears(cronGenerator){

        let repeatYears = $('<div class="inline multiple"></div>');

        repeatYears
            .append($(` 
                <label>Cada <input type="text" maxlength="2" size="2" value="1" name="years-${cronGenerator.uuid}" /> año/s
                entre el año <input type="text" maxlength="4" size="2" value="${new Date().getFullYear()}" name="start-year-${cronGenerator.uuid}" />
                y <input type="text" maxlength="4" size="2" value="${new Date().getFullYear()+100}" name="end-year-${cronGenerator.uuid}" /></label>
            `))
            .append(
                $(`<em class="far fa-2x fa-minus-square"></em>`)
                    .on('click', function(event){
                        defineYearsEventProcess(cronGenerator,event);
                        if($(this).parent().siblings().length == 2){
                            repeatYears.find(`input[name="start-year-${cronGenerator.uuid}"]`).val(new Date().getFullYear().toString());
                            repeatYears.find(`input[name="end-year-${cronGenerator.uuid}"]`).val((new Date().getFullYear()+100).toString());
                            repeatYears.find(`input[name="years-${cronGenerator.uuid}"]`).val("1");
                        }else{
                            $(this).parent().remove();
                        }
                        updateYearValue(cronGenerator);
                    })
            );

        defineYearsEvents(cronGenerator,repeatYears);

        return repeatYears;
    }

    function makeYearsSection(cronGenerator){
        //element to select year's range
        let repeatYearsSubsection = $('<div class="years-subsection years-repeat section-selected" data-selected="false"></div>');

        let checkboxRepeatLabel = $(`<label class="checkbox-label inline"></label>`);
        let checkBoxRepeatYearsSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxRepeatYearsSubsection.on("click",function(event){
            if($(event.target).parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageRange = "<em>Elige un rango de años, puedes añadir o eliminar rangos con los botones + y -<em>"
        let heplIconRepeat=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageRange}"></i>`);
        heplIconRepeat.tooltip();
        checkboxRepeatLabel
            .append(checkBoxRepeatYearsSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconRepeat);

        let repeatYears = createRepeatYears(cronGenerator);

        let addYear = $('<div class="add-element"></div>')
            .append($(`<em class="far fa-plus-square fa-2x recalc-class"></em>`)
                .on('click', function() {
                    let newRepeatYears = createRepeatYears(cronGenerator);
                    repeatYearsSubsection.find("div:last").before(newRepeatYears);
                })
            );

        repeatYearsSubsection
            .append(checkboxRepeatLabel)
            .append(repeatYears)
            .append(addYear);
        
        //element to select many years
        let selectYears = $('<div class="years-subsection select-years section-selected" data-selected="false"></div>');

        let checkboxSelectLabel = $(`<div><label class="checkbox-label inline"></label></div>`);
        let checkBoxSelectYearsSubsection = $('<input type="checkbox" class="checkbox-select-section">');
        checkBoxSelectYearsSubsection.on("click",function(event){
            if($(event.target).parent().parent().parent().attr("data-selected").localeCompare("true")==0)
                $(event.target).parent().parent().parent().attr("data-selected","false");
            else
                $(event.target).parent().parent().parent().attr("data-selected","true");
        });

        let htmlTooltipMessageSelection = "<em>Elige una serie de años separados por coma, puedes escribir el número<em>";
        let heplIconSelect=$(`<i class="help-icon fas fa-info-circle" data-html="true" title="${htmlTooltipMessageSelection}"></i>`);
        heplIconSelect.tooltip();
        checkboxSelectLabel
            .find("label")
            .append(checkBoxSelectYearsSubsection)
            .append(`<span class="checkbox-custom"></span>`)
            .append(`<em class="checkbox-message">Seleccionar</em>`)
            .append(heplIconSelect);

        selectYears
            .append(checkboxSelectLabel)
            .append($(`<label class='selection-label'>El/Los años/s <input type="text" size="20" value="" name="years-${cronGenerator.uuid}" />`));


        //parent element which includes all the selectors
        let years = $('<div></div>')
            .append(repeatYearsSubsection)
            .append(selectYears);

        defineYearsEvents(cronGenerator,years);

        return years;
    }

    function defineYearsEvents(cronGenerator,section) {
        section.find('input[type="checkbox"],input[type="text"],select,.recalc-class').on("change keyup click",function(event){
            defineYearsEventProcess(cronGenerator,event)
        });
    }

    function defineYearsEventProcess(cronGenerator,event) {
        let target = $(event.target);
        let checkbox = target.parents('.section-selected').find('.checkbox-select-section');
        if(!target.hasClass('checkbox-select-section') && !checkbox.prop('checked')) checkbox.click();
        updateYearValue(cronGenerator);
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
            card.body.html(makeDaysSection(cronGenerator))
        }

        // Days of Week
        if (cronGenerator.allOptions.daysOfWeek.allowConfigure){
            let card = newAccordionCard(cronGenerator, 'dayOfWeeks');
            card.header.text('DÍAS DE LA SEMANA')
            card.body.html(makeDayOfWeeksSection(cronGenerator))
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
            card.body.html(makeYearsSection(cronGenerator))
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

        //set attributes
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
