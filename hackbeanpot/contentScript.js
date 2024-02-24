function manipulateDOMBasedOnTime(elapsedTime) {
    //CHANGE THIS
    //if the elapsedTime is greater than or equal to the user inputted time, add waves
    if(elapsedTime >= userCountdown) {
        document.body.style.backgroundColor = 'lightblue';
    }
}

let elapsedTime = 0;
const timerInterval = setInterval(() => {
    elapsedTime++;
    manipulateDOMBasedOnTime(elapsedTime);
}, 1000);