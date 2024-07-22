(function () {
    const dynamicAnswerContainer = document.getElementById('dynamicAnswerContainer');
    const answerTemplate = document.getElementById('answerTemplate');

    window.onAnswerInput = function(inputField) {
        const isInputFieldEmpty = inputField.value.trim() === '';
        
        // check if situation didnt change
        if (isInputFieldEmpty && inputField.wasEmpty === true) return;
        else if (!isInputFieldEmpty && inputField.wasEmpty === false) return;
        inputField.wasEmpty = isInputFieldEmpty;

        const containers = document.getElementsByClassName('answerElement');
        const lastContainer = containers[containers.length - 1];
        const lastInput = lastContainer.querySelector('input');

        // Wenn der Benutzer im letzten Eingabefeld etwas eingibt
        if (lastInput === inputField && !isInputFieldEmpty) {
            insertTemlate(dynamicAnswerContainer, answerTemplate); //add new container
            lastContainer.lastElementChild.previousElementSibling.removeAttribute("disabled"); //enable delete button
        }
        
        //bei mehr als einem feld überprüfung zur entfernung des letzten
        if (containers.length < 2) return;
        const secondlastContainer = containers[containers.length - 2];
        const secondlastInput = secondlastContainer.querySelector('input');

        // Überprüfen, ob das vorletzte Eingabefeld leer ist und lösche letztes
        if (secondlastInput === inputField && isInputFieldEmpty) {   
            lastContainer.remove(); //if input emtpy remove conatiner
            secondlastContainer.lastElementChild.previousElementSibling.setAttribute("disabled", "true"); //disabled delete button
        }
    }

    window.deleteAnswer = function(button) {
        button.parentElement.remove();
    }

    window.onSurveyFormSubmit = function() {
        //check if survey exists


        alert('lol\nDu würdest nicht drücken Florian');
        // TODO: Mehrere optionen zur ausgabe als text oder so
    }


    window.importSurveyFromClipboard = function() {
        navigator.clipboard.readText().then(text => {
            try {
                const parsedMessage = parseDiscordMessage(text);
                console.log(parsedMessage);
                //document.getElementById('result').textContent = JSON.stringify(parsedMessage, null, 2);
                document.getElementById("questionInput").value = parsedMessage.question;
                document.getElementById("maxAnswersInput").value = parsedMessage.maxChoices;
                updateSliderProgress(false);
                document.getElementById("datetimeInput").value = parsedMessage.dateTime;

                // fill ansers
                dynamicAnswerContainer.innerHTML = "";
                parsedMessage.answers.forEach(answer => {
                    // probably just a special fork of inserTemplate()
                    const newContainer = answerTemplate.content.cloneNode(true);
                    newContainer.querySelector("button").innerHTML = answer.emote;
                    newContainer.querySelector("button:disabled").removeAttribute("disabled");
                    newContainer.querySelector("input").value = answer.answer;
                    dynamicAnswerContainer.appendChild(newContainer);
                });
                insertTemlate(dynamicAnswerContainer, answerTemplate)
            }
            catch (error) {
                alert("Die Umfrage konnte nicht erkannt werden! \n" + error)
            }
            // DELETE BUTTONS REMAIN DISABLED AFTER INSERT!!!!!!!!!!!!!!
            
        });
    }

    
    window.init = function() {
        loadScript("scripts/customRange.js");
        loadScript("scripts/emojiPicker.js");
        loadScript("scripts/surveyInterpreter.js");
        loadScript("scripts/userSelector.js");
        
        insertTemlate(dynamicAnswerContainer, answerTemplate);
    }

})();
