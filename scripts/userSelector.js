(function () {
    let selectedAnswerList;
    const userSelector = document.getElementById("userSelector");
    const userSelectorList = document.getElementById("userSelectorList");
    let userLists = document.querySelectorAll(".answerUserList");
    const userSelectorInput = document.getElementById("userSelectorInput");
    let users = [];


    window.openUserPopup = function(element) {
        selectedAnswerList = element.parentElement;

        userSelector.classList.add("visible");
        userSelector.querySelector("input").focus();
    }

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
    }
    
    window.userSelectorSelect = function(userName) {
        if (!userName) return;
        const maxAnswers = document.getElementById("maxAnswersInput").value;
        if (userAtMaxVotes(userName, maxAnswers)) return;

        addUserToList(userName);
        
        closeUserSelector();
        refreshUserSelector();
    }

    window.refreshUserSelector = function() {
        userSelectorList.innerHTML = "";
        fillUserPopup();
        userSelectorInput.value = "";
    }

    window.closeUserSelector = function(event) {
        if (event && event.key !== "Escape") return;

        userSelector.classList.remove("visible");
    }

    window.userSelectorInputConfirm = function(event) {
        if (!event || event.key === 'Enter') {
            userSelectorSelect(userSelectorInput.value)
        } 
    }

    const userList = [
        { name: "Marju", fullname: "Marju", image: "marju.jpg" },
        { name: "Maggus", fullname: "Maggus [mag] Magnum", image: "maggus.jpg" },
        { name: "Husti", fullname: "Hustiii" },
        { name: "Silas", fullname: "Silas/Salamander", image: "silas.png"},
        { name: "Justus", fullname: "Justus/Rufus/Iberus", image: "justus.png" },
        { name: "Lukas", fullname: "Lukas/Luggas/Lang", image: "lukas.png" },
        { name: "Turtle", fullname: "Turtle" },
        { name: "Janni", fullname: "Janni", image: "janni.jpg" },
        { name: "Schatten", fullname: "Schatten/Nora", image: "schatten.jpg" },
        { name: "Geiche", fullname: "Geiche/Geike", image: "geiche.png" },
        { name: "Kyo", fullname: "Kyo" }, // maria ist deprecated
        { name: "Sandro", fullname: "Sandro/Sandrus", image: "sandro.png" },
        { name: "Alvin", fullname: "Alvin/Scybouns" },
        { name: "Nev", fullname: "Nev" },
        { name: "Technic", fullname: "TechniccGaming_F" },
        { name: "Arthur", fullname: "Arthur ✝️2023" }
        // Potentiell, Avery
        // Max und toadsie rausgelassen
        // Thorsten werde nicht genannt
    ]

    window.fillUserPopup = function() {
        // refresh userlist
        const maxAnswers = document.getElementById("maxAnswersInput").value;
        users = [];
        userLists.forEach(userList => {
            userList.querySelectorAll("button:not(:first-child) > :first-child").forEach(userElement => { //select every name span
                const currentUserName = userElement.innerHTML.trim().toLowerCase(); //extract name from span
                users.push(currentUserName);
            });
        });

        //fill popup
        let tableRow = document.createElement("tr");
        userSelectorList.appendChild(tableRow);

        userList.forEach((item) => {
            if (userAtMaxVotes(item.name.trim().toLowerCase(), maxAnswers)) return;
            
            const tableCell = document.createElement("td");
            tableCell.addEventListener("click", function() {
                userSelectorSelect(item.name);
            });

            const image = document.createElement("img");
            image.src = item.image ? "icons/" + item.image : "icons/user.webp";
            const name = document.createElement("p");
            name.innerHTML = item.fullname;

            tableCell.appendChild(image);
            tableCell.appendChild(name);

            tableRow.appendChild(tableCell)
            
            if (tableRow.childNodes.length >= 2) { 
                tableRow = document.createElement("tr");
                userSelectorList.appendChild(tableRow);
            }
        });
    }

    window.userAtMaxVotes = function(username, maxAnswers) {
        const userOccurences = users.filter(x => x === username.trim().toLowerCase()).length;

        if (username.trim().toLowerCase() == "marju" && userOccurences > maxAnswers){
            return true; // marju gets 1 extra votes
        }
        if (userOccurences >= maxAnswers) {
            return true;
        }
        return false;
    }

    window.onUserSelectorInput = function(input) {
        userSelectorList.querySelectorAll("td").forEach( cell => {
            cell.classList.remove("disabled");
            if (!cell.lastElementChild.innerHTML.toLowerCase().includes(input.toLowerCase())) {
                cell.classList.add("disabled");
            }
        });
    }


    window.init = function() {
        refreshUserSelector();
    }
})();