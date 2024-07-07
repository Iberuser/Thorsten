function updateSliderProgress(isChangeFromSlider, isFromSaveMenu) {
    if (isFromSaveMenu) {
        if (isChangeFromSlider) {
            maxAnswersInput.value = maxAnswersRange.value;
        }
        else {
            maxAnswersRange.value = maxAnswersInput.value;
        }
        
        let sliderProgress = (maxAnswersRange.value - maxAnswersRange.min) / (maxAnswersRange.max - maxAnswersRange.min) * 100;
        maxAnswersRange.style.setProperty('--progress', `${sliderProgress}%`);
    }
    else {
        if (isChangeFromSlider) {
            maxAnswersInput.value = maxAnswersRange.value;
        }
        else {
            maxAnswersRange.value = maxAnswersInput.value;
        }
        
        let sliderProgress = (maxAnswersRange.value - maxAnswersRange.min) / (maxAnswersRange.max - maxAnswersRange.min) * 100;
        maxAnswersRange.style.setProperty('--progress', `${sliderProgress}%`);
    }    
}
updateSliderProgress(); // Initialer Aufruf, um den Anfangszustand zu setzen