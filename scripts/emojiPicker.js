(function() {

    const emojiPicker = document.getElementById('emojiPicker');

    window.openEmoteSelector = function(clickedButton) {
        if (emojiPicker.clickedButton == clickedButton) {
            emojiPicker.classList.toggle("visible");
        }
        else {
            emojiPicker.classList.add("visible");
            emojiPicker.clickedButton = clickedButton;
            clickedButton.textContent = "🧍";
            
            const rect = clickedButton.getBoundingClientRect();
            emojiPicker.style.left = rect.left + "px";
            emojiPicker.style.top = rect.bottom + "px";
        }
        
    }

    window.init = function() {
        emojiPicker.addEventListener('emoji-click', (event) => {
            const emoji = event.detail.unicode;
            emojiPicker.clickedButton.textContent = emoji;
            emojiPicker.classList.remove("visible");
        });  

        document.body.addEventListener("keydown", function (event) {
            if (event.code == 27 && emojiPicker.classList.contains("visible")) {
                emojiPicker.classList.remove("visible");
            }
        });  
    } 

})();