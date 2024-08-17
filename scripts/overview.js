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


    // Charts
    function getEmoteColor(emote) {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Set canvas size
        const size = 64; // Increase size for better accuracy
        canvas.width = size;
        canvas.height = size;
    
        // Draw the emoji on the canvas
        ctx.font = `${size}px sans-serif`;
        ctx.fillText(emote, 0, size);
    
        // Get image data
        const imageData = ctx.getImageData(0, 0, size, size).data;
    
        // Initialize RGB sums and pixel count
        let r = 0, g = 0, b = 0, count = 0;
    
        // Loop through all pixels
        for (let i = 0; i < imageData.length; i += 4) {
            // Get the RGBA values
            const red = imageData[i];
            const green = imageData[i + 1];
            const blue = imageData[i + 2];
            const alpha = imageData[i + 3];
    
            // Ignore fully transparent pixels
            if (alpha > 0) {
                r += red;
                g += green;
                b += blue;
                count++;
            }
        }
    
        // Calculate average RGB values
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
    
        // Convert RGB to hex
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        
        canvas.remove(); // clean up
        return hex;
    }

    window.xyzChart = function(canvas, imageContainer, answers) {
        // Filtert Antworten mit mindestens einer Stimme
        const filteredAnswers = answers.filter(answer => answer.users.length > 0).sort((a, b) => b.users.length - a.users.length);

        // Daten für das Diagramm vorbereiten
        const data = {
            labels: filteredAnswers.map(answer => answer.emote + " " + answer.users.join(', ')),
            datasets: [{
                data: filteredAnswers.map(answer => answer.users.length),
                backgroundColor: filteredAnswers.map(answer => getEmoteColor(answer.emote)) // Farben für das Diagramm
            }]
        };

        // Optionen für das Diagramm
        const options = {
            color: "#ffffff",
            backgroundColor: "#0000ff",
            borderColor: "#7289DA",
            font: {
                family: "Roboto"
            },
            animation: false,
            responsive: false,
            maintainAspectRatio: true,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const emote = filteredAnswers[index].emote;
                            return emote;
                        }
                    },
                    titleFont: {
                        size: 16,
                        weight: "normal"
                    },
                    bodyAlign: "center",
                    bodyFont: {
                        size: 28
                    },
                    boxPadding: 4
                },
                legend: {
                    position: "right",
                    display: true, // Versteckt die eingebaute Legende
                    labels: {
                        font: {
                            size: 16
                        },
                        padding: 16,
                        color: "white",
                        pointStyle: "rectRounded",
                        usePointStyle: true
                    },
                    onClick: function() {} // disable action
                }
            }

        };

        // Diagramm zeichnen
        const ctx = canvas.getContext('2d');

        const chart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options
        });
    }
    

    // Funktion zum Generieren von HTML aus JSON
    window.fillSurveyToContainer = function(jsonData) {
        for (let i = 0; i < jsonData.length; i++) {
            setTimeout(function() {
                let surveyElement = surveyTemplate.content.cloneNode(true);
                let survey = jsonData[i];
    
                const questionElement = surveyElement.querySelector(".survey > div:first-child > h3");
                const dateElement = surveyElement.querySelector(".survey > div:first-child > p");
                const maxSelectionsElement = surveyElement.querySelector(".survey > p");
                const answersListElement = surveyElement.querySelector(".survey ul");
                const canvas = surveyElement.querySelector(".survey canvas");
                const userImageContainer = surveyElement.querySelector(".survey .userImages");
                
                // survey + timestamp
                questionElement.innerHTML = survey.question;
                dateElement.innerHTML = survey.timeStamp;
        
                // max choices
                if (survey["maxChoices"] == 1) {
                    maxSelectionsElement.innerHTML = 'Es ist <strong>eine Auswahl</strong> möglich';
                }
                else {
                    maxSelectionsElement.innerHTML = `Es sind <strong>${survey["maxChoices"]} auswahlen</strong> möglich`;
                }
                
                // answers
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

                // chart
                xyzChart(canvas, userImageContainer, survey.answers);
            }, 100 * i);
        }
    }

    window.loadSurveys = function() {
        fetch(surveyFileUrl)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        // 403 -> forbidden
                        console.error(`Response: ${errorData}`); 
                        throw new Error(`Response Message: ${errorData.message}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                try {
                    const files = data.files;
                    const fileContent = files[surveyFileName].content;
                    
                    const jsonData = JSON.parse(fileContent);
                    document.getElementById("loadingCircle").remove(); // remove loading circle
                    fillSurveyToContainer(jsonData);
                }
                catch (error) {
                    console.error(new Error(`Error parsing the file: \n${error}`));
                }
            })
            .catch(error => {
                console.error('Fetch error:', error.message);
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

