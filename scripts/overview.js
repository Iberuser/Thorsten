(function () {
    
    const fileButton = document.getElementById("fileButton");
    const fileLabel = document.getElementById("fileLabel");
    const fileInput = document.getElementById("fileInput");
    const surveyContainer = document.getElementById('surveyContainer');
    const surveyTemplate = document.getElementById("surveyTemplate");

    
    
    window.onFileSelect = function() {
        fileButton.innerHTML = "Neu wählen 📑";
        fileLabel.innerHTML = "<b>" + fileInput.files[0].name + "</b> ist ausgewählt";
        loadSurveys(fileInput.files[0]);
    }
    

    // Funktion zum Generieren von HTML aus JSON
    window.fillSurveyToContainer = function(jsonData) {
        for (let i = 0; i < jsonData.length; i++) {
            setTimeout(function() {
                let surveyElement = surveyTemplate.content.cloneNode(true);
                let survey = jsonData[i];
    
                const questionElement = surveyElement.querySelector(".survey > div > h3");
                const dateElement = surveyElement.querySelector(".survey > div > p");
                const maxSelectionsElement = surveyElement.querySelector(".survey > p");
                const answersListElement = surveyElement.querySelector(".survey > ul");
                
                questionElement.innerHTML = survey.question;
                dateElement.innerHTML = survey.timeStamp;
        
                if (survey["maxChoices"] == 1) {
                    maxSelectionsElement.innerHTML = 'Es ist <strong>eine Auswahl</strong> möglich';
                }
                else {
                    maxSelectionsElement.innerHTML = `Es sind <strong>${survey["maxChoices"]} auswahlen</strong> möglich`;
                }
                
                for (let x = 0; x < survey.answers.length; x++) {
                    const answerElement = document.createElement("li");
                    let answer = survey.answers[x];
    
                    answerElement.innerHTML = `
                            ${answer.emote}  ${answer.text} <br>
                            <span style="padding-left: 28px;">└ <b>${answer.users.length}</b> Stimmen: ${answer.users}</span>
                        `;
                    answersListElement.appendChild(answerElement);
                }
    
                surveyContainer.appendChild(surveyElement);
            }, 100 * i);
        }
    }

    window.loadSurveys = function() {
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
                fillSurveyToContainer(jsonData);
            })
            .catch(error => {
                throw new Error(`Error parsing the file: ${error}`);
            }
        );
    }
        
    window.init = function() {
        loadSurveys();

        clippyText.innerHTML = 
` Hier findest du alle Umfragen vom Autodach.
Natürlich kann es vorkommen das eine aktuelle Umfrage 
vom Autodach noch nicht eingetragen wurde.
Möglichkeiten zu Sortierung, sowie bessere Darstellung 
werden Folgen, das ist noch ziemlich provisorisch...`;
    }
    

})();

