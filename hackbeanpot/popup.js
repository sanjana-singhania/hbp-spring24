document.addEventListener('DOMContentLoaded', function() {
  // Select DOM elements
  const countdownInput = document.getElementById('countdownInput');
  const startButton = document.getElementById('startButton');
  const pauseButton = document.getElementById('pauseButton');
  const resetButton = document.getElementById('resetButton'); // Select the reset button
  const timerDisplay = document.getElementById('timer');

  let productive = ['Fish-tastic Job!', 'Keep Swimming', 'You(\'re) really fish-tastic!',
'I sea you working...', 'A true ocean master!', 'You(\'re) such a starfish!']
let unproductive = ['Don(\'t) forget about your fish!', 'Oh, barnacles.',
 'I don(\'t) sea you working hard', 'I(\'m) getting flooded...', ':(((', 'Wrong tab!']

function chooseMessage() {
  let num = Math.floor(Math.random() * 6)
  if(urlList.some(url => currentUrl.includes(url))) {
    return productive[num];
  } else {
    return unproductive[num];
  }
  
}


  let timerInterval; // Variable to hold the setInterval ID
  let countdownTime; // Variable to hold the remaining countdown time
  let isPaused = false; // Variable to track pause state

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
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'startWaterAnimation'});
        });
      }
    }, 1000);

    // Enable pause button and disable start button
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;
  }

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
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'startWaterAnimation'});
        });
      }
    }, 1000);

    // Enable pause, reset buttons and disable start button
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

  // Function to resume the countdown timer
  function resumeCountdown(remainingTime) {
    isPaused = false;
    resumeCountdownHelper(remainingTime);
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
  }

  // Event listeners
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