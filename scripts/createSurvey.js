(function() {
    const dynamicAnswerContainer = document.getElementById('dynamicAnswerContainer');
    const answerTemplate = document.getElementById('answerTemplate');
    const surveyPreview = document.getElementById('surveyPreview');

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
            lastContainer.lastElementChild.removeAttribute("disabled"); //enable delete button
        }
        
        //bei mehr als einem feld überprüfung zur entfernung des letzten
        if (containers.length < 2) return;
        const secondlastContainer = containers[containers.length - 2];
        const secondlastInput = secondlastContainer.querySelector('input');

        // Überprüfen, ob das vorletzte Eingabefeld leer ist und lösche letztes
        if (secondlastInput === inputField && isInputFieldEmpty) {   
            lastContainer.remove(); //if input emtpy remove conatiner
            secondlastContainer.lastElementChild.setAttribute("disabled", "true"); //disabled delete button
        }
    }

    window.deleteAnswer = function(button) {
        button.parentElement.remove();
    }

    window.discordifyText = function(text) {
        // Ersetze ***/*** durch <b><i>/<i></b>
        text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>');
        // Ersetze **/** durch <b>/<b>
        text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        // Ersetze */* durch <i>/<i>
        text = text.replace(/\*(.*?)\*/g, '<i>$1</i>');
        // Ersetze ~~ durch <s>/<s>
        text = text.replace(/~~(.*?)~~/g, '<s>$1</s>');
        // Ersetze || durch <span style='background-color:black; color:black;'>/<span>
        text = text.replace(/\|\|(.*?)\|\|/g, '<span class="spoiler">$1</span>');
        // Ersetze # am Anfang der Zeile durch <h1>/<h1>
        text = text.replace(/^\s*?# (.*?)$/, '<span class="heading">$1</span>'); //kein g weil nur erstes vorkommen ersetzen
        
        return text;
    }

    window.updatePreview = function(element) { //TODO: ONLY UPDATE CONTENT NOT PIC, NAME AND (TIME)
        let html = "";

        const question = discordifyText(document.getElementById("questionInput").value);
        const maxAnswers = document.getElementById("maxAnswersInput").value;

        html += "<span>" + (question == "" ? "Generische Frage" : question) + " (Mehrfachauswahl " + (maxAnswers == 1 ? "<b>nicht</b> möglich" : "möglich (<b>Max." + maxAnswers + "</b>)") + ")</span> <br><br>";

        const containers = document.querySelectorAll('.answerElement');
        containers.forEach(container => {
            const answer = discordifyText(container.querySelector('input').value);
            if (answer == "") return;
            const emote = container.querySelector('button').innerHTML;
            
            html += "<span>" + emote + "  " + answer + "</span> <br>";
        });

        surveyPreview.innerHTML = html;
    }

    window.copySurvey = function() {
        let text = "";

        const question = document.getElementById("questionInput").value;
        const maxAnswers = document.getElementById("maxAnswersInput").value;

        text += (question == "" ? "Generische Frage" : question) + " (Mehrfachauswahl " + (maxAnswers == 1 ? "**nicht** möglich" : "möglich (**Max." + maxAnswers + "**)") + ")\n\n";

        const containers = document.querySelectorAll('.answerElement');
        containers.forEach(container => {
            const answer = container.querySelector('input').value;
            if (answer == "") return;
            const emote = container.querySelector('button').innerHTML;
            
            text += emote + " " + answer + "\n";
        });

        navigator.clipboard.writeText(text);
    }


    window.init = function() {
        // Initialization
        loadScript("scripts/customRange.js");
        loadScript("scripts/emojiPicker.js");
    
        insertTemlate(dynamicAnswerContainer, answerTemplate);
        document.getElementById("previewTimestamp").innerHTML = getCurrentTimeFormatted();
        updatePreview();
    }

})();