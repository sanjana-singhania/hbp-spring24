document.addEventListener('DOMContentLoaded', function() {
  const chosenMessageText = document.getElementById('chosenMessage');

  const startButton = document.getElementById('startButton');
  const resetButton = document.getElementById('resetButton');
  const countdownInput = document.getElementById('countdownInput');
  let timerInterval; // Variable to hold the setInterval ID
  let countdownTime; // Variable to hold the remaining countdown time
  let isPaused = false; // Variable to track pause state

  let productive = ['Fish-tastic job!', 'Keep swimming :)', `You're really fish-tastic!`,
      'I sea you working...', 'A true ocean master!', `You're such a starfish!`];
  let unproductive = ['Oh, barnacles.',
      `I don't sea you working hard.`, `I'm getting flooded...`, 'Your fish are gonna drown!', 
      `Someone's finally taking a shower...`, 'Make more waves with your productivity'];

  function chooseMessage(callback) {
    let listURL = JSON.parse(localStorage.getItem("productivity under the sea")) || [];
    let num = Math.floor(Math.random() * 6);
    console.log(listURL);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      let currentTabURL = tabs[0].url;
      console.log(currentTabURL);
      if (listURL.some(url => currentTabURL.includes(url))) {
          callback(unproductive[num]);
      } else {
          callback(productive[num]);
      }
    });
  }
    
      chooseMessage(function(message) {
        chosenMessageText.innerText = message;
      });

  //updates the timer
  function updateTime() {
    chrome.storage.local.get(["timer"], (res) => {
      const totalSeconds = res.timer;
      const displaySeconds = totalSeconds % 60;
      const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
      const displayHours = Math.floor(totalSeconds / 3600);

      const time = document.getElementById("timer");
      const hours = String(displayHours).padStart(2, "0");
      let minutes;
      // if (displayMinutes > 0) {
        // displayMinutes = String(displayMinutes - 1).padStart(2, "0");
      // } else {
        minutes = String(displayMinutes).padStart(2, "0");
      // }
      let seconds = String(displaySeconds).padStart(2, "0");
      console.log(hours, minutes, seconds)
      time.textContent = `${hours}:${minutes}:${seconds}`;
    });
}
  //is called once to initialize from countdown input
  function setTimer() {
      // countdownTime = parseInt(countdownInput.value) * 60;
      // const inputTime = countdownTime;
      // if (!isNaN(inputTime)) {
          // chrome.storage.local.set({ "timer": inputTime });
          updateTime();
      // }
  }

  // // Function to update the timer display
  // function updateTimer(seconds) {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = seconds % 60;
  //   const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  //   timerDisplay.textContent = formattedTime;
  // }

  // Function to start the countdown timer
  function startCountdown() {
    countdownTime = parseInt(countdownInput.value) * 60;
    if (isNaN(countdownTime) || countdownTime <= 0) {
      alert('Please enter a valid countdown time (greater than 0).');
      return;
    }

    //initializes timer
    updateTime(countdownTime);

    //gets timer ending time from storage?
    timerInterval = localStorage.getItem("productivity under the sea");
    
    // Start the countdown
    timerInterval = setInterval(function() {
      if (!isPaused) {
        countdownTime--;
        // Store countdownTime in chrome storage
        chrome.storage.sync.set({ countdownTime: countdownTime });
      }

      if (countdownTime <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);

    timerUpdateInterval = setInterval(function() {
      updateTime(countdownTime);
    })

    // Enable pause button and disable start button
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;
  }

  // Function to pause the countdown timer
  function pauseCountdown() {
    clearInterval(timerInterval);
    isPaused = true;
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = false;
    chrome.storage.local.set({ isRunning: false });
  }

  // Function to reset the countdown timer
  function resetCountdown() {
    clearInterval(timerInterval);
    countdownTime = 0;
    updateTime(countdownTime);
    isPaused = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true; // Disable the reset button after resetting the timer

    // Remove countdownTime from chrome storage
    chrome.storage.sync.remove('countdownTime');
  }

  //helper function to store prev time for resume
    // Function to start the countdown timer after resuming
    function resumeCountdownHelper(remainingTime) {
      countdownTime = remainingTime;
      if (isNaN(countdownTime) || countdownTime <= 0) {
        alert('Invalid countdown time.');
        return;
      }
      updateTime(countdownTime);
      // Start the countdown
      timerInterval = setInterval(function() {
        if (!isPaused) {
          countdownTime--;
          updateTime(countdownTime);
        }
  
        if (countdownTime <= 0) {
          clearInterval(timerInterval);
          // Send a message to the content script
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'startWaterAnimation'});
          });
        }
      }, 1000);
  
    // Function to resume the countdown timer
    function resumeCountdown(remainingTime) {
      isPaused = false;
      resumeCountdownHelper(remainingTime);
    }
  }

  updateTime();
  setInterval(updateTime, 1000);

  //resets the buttons back to default
  resetButton.addEventListener("click", () => {
    chrome.storage.local.set({
      timer: 0,
      isRunning: false,
    }, () => {
      startButton.textContent = "Start Timer"
    })
  })


  //switches between start and pause and sets timer
  startButton.addEventListener("click", () => {
    chrome.storage.local.get(["timer", "isRunning"], (res) => {
      if (isNaN(res.timer) || res.timer <= 0) {
        countdownTime = parseInt(countdownInput.value) * 60;
        const inputTime = countdownTime;
        if (!isNaN(inputTime)) {
          chrome.storage.local.set({ "timer": inputTime });
        }
      }
      setTimer();
      chrome.storage.local.set({
        isRunning: !res.isRunning, 
      }, () => {
        startButton.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"

        console.log("Starting timer! with time: " + countdownInput.value);
        countdownTime = parseInt(countdownInput.value) * 60;
        //starts the water animation w the initial countdown time input
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'startWaterAnimation', parameter: countdownTime});
        });

      })
    })
    
  })
  
  pauseButton.addEventListener('click', pauseCountdown);
  resetButton.addEventListener('click', resetCountdown);
});
  