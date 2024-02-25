//Listens for messages from the popup
//and starts water animation
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'startWaterAnimation') {
      //if (message.parameter) {
        startWaterAnimation(message.parameter);
      //} else {
      //default val for testing 
      //startWaterAnimation(30);
      //}
    }
  });

function startWaterAnimation(duration) {
  // Create a div to cover the entire screen
  const wavesContainer = document.createElement('div');
  wavesContainer.classList.add('waves-container');

  // const fishImage = new Image();
  // fishImage.src = `'orca.png'`;
  // fishImage.classList.add('fish-animate');
  // wavesContainer.appendChild(fishImage);
  
  
  
  //Set the animation name
  // wavesContainer.style.animationName = 'move-up';
  // //Set the animation duration based on the countdown parameter
  // wavesContainer.style.animationDuration = '5s';
  // wavesContainer.style.animationTimingFunction = 'linear';
  
  // Add the overlay to the body
  document.body.appendChild(wavesContainer);

  updateAnimationDuration(duration);

}

// Function to update animation duration
function updateAnimationDuration(duration) {
  // Update CSS variable value
  document.documentElement.style.setProperty('--animation-duration', duration + 's');
}