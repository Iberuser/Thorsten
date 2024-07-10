(function() {
    const maxAnswersInput = document.getElementById("maxAnswersInput");
    const maxAnswersRange = document.getElementById("maxAnswersRange");

    // custom range 
    window.updateSliderProgress = function(isChangeFromSlider) {
        if (isChangeFromSlider) {
            maxAnswersInput.value = maxAnswersRange.value;
        }
        else {
            maxAnswersRange.value = maxAnswersInput.value;
        }
        
        const sliderProgress = (maxAnswersRange.value - maxAnswersRange.min) / (maxAnswersRange.max - maxAnswersRange.min) * 100;
        maxAnswersRange.style.setProperty('--progress', `${sliderProgress}%`);
    };

    window.init = function() {
        updateSliderProgress(false);
    } 

})();
