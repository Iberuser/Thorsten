(function () {
    let selectedAnswerList;
    const userSelector = document.getElementById("userSelector");
    const userSelectorList = document.getElementById("userSelectorList");
    const userSelectorInput = document.getElementById("userSelectorInput");
    let addedUsers = [];

    //userlist now in index.html


    // userlist add and remove
    window.removeUserFromList = function(element) {
        element.remove();
        refreshUserSelector();
    }

    window.addUserToList = function(userName) {
        const button = document.createElement("button");
        button.innerHTML = `<span>${userName}</span>` + `<span> ❌</span>`;
        button.addEventListener("click", function() {
            removeUserFromList(this);
        });

        selectedAnswerList.appendChild(button);
        refreshUserSelector();
    }
    

    // selector open, close and refresh
    window.openUserSelector = function(element) {
        selectedAnswerList = element.parentElement; // get userlist element

        userSelector.classList.add("visible");
        userSelector.querySelector("input").focus();

        userSelectorInput.value = "";
    }

    window.closeUserSelector = function(event) {
        if (event && event.key !== "Escape") return;

        userSelector.classList.remove("visible");
    }

    window.refreshUserSelector = function() {
        userSelectorList.innerHTML = "";
        updateAddedUsersList();
        fillUserSelector();
    }


    // processing input
    window.userSelectorSelect = function(userName) {
        if (!userName) { //if no username provided take from input
            userName = userSelectorInput.value;
            // if value comes from input, additional maxVotes check is needed
            const maxAnswers = document.getElementById("maxAnswersInput").value;
            if (userAtMaxVotes(userName, maxAnswers)) return;
        };
        
        addUserToList(userName);
        
        closeUserSelector();
    }

    window.onUserSelectorInput = function() {
        const input = userSelectorInput.value;
        // highlight searched users 
        userSelectorList.querySelectorAll("td").forEach( cell => {
            cell.classList.remove("disabled");
            if (!cell.lastElementChild.innerHTML.toLowerCase().includes(input.toLowerCase())) {
                cell.classList.add("disabled");
            }
        });
    }

    window.onUserSelectorEnter = function(event) { // just for user friendlyness
        if (event.key == "Enter") {
            userSelectorSelect();
        }
    }


    // user counting stuff
    window.updateAddedUsersList = function() {
        const userLists = document.querySelectorAll(".answerUserList");
        addedUsers = []; // empty array
        console.log("update");
        userLists.forEach(userList => {
            console.log(userList.querySelectorAll("button:not(:first-child) > :first-child"));
        });

        userLists.forEach(userList => { // refill
            userList.querySelectorAll("button:not(:first-child) > :first-child").forEach(userElement => { //select every name span
                const currentUserName = userElement.innerHTML.trim().toLowerCase(); //extract name from span
                addedUsers.push(currentUserName);
            });
        });
    }

    window.userAtMaxVotes = function(username, maxAnswers) {
        const userOccurences = addedUsers.filter(x => x === username.trim().toLowerCase()).length;
        
        if (username.trim().toLowerCase() == "marju") {
            if (userOccurences > maxAnswers) {
                return true; // marju gets 1 extra votes
            }
        }
        else if (userOccurences >= maxAnswers) {
            return true;
        }
        return false;
    }


    // generate the holy selector
    window.fillUserSelector = function() {
        const maxAnswers = document.getElementById("maxAnswersInput").value;

        //fill popup
        let tableRow = document.createElement("tr");
        userSelectorList.appendChild(tableRow);

        userList.forEach((user) => {
            if (userAtMaxVotes(user.name.trim().toLowerCase(), maxAnswers)) return;
            
            const tableCell = document.createElement("td");
            tableCell.addEventListener("click", function() {
                userSelectorSelect(user.name);
            });

            const image = document.createElement("img");
            image.src = user.image ? "icons/" + user.image : "icons/user.webp";
            const name = document.createElement("p");
            name.innerHTML = user.fullname;

            tableCell.appendChild(image);
            tableCell.appendChild(name);

            tableRow.appendChild(tableCell)
            
            if (tableRow.childNodes.length >= 2) { 
                tableRow = document.createElement("tr");
                userSelectorList.appendChild(tableRow);
            }
        });
    }


    window.init = function() {
        refreshUserSelector();

        dynamicAnswerContainer.addEventListener("refresh", function() {
            refreshUserSelector();
        });
    }
})();