var timer;
var ele = document.getElementById('timer');

//let productive = ['Fishtastic Job!', 'Keep Swimming', '']
//let unproductive = ['Don]

(function () {
  var sec = 0;
  timer = setInterval(() =>{
    ele.innerHTML = '00:'+sec;
    sec++;
    if (sec < 10) {
      sec = "0" + sec;
  }
  }, 1000)
})()

function pause() {
  clearInterval();
}

