chrome.alarms.create("productiveTimer", {
    periodInMinutes: 1/60,
})

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "productiveTimer") {
        chrome.storage.local.get(["timer", "isRunning"], (res) => {
            let timer = res.timer;
            if(res.isRunning) {
                timer = Math.max(res.timer - 1, 0);
            }
            chrome.storage.local.set({
                timer,
                isRunning: res.isRunning,
            })
            console.log(timer);
        })
    }
})

//res is the results object
chrome.storage.local.get(["timer", "isRunning"], (res) => {
    chrome.storage.local.set({
        timer: "timer" in res ? res.timer : 0,
        isRunning: "isRunning" in res ? res.isRunning : false,
    })
})

