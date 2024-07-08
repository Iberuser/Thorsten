function onAnswerInput(inputField) {
    const isInputFieldEmpty = inputField.value.trim() === '';
    
    // check if situation didnt change
    if (isInputFieldEmpty && inputField.wasEmpty === true) return;
    else if (!isInputFieldEmpty && inputField.wasEmpty === false) return;
    inputField.wasEmpty = isInputFieldEmpty;

    const containers = document.getElementsByClassName('input-answer');
    const lastContainer = containers[containers.length - 1];
    const lastInput = lastContainer.querySelector('input');

    // Wenn der Benutzer im letzten Eingabefeld etwas eingibt
    if (lastInput === inputField && !isInputFieldEmpty) {
        insertTemlate( //add new container
            document.getElementById("dynamicAnswerContainer"), 
            document.getElementById("answerTemplate")
        ); 
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

function deleteAnswer(button) {
    button.parentElement.remove();
}


function onSurveyFormSubmit() {
    alert('lol\nDu würdest nicht drücken Florian');
    // TODO: Mehrere optionen zur ausgabe als text oder so
}


// Initialization
updateSliderProgress(false); // Initialer Aufruf, um den Anfangszustand zu setzen
insertTemlate(document.getElementById('dynamicAnswerContainer'), document.getElementById('answerTemplate'));