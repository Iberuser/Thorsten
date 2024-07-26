(function () {
    const dynamicAnswerContainer = document.getElementById('dynamicAnswerContainer');
    const answerTemplate = document.getElementById('answerTemplate');
    const statusLabel = document.getElementById("statusText");

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


    window.getSurveyFromFrom = function() {
        const question = document.getElementById("questionInput").value;
        const maxChoices = document.getElementById("maxAnswersInput").value;
        const timestamp = document.getElementById("datetimeInput").value;

        let answers = [];
        document.querySelectorAll(".answerElement").forEach(answerElement => {
            const emote = answerElement.querySelector("button:first-child").innerHTML;
            const answerText = answerElement.querySelector("input").value;

            if (answerText.trim() == "") return; // exit answer loop

            let users = [];
            answerElement.querySelectorAll("div > button:not(:first-child) > span:first-child").forEach(userElement => {
                users.push(userElement.innerHTML);
            });

            const answer = {
                text: answerText,
                emote: emote,
                users: users
            };
            answers.push(answer);
        });

        const survey = {
            question: question,
            maxChoices: maxChoices,
            timeStamp: timestamp,
            answers: answers
        };
        console.log(survey);
        return survey;
    }

    window.isSurveyCompletet = function(survey) {
        return (
            survey.question &&
            survey.timeStamp &&
            survey.answers.length >= 2
        );
    }

    window.doesSurveyAlreadyExist = function(jsonData, newSurveyQuestion) {
        for (let i = 0; i < jsonData.length; i++) {
            let currentQuestion = jsonData[i].question.toLowerCase().trim();
            let question = document.getElementById("questionInput").value;

            if (currentQuestion == newSurveyQuestion) {
                return i;
            }
        }
        return false;
    }

    window.onSurveyFormSubmit = function() {
        const survey = getSurveyFromFrom();

        if (!isSurveyCompletet(survey)) {
            alert("Nicht alle Felder sind auusgefüllt!")
            return;
        }

        //load survey file
        fetch(surveyFileUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching the file: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const files = data.files;
                const fileContent = files[surveyFileName].content;
                const jsonData = JSON.parse(fileContent);
                
                const doesExist = doesSurveyAlreadyExist(jsonData, survey.question.toLowerCase().trim());
                if (doesExist !== false) {
                    const confirmOverwrite = confirm("Eine Umfrage mit diesem Namen ist bereits im Archiv. \nWillst du sie überschreiben?");
                    if (!confirmOverwrite) {
                        return; // if survey alreadey existing and user not willingt to overwrite STOP, else continue
                    }
                    jsonData.splice(doesExist, 1);
                }

                console.log(jsonData);
                jsonData.push(survey);

                saveData(jsonData);
                //alert('lol\nDu würdest nicht drücken Florian');
            })
            .catch(error => {
                alert("Die Umfragedatei zum Speichern konnte nicht geladen werden!");
                console.error(error);
                return;
            }
        );
    }

    window.saveData = function(jsonData) {
        const updatedGist = {
            files: {
                [surveyFileName]: {
                    content: JSON.stringify(jsonData, null, 4)
                }
            }
        };
        const token = prompt("Bitte Token zum Speichern eingeben:");

        fetch(surveyFileUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedGist)
        })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                displayStatus("Umfrgage erfolgreich gspeichert", "#056800");
            } else if (response.status === 401) {
                displayStatus("Falscher Token", "#a04800");
            } else {
                displayStatus("Fehler beim Speichern", "#a00000");
            }
        })
        .catch(error => {
            console.error('Es gab einen Fehler bei der Anfrage:', error);
        });
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
                insertTemlate(dynamicAnswerContainer, answerTemplate);
            }
            catch (error) {
                alert("Die Umfrage konnte nicht erkannt werden! \n" + error);
            }
        });
    }

    window.clearSurveyForm = function() {
        document.getElementById("questionInput").value = "";
        document.getElementById("maxAnswersInput").value = 1;
        updateSliderProgress(false);
        document.getElementById("datetimeInput").value = null;
        dynamicAnswerContainer.innerHTML = "";
        insertTemlate(dynamicAnswerContainer, answerTemplate);
    }

    window.displayStatus = function(text, color) {
        statusLabel.innerHTML = text;
        statusLabel.style.color = color;
        statusLabel.classList.add("visible");

        setTimeout(function() {
            statusLabel.classList.remove("visible");
        }, 4000);
    }

    
    window.init = function() {
        loadScript("scripts/customRange.js");
        loadScript("scripts/emojiPicker.js");
        loadScript("scripts/surveyInterpreter.js");
        loadScript("scripts/userSelector.js");
        
        insertTemlate(dynamicAnswerContainer, answerTemplate);

        clippyText.innerHTML = 
` Hier können Vergangene Umfragen 
ins Archiv eingetragen werden
Das Eintragen ist nur mit Schlüssel möglich
>Bitte denke daran die Nutzer 
 zu den Antworten hinzuzufügen
>Discord Server Emotes gehen leider nicht
>Das Emotemenü funktioniert nur auf Englisch`;
    }

})();
