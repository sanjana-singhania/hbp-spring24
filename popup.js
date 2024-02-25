
var listURL = document.getElementById("blockedURL");

document.addEventListener('DOMContentLoaded', function() {
  // Select DOM elements
  const countdownInput = document.getElementById('countdownInput');
  const startButton = document.getElementById('startButton');
  const pauseButton = document.getElementById('pauseButton');
  const resetButton = document.getElementById('resetButton');
  const timerDisplay = document.getElementById('timer');

  let productive = ['Fish-tastic job!', 'Keep swimming', `You're really fish-tastic!`,
  'I sea you working...', 'A true ocean master!', `You're such a starfish!`]
  let unproductive = ['Oh, barnacles.',
  `I don't sea you working hard.`, `I'm getting flooded...`, 'Your fish are gonna drown!', 
  `Someone's finally taking a shower...`, 'Make more waves with your productivity']

  // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  //   console.log(response.farewell);
  // })

  function chooseMessage() {
    let num = Math.floor(Math.random() * 6)
    console.log(listURL);
    if(listURL == null) {
      return productive[num];
    }
    if (listURL.some(url => listURL.includes(url))) {
      return unproductive[num];
    } else {
      return productive[num];
    }
  }

  const chosenMessageText = document.getElementById('chosenMessage');
  chosenMessageText.innerText = chooseMessage();

  let timerInterval; // Variable to hold the setInterval ID
  let countdownTime; // Variable to hold the remaining countdown time
  let isPaused = false; // Variable to track pause state
  let key = "interval fish's";

  // Function to update the timer display
  function updateTimer(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    timerDisplay.textContent = formattedTime;
  }

  // Function to start the countdown timer
  function startCountdown() {
    countdownTime = parseInt(countdownInput.value) * 60;
    if (isNaN(countdownTime) || countdownTime <= 0) {
      alert('Please enter a valid countdown time (greater than 0).');
      return;
    }

    //starts the water animation w the initial countdown time input
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'startWaterAnimation', parameter: countdownTime});
    });

    //initializes timer
    updateTimer(countdownTime);

    //gets timer ending time from storage?
    timerInterval = localStorage.getItem(key);
    
    // Start the countdown
    timerInterval = setInterval(function() {
      console.log("hi");
      if (!isPaused) {
        countdownTime--;
        // Store countdownTime in chrome storage
        chrome.storage.sync.set({ countdownTime: countdownTime });
      }

      if (countdownTime <= 0) {
        clearInterval(timerInterval);
        // // Send a message to the content script
        // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        //   chrome.tabs.sendMessage(tabs[0].id, { action: 'startWaterAnimation' });
        // });
      }
    }, 1000);

    timerUpdateInterval = setInterval(function() {
      updateTimer(countdownTime);
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
  }

  //helper function to store prev time for resume
  // Function to start the countdown timer after resuming
  function resumeCountdownHelper(remainingTime) {
    countdownTime = remainingTime;
    if (isNaN(countdownTime) || countdownTime <= 0) {
      alert('Invalid countdown time.');
      return;
    }
    updateTimer(countdownTime);
    // Start the countdown
    timerInterval = setInterval(function() {
      if (!isPaused) {
        countdownTime--;
        updateTimer(countdownTime);
      }

      if (countdownTime <= 0) {
        clearInterval(timerInterval);
        // Send a message to the content script
        //TODO: send a new "resumeWaterAnimation" message
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

  // Function to reset the countdown timer
  function resetCountdown() {
    clearInterval(timerInterval);
    countdownTime = 0;
    updateTimer(countdownTime);
    isPaused = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true; // Disable the reset button after resetting the timer

    // Remove countdownTime from chrome storage
    chrome.storage.sync.remove('countdownTime');
  }

  startButton.addEventListener('click', function() {
    if (isPaused) {
      resumeCountdown(countdownTime);
    } else {
      startCountdown();
    }
  });
  pauseButton.addEventListener('click', pauseCountdown);
  resetButton.addEventListener('click', resetCountdown);


});



