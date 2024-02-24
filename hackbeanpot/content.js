//Create the container for the waves
const wavesContainer = document.createElement('div');
wavesContainer.classList.add('waves-container');

//Create three wave elements and append them to the container
for (let i = 0; i < 3; i++) {
  const wave = document.createElement('div');
  wave.classList.add('wave');
  wavesContainer.appendChild(wave);
}

// Append the waves container to the body of the webpage
document.body.appendChild(wavesContainer);
