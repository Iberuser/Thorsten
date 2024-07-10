(function () {
    
    const fileButton = document.getElementById("fileButton");
    const fileLabel = document.getElementById("fileLabel");
    const fileInput = document.getElementById("fileInput");

    // Funktion zum Generieren von HTML aus JSON
    window.jsonToHTML = function(jsonData) {
        let htmlAusgabe = "";
    
        for (let i = 0; i < jsonData.length; i++) {
            let survey = jsonData[i];
    
            htmlAusgabe += '<div class="survey">';
            htmlAusgabe += `
                <div>
                    <h3>${survey.question}</h3>
                    <p>Umfrage vom: <strong>${survey.date}</strong></p>
                </div>
            `;
    
            if (survey["max-selections"] == 1) {
                htmlAusgabe += '<p>Es ist <strong>eine Auswahl</strong> möglich</p>';
            }
            else {
                htmlAusgabe += `<p>Es sind <strong>${survey["max-selections"]} auswahlen</strong> möglich</p>`;
            }
            
            htmlAusgabe += '<ul>';
            for (let x = 0; x < survey.answers.length; x++) {
                let answer = survey.answers[x];
                htmlAusgabe += `
                    <li>
                        ${answer.symbol}  ${answer.text} <br>
                        <span style="padding-left: 28px;">└ <b>${answer.persons.length}</b> Stimmen: ${answer.persons}</span>
                    </li>
                    `;
            }
            htmlAusgabe += '</ul></div>';
        }
    
        return htmlAusgabe + "<br><br><br><br><br>";
    }
    
    
    window.onFileSelect = function() {
        fileButton.innerHTML = "Neu wählen 📑";
        fileLabel.innerHTML = "<b>" + fileInput.files[0].name + "</b> ist ausgewählt";
        loadSurveys(fileInput.files[0]);
    }
    
    
    window.loadSurveys = function(fileName) {
        fetch(fileName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching the file: ${response.statusText}`);
                }
                return response.text();
            })
            .then(jsonText => {
                const jsonDaten = JSON.parse(jsonText);
                document.getElementById('surveyContainer').innerHTML = jsonToHTML(jsonDaten);
            })
            .catch(error => console.error('Error loading survey:', error));
    }

    window.init = function() {
        loadSurveys('thorsten.json');
    }

})();

