(function () {
    const datetimeRegex = /(\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}|gestern um \d{2}:\d{2} uhr|heute um \d{2}:\d{2} uhr)/i;
    const multipleChoiceRegex = /(.*?)\(max(.*?)\d+\)\)/i;
    const nameDateSeparator = " — ";

    window.parseTime = function(timeString) {
        let now = new Date();
        let date;

        if (timeString.startsWith("heute um")) {
            // Format: heute um hh:mm Uhr
            let timePart = timeString.match(/heute um (\d{2}:\d{2}) Uhr/)[1];
            let [hours, minutes] = timePart.split(':');
            date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        } else if (timeString.startsWith("gestern um")) {
            // Format: gestern um hh:mm Uhr
            let timePart = timeString.match(/gestern um (\d{2}:\d{2}) Uhr/)[1];
            let [hours, minutes] = timePart.split(':');
            date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, hours, minutes);
        } else {
            // Format: dd.mm.yyyy hh:mm
            let match = timeString.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}:\d{2})/);
            if (match) {
                let [_, day, month, year, timePart] = match;
                let [hours, minutes] = timePart.split(':');
                date = new Date(year, month - 1, day, hours, minutes);
            }
        }

        if (date) {
            return date.toISOString().slice(0, 16);
        } else {
            throw new Error("Unbekanntes Datumsformat");
        }
    }

    window.stripMarkup = function(text) {
        text = text.replace(/\*\*\*(.*?)\*\*\*/g, '$1');
        text = text.replace(/\*\*(.*?)\*\*/g, '$1');
        text = text.replace(/\*(.*?)\*/g, '$1');
        text = text.replace(/~~(.*?)~~/g, '$1');
        text = text.replace(/\|\|(.*?)\|\|/g, '$1');
        text = text.replace(/^\s*?# (.*?)$/, '$1'); //kein g weil nur erstes vorkommen ersetzen

        return text;
    }

    window.parseDiscordMessage = function(message) {
        const lines = message.split('\n').map(line => line.replace('\r', '').trim());
        let result = {
            username: null,
            dateTime: null,
            question: null,
            maxChoices: 1,
            answers: []
        };

        let currentIndex = 0;

        // Check if the first line contains username and datetime
        if (lines[0].includes(nameDateSeparator) && datetimeRegex.test(lines[0])) {
            const separatorIndex = lines[0].lastIndexOf(nameDateSeparator);
            result.username = lines[0].substring(0, separatorIndex);
            timeString = lines[0].substring(separatorIndex+nameDateSeparator.length);
            try {
                result.dateTime = parseTime(timeString);
            } catch (error) {
                alert("Der Zeitstempel der Umfrage wurde nicht erkannt!");
            }
            currentIndex++; // goto next line
        }
        // if not stay in first line for next step

        // Parse question and multiple choice info
        const questionParts = stripMarkup(lines[currentIndex]).match(/^(.*?)(\((.*?)\))$/i);
        result.question = questionParts[1].trim(); //erster teil ist frage
        const choiceInfo = questionParts[2]; //zweiter teil ist inhalt der klammer
        if (choiceInfo.includes("nicht")) { //test if not
            //nichts notwendig, ist ja schon auf 1
        }
        else if (multipleChoiceRegex.test(choiceInfo)) { //test if contains max count
            const choiceInfoParts = choiceInfo.match(/\(Max\.\s*(\d+)\)/i);
            result.maxChoices = parseInt(choiceInfoParts[1]); //index 1 der choice info ist nummer
            if (result.maxChoices === null) {} //error
        }
        else {
            //error
        }
        currentIndex++; // goto next line

        // Skip possible placeholder line : \n
        if (lines[currentIndex].trim() === '') {
            currentIndex++; // goto next line
        }

        // Parse answers
        for (let i = currentIndex; i < lines.length; i++) {
            const answerParts = lines[i].split(' ');
            const emote = answerParts[0].includes(':') ? '❓' : answerParts[0];
            const answer = stripMarkup(answerParts.slice(1).join(' '));
            if (emote && answer) { //ignore empty or incomplete options
                result.answers.push({ emote, answer });
            }
        }

        return result;
    }
    
})();