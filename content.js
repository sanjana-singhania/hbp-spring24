//Listens for messages from the popup and starts water animation
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'startWaterAnimation') {
        startWaterAnimation(message.parameter);
    }
  });
  
  function startWaterAnimation(duration) {
  // Create water div to cover the entire screen
  const wavesContainer = document.createElement('div');
  wavesContainer.classList.add('waves-container');
  
  // Fish
  var littleFishImage = new Image();
  littleFishImage.style.width = '70px';
  littleFishImage.style.height = '70px';
  littleFishImage.src = chrome.runtime.getURL('fish.png');
  littleFishImage.classList.add('fish-animate');
  
  // Add the fish to the wavesContainer water
  wavesContainer.appendChild(littleFishImage);
  
  // Add the overlay to the body
  document.body.appendChild(wavesContainer);
  
  updateAnimationDuration(duration);
  
  // Add event listener to check when animation completes
  wavesContainer.addEventListener('animationend', function(event) {
    // Check if the animation is the 'move-up' animation
    if (event.animationName === 'move-up') {
      // Stop the animation by setting height to 100%
      wavesContainer.style.height = '100%';
  
      // Navy blue text box
      var textBox = document.createElement('div');
      textBox.style.position = 'fixed';
      textBox.style.top = '50%';
      textBox.style.left = '50%';
      textBox.style.transform = 'translate(-50%, -50%)';
      textBox.style.backgroundColor = 'rgb(41, 73, 128)';
      textBox.style.padding = '20px';
      textBox.style.width = '60%'; // Set width to 80% of the viewport width
      textBox.style.height = '150px'; // Set height to 200 pixels
      textBox.style.borderRadius = '5px';
      textBox.style.zIndex = '2147483648'; // Set z-index to be behind text message
  
      // Time up message
      var message = document.createElement('div');
      message.textContent = "You're in deep water now! Get back to work!";
      message.style.color = 'white';
      message.style.position = 'fixed';
      message.style.top = '50%';
      message.style.left = '50%';
      message.style.width = '80%';
      message.style.transform = 'translate(-50%, -50%)';
      message.style.zIndex = '2147483649';
      message.style.fontSize = '30px';
      message.style.fontFamily = 'Arial, sans-serif';
      message.style.textAlign = 'center';
      message.style.fontWeight = 'bold';
      message.style.fontStyle = 'italic';
  
      // Append the message to the text box
      textBox.appendChild(message);
  
      // Append the text box to the body
      document.body.appendChild(textBox);
    }
  });
  }
  
  // Function to update animation duration
  function updateAnimationDuration(duration) {
  // Update CSS variable value
  document.documentElement.style.setProperty('--animation-duration', duration + 's');
  }