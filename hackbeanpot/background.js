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


  