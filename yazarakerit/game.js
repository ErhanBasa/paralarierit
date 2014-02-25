
var nums = document.querySelector('[data-js="numbers"]'),
    msg = document.querySelector('[data-js="message"]'),
    level = document.querySelector('[data-js="level"]'),
    MAX_LENGTH = 20,
    levelCounter = 1,
    counter = 0,
    inVal = null,
    numVal = "",
    START_BUFFER = 2,
    interval = 2000,
    speed = 10.0,
    intervalID = null,
    message = "",
    MAX_LEVEL = 15;

onkeydown = function(e) {
  if (counter == 0 && e.keyCode == 13) {
     run();
  } else if (counter > START_BUFFER && numVal.length < MAX_LENGTH) {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
      inVal = e.keyCode - 48;
      if (numVal.indexOf(inVal + "") == -1) {
        updateNums();
				        return;
      }
      for (var i = 0; i < numVal.length; i++) {
        numVal = numVal.replace(inVal, "");
      }
      refreshNums();
      checkWin();
    }
  }
}

function run() {
  counter = 0;
  level.innerHTML = "Seviye: " + levelCounter;
  message = "Sabret...";
  refreshMessage();
  intervalID = setInterval("updateNums()", interval);
}

function updateNums() {
  var num = Math.floor(Math.random() * 10);
  numVal += num.toString();
  refreshNums();
  counter++;
  if (counter > START_BUFFER) {
    message = "Erit erit erit!";
    refreshMessage();
  }
  if (numVal.length === MAX_LENGTH) {
    clearInterval(intervalID);
    message = "Kaybettin!";
    refreshMessage();
    		return;
  }
}

function refreshNums() {
  nums.innerHTML = "$ " + numVal;
}

function refreshMessage() {
  msg.innerHTML = message;
}

function checkWin() {
  if (numVal.length === 0) {
    clearInterval(intervalID);
    message = "Hamdolsun bitti!";
    	refreshMessage();
    if (levelCounter < MAX_LEVEL) {
			      levelCounter++;
    	  interval -= interval / speed;
    	  return run();
		    }
		    return;
  }
}