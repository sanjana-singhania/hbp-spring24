function saveURLs(urls) {
    chrome.storage.sync.set({ 'userUrls': urls }, function() {
        console.log('User URLs saved:', urls);
    });
}

function getUserUrls(callback) {
    chrome.storage.sync.get('userUrls', function(data) {
        const userUrls = data.userUrls || [];
        console.log('User URLs retrieved:', userUrls);
        if(callback) {
            callback(userUrls);
        }
    })
}

function addUrlToList(url) {
    const urlList = document.getElementById('urlList');
    const listItem = document.createElement('li');
    listItem.textContent = url;
    urlList.appendChild(listItem);
}

document.addEventListener('DOMContentLoaded', function() {
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.getElementById('urlInput');

    getUserUrls(function(userUrls) {
        userUrls.forEach(function(url) {
            addUrlToList(url);
        });
    });

    urlForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const url = urlInput.value.trim();
        if(url) {
            addUrlToList(url);
            getUserUrls(function(userUrls) {
                userUrls.push(url);
                saveURLs(userUrls);
            });
            urlInput.value = '';
        }
    })
})

saveURLs(userinput);

const userCountdown = 60;
let countdownInterval;

function checkURL() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentUrl = tabs[0].url;

        const isMatch = urlList.some(url => currentUrl.includes(url));

        if(isMatch) {
            console.log("Current URL matches");
            startCountdown();
        } else {
            console.log("Current URL does not match");
            pauseCountdown();
        }
    })

}

function beginCounting() {
    let remainingSecs = countdown;
    countdownInterval = setInterval(() => {
        console.log(secondsLeft + " seconds left");
        if(secondsLeft ===  0) {
            clearInterval(countdownInterval);
            console.log("Countdown finished!");
        } else {
            remainingSecs--;
        }
    }, 1000)
}

function pauseCountdown() {
    clearInterval(countdownInterval);
    isCountdownRunning = false;
}

checkURL();

setInterval(checkURL, 1000);

/*
let timerInterval;
let countdownTime = 5 * 60;
function runTimer(mins) {
    const key = "timer";
    localStorage.set(key, mins * 60);
    timerInterval = setInterval(function() {
        console.log("hi");
        if (!isPaused) {
          countdownTime--;
          
  
          // Store countdownTime in chrome storage
          chrome.storage.sync.set({ countdownTime: countdownTime });
        }
  
        if (countdownTime <= 0) {
          clearInterval(timerInterval);
          // Send a message to the content script
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'startWaterAnimation' });
          });
        }
      }, 1000);
}
runTimer(5);

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
    startCountdown();
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

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("received message");
        if (request.type === "GET_TIME_REMAINING") {
            sendResponse({ countdownTime: countdownTime })
        }
    }
  )
*/