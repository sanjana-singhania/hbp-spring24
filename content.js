//document.addEventListener('DOMContentLoaded', function() {
    const countdownInput = document.getElementById('countdownInput');
    //});
    
    function startWaterAnimation() {
        // Create a div to cover the entire screen
        const wavesContainer = document.createElement('div');
        wavesContainer.classList.add('waves-container');
        
        // Add the overlay to the body
        document.body.appendChild(wavesContainer);
      }
    
    //Listens for messages from the popup
    //and starts water animation
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'startWaterAnimation') {
        startWaterAnimation();
      }
    });
    
    
    /*
      function startWaterAnimation() {
        // Get the countdown input value and convert it to seconds
        const countdownSeconds = parseInt(countdownInput.value) * 60;
    
        // Create a div to cover the entire screen
        const wavesContainer = document.createElement('div');
        wavesContainer.classList.add('waves-container');
    
        // Add the overlay to the body
        document.body.appendChild(wavesContainer);
    }
    /*
    function startWaterAnimation() {
      const wavesContainer = document.querySelector('.waves-container');
      wavesContainer.classList.add('start-animation');
    }
    
    function startWaterAnimation() {
      const wavesContainer = document.querySelector('.waves-container');
      if (wavesContainer) {
        wavesContainer.classList.add('start-animation');
      }
    }*/