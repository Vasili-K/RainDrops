//right side
let state = {
  drop: null,
  answer: null,
  score: 0,
  seaLevel: 0,
  currentNumber1: 0,
  currentNumber2: 0,
  currentOperator: "",
  currentAnswer: 0,
  counter: 0,
  counter1: 0,
  operators: ["+", "-", "*", "/"],
  starTime: 0,
  finishTime: 0,
  gameTime: 0,
  multiplier: 0,
  dropID: 1,
};
const numbers = document.querySelectorAll(".number");
const clearBtns = document.querySelectorAll(".clear_btn");
const resultButton = document.getElementById("result");
const display = document.getElementById("display");
const scoreBoard = document.querySelector(".scoreBoard");
const wavesContainer = document.querySelector(".wavesContainer");
const MemoryCurrentNumber = 0;
let Answer = "m";
let valueScore = 0;
let plusScore = 10;

const applicationContainer = document.querySelector(".application__container");
const fullScreen = applicationContainer.querySelector(".full__screen");

const seaLevel = document.querySelector(".seaLevel");
const leftHalf = document.querySelector(".leftSideWrapper");

let speed = 15000 / 600;

const automaticPlay = document.getElementsByClassName("automaticPlay");
const startPlaying = document.querySelector(".startPlaying");

for (let i = 0; i < numbers.length; i++) {
  let number = numbers[i];
  number.addEventListener("click", function (e) {
    numberPress(e.target.outerText);
  });
}

for (let i = 0; i < clearBtns.length; i++) {
  let clearBtn = clearBtns[i];
  clearBtn.addEventListener("click", function (e) {
    clear(e.srcElement.id);
  });
}
function setScore(valueScore) {
  scoreBoard.innerText = `Score:  ${valueScore}`;
};

function onResultButtons () {
  Answer = +display.value;
  display.value = "";
  if (parseFloat(state["currentAnswer"]) === parseFloat(Answer)) {
    deleteDrop();
    document.querySelector(".bonk").play();
    valueScore = valueScore + plusScore;
    plusScore++;
    state["counter1"]++;
    setScore(valueScore);
    createDrop();
  }
}

function numberPress(number) {
    if (display.value === "") {
      display.value = number;
    } else {
      display.value += number;
    }
}

function clear(id) {
  if (id === "ce") {
    display.value = display.value.substring(0, display.value.length - 1);
  } else if (id === "c") {
    display.value = "";
  }
}

function onResultClick() {
  onResultButtons ();
}

function onResultKeyClick(e) {
  if (e.type === "keypress") {
    if (e.which == 13 || e.keyCode == 13) {
      onResultButtons ();
    }
  }
}

function generator() {
  if (valueScore <= 50) {
    speed = 15000 / 600;
    state["multiplier"] = 10;
  } else if (valueScore > 50 && valueScore <= 120) {
    speed = 10000 / 600;
    state["multiplier"] = 30;
  } else if (valueScore > 120) {
    speed = 5000 / 600;
    state["multiplier"] = 50;
  }

  let numberOne = Math.floor(Math.random() * state["multiplier"]);
  let numberTwo = Math.floor(Math.random() * state["multiplier"]);
  let rand = Math.floor(Math.random() * state["operators"].length);
  let operator = state["operators"][rand];

  state["currentNumber1"] = numberOne;
  state["currentNumber2"] = numberTwo;
  state["currentOperator"] = operator;
  state["currentAnswer"] = getBasicOperators(operator, numberOne, numberTwo);
}

function getBasicOperators(operator, numberOne, numberTwo) {
  switch (operator) {
    case "+":
      return numberOne + numberTwo;
    case "-":
      return numberOne - numberTwo;
    case "*":
      return numberOne * numberTwo;
    case "/":
      return numberOne / numberTwo;
    default:
      return false;
  }
}

function createDrop() {
  document.querySelector(".rainSound").play();
  generator();
  if (
    state["currentNumber1"] > state["currentNumber2"] &&
    state["currentNumber1"] % state["currentNumber2"] == 0
  ) {
    let drop = document.createElement("div");
    drop.id = "drop_" + state["dropID"]++;
    drop.className = "rainDrop";
    drop.innerText =
      state["currentNumber1"] +
      " " +
      state["currentOperator"] +
      " " +
      state["currentNumber2"];
    leftHalf.prepend(drop);
    drop.style.position = "absolute";
    drop.style.top = "1px";
    drop.style.left =
      Math.random() *
        document.querySelector(".leftSideWrapper").clientWidth *
        0.6 +
      "px";

    dropping(drop);
  } else {
    createDrop();
  }
}

function deleteDrop() {
  document.querySelector(".rainDrop").remove();
}

function starNewGame() {
  state["starTime"] = new Date();
  createDrop();
}

function dropping(drop) {
  let appHeight = document.querySelector(".application__container")
    .clientHeight;
  let seaHeight = document.querySelector(".seaLevel").clientHeight;

  if (parseFloat(appHeight) && parseFloat(seaHeight)) {
    let workHeight = appHeight - seaHeight - 60;
    let stopTimer = false;
    let pathWay = 0;
    let timer = setInterval(function () {
      if (stopTimer) return;
      let rainDropTop = drop.offsetTop;
      drop.style.top = rainDropTop + 1 + "px";
      if (pathWay++ >= workHeight) {
        stopTimer = true;
        drop.classList.remove("rainDrop");
        document.querySelector(".shlop").play();
        drop.innerText = "";
        valueScore = valueScore - plusScore;
        setScore(valueScore);
        seaLevel.style.height = seaHeight + 40 + "px";
        state["counter"]++;
        if (state["counter"] < 3) createDrop();
        else {
          seaLevel.style.height = 0 + "px";
          document.querySelector(".rainSound").pause();
          wavesContainer.style.display = "none";
          state["finishTime"] = new Date();
          state["gameTime"] = Math.floor(
            (state["finishTime"] - state["starTime"]) / 1000
          );
          createFinalResult();
          clearInterval(timer); 
        }
      } else if (rainDropTop == 0) {
        stopTimer = true;
      }
    }, speed);
  }
}

function createFinalResult() {
    let gameDuaretion = state["gameTime"];
    let shownAnswers = state["counter1"];
    const finalResult = document.createElement("div");
    finalResult.classList.add("finalResult");
    leftHalf.prepend(finalResult);
    finalResult.insertAdjacentHTML(
      "afterbegin",
      `<div><p><b><font color="red">Score: ${valueScore} &#128142</font></b></p></div> 
      <div><p>Right answers: ${shownAnswers}</p></div> <div>Game Time: ${gameDuaretion}s</div>`
    );
}

function toggleFullscreen() {
  if (isFullScreen()) {
    if (document.exitFullscreen) document.exitFullscreen();
  } else {
    if (applicationContainer.requestFullscreen)
      applicationContainer.requestFullscreen();
  }
}

function isFullScreen() {
  return !!(document.fullScreen || document.webkitIsFullScreen);
}

resultButton.addEventListener("click", onResultClick);
display.addEventListener("keypress", onResultKeyClick);
startPlaying.addEventListener("click", starNewGame);

fullScreen.addEventListener("click", toggleFullscreen);
