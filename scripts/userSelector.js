(function () {
    let selectedAnswerList;
    const userSelector = document.getElementById("userSelector");
    const userSelectorList = document.getElementById("userSelectorList");
    const userLists = document.querySelectorAll(".answerUserList");
    const userSelectorInput = document.getElementById("userSelectorInput");


    window.openUserPopup = function(element) {
        selectedAnswerList = element.parentElement;

        userSelector.classList.add("visible");
        userSelector.querySelector("input").focus();
    }

    window.refreshUserSelector = function() {
        userSelectorList.innerHTML = "";
        fillUserPopup();
        userSelectorInput.value = "";
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
        if (userAtMaxVotes(userName)) return;

        addUserToList(userName);
        
        userSelector.classList.remove("visible");
        refreshUserSelector();
    }

    window.userSelectorInputConfirm = function(event) {
        if (!event || event.key === 'Enter') {
            userSelectorSelect(userSelectorInput.value)
        } 
    }

    const userList = [
        { name: "Marju" },
        { name: "Silas" },
        { imageUrl: "https://cdn.discordapp.com/avatars/380405795113795584/f8213baa311fbfe2b4f39858555ce4b0?size=64", name: "Maggus" },
        { imageUrl: "https://cdn.discordapp.com/avatars/805544849729650768/a39a4c2b8893688b059a2c833ba9069b?size=64", name: "Kyo" },
        { imageUrl: "https://cdn.discordapp.com/avatars/650336976486137867/f07c2136fff62eed6fea1648b2483ebb?size=64", name: "Janni" },
        { imageUrl: "https://cdn.discordapp.com/avatars/808049434909736980/5043913d1f461829fc76b74a7dd4cace?size=64", name: "Schatten/Nora" },
        { imageUrl: "https://cdn.discordapp.com/avatars/381066251272716290/98288e89d59245b15c1e53496c5f5c78?size=64", name: "Lukas" },
        { imageUrl: "https://cdn.discordapp.com/avatars/579395880692613150/8b49e8a3d4453653a1c3b235fcb339a4?size=64", name: "Turtle" },
        { imageUrl: "https://cdn.discordapp.com/avatars/799718623580127252/72497cd1f2cf7c8c5b10c2451515fa4a?size=64", name: "Hustiii" },
        { imageUrl: "https://cdn.discordapp.com/avatars/872796463091023913/0a6d2bb86d57e2b21e94c0ee1d4518d0?size=64", name: "Sandro" },
        { imageUrl: "https://cdn.discordapp.com/avatars/1024731104659374080/e49717d8b2ece485a43ef2d2449d8832?size=64", name: "Julius" },
        { name: "Geiche" },
        { name: "Alvin/Scybouns" },
        { name: "Nev" }
    ]

    window.fillUserPopup = function() {
        let tableRow = document.createElement("tr");
        userSelectorList.appendChild(tableRow);

        userList.forEach((item) => {
            if (userAtMaxVotes(item.name)) return;

            const tableCell = document.createElement("td");
            tableCell.addEventListener("click", function() {
                userSelectorSelect(this.lastElementChild.innerHTML);
            });

            const image = document.createElement("img");
            image.src = item.imageUrl ?? "icons/user.webp";
            const name = document.createElement("p");
            name.innerHTML = item.name;

            tableCell.appendChild(image);
            tableCell.appendChild(name);

            tableRow.appendChild(tableCell)
            
            if (tableRow.childNodes.length >= 2) { 
                tableRow = document.createElement("tr");
                userSelectorList.appendChild(tableRow);
            }
        });
    }

    window.onUserSelectorInput = function(input) {
        userSelectorList.querySelectorAll("td").forEach( cell => {
            cell.classList.remove("disabled");
            if (!cell.lastElementChild.innerHTML.toLowerCase().includes(input.toLowerCase())) {
                cell.classList.add("disabled");
            }
        });
    }

    window.userAtMaxVotes = function(userName) {
        const maxAnswers = document.getElementById("maxAnswersInput").value;
        userName = userName.trim().toLowerCase();
        let occurences = 0;

        userLists.forEach(userList => {
            userList.querySelectorAll("button:not(:first-child) > :first-child").forEach(userElement => { //select every name span
                const currentUserName = userElement.innerHTML.trim().toLowerCase(); //extract name from span
                if (currentUserName == userName) occurences ++;
            });
        });

        return (occurences >= maxAnswers);
    }


    window.init = function() {
        refreshUserSelector();
    }
})();