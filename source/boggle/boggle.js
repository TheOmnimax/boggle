const buttonContainer = document.querySelector('#start-buttons')
const button4 = buttonContainer.querySelector('#button4')
const button5 = buttonContainer.querySelector('#button5')
const button6 = buttonContainer.querySelector('#button6')
const buttonOther = buttonContainer.querySelector('#button-other')
const other1 = buttonContainer.querySelector('#other1')
const other2 = buttonContainer.querySelector('#other2')
const gameBoard = document.querySelector('#game-board')
const boggleContainer = gameBoard.querySelector('#boggle-container')
const boggleTable = boggleContainer.querySelector('#boggle-table')
const startButton = gameBoard.querySelector('#start-button')
const timeInput = document.querySelector('#time-input')
const timeLeftContainer = document.querySelector('#time-left')
const setTimeButton = document.querySelector('#set-time')

const warningsContainer = document.querySelector('#warnings')
const popupModule = document.querySelector('#popup')
const popupHeaderContainer = document.querySelector('#popup-header')
const popupTextContainer = document.querySelector('#popup-text')
const closePopupButton = document.querySelector('#close-popup')

const availableDice = ['AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
'EIOSST', 'ELRTTY', 'HIMNQU', 'HLNNRZ'] // https://stanford.edu/class/archive/cs/cs106x/cs106x.1132/handouts/17-Assignment-3-Boggle.pdf

var tableData = {}
var letterTable = [[]]

var gameRunning = false
var timeStart // The Unix time the timer started
var startTime // The time remaining when the timer was last puased
var timeRemaining

button4.onclick = function () {
  createTable(4, 4)
}
button5.onclick = function () {
  createTable(5, 5)
}
button6.onclick = function () {
  createTable(6, 6)
}
buttonOther.onclick = function () {
  let val1 = other1.value
  let val2 = other2.value
  if ((val1 == '') || val2 == '') {
    return
  }

  if (!isNaN(val2) && !isNaN(val2)) {
    createTable(parseInt(val1), parseInt(val2))
  }
  
}
startButton.onclick = startPauseGame
setTimeButton.onclick = function () {
  if(gameRunning) {
    showPopup('Cannot set time while timer is running.')
  } else {
    setTime()
  }
}

setTime()
setInterval(timer, 1)

function setTime () {
  timeRemaining = timeInput.value
  timeLeftContainer.innerHTML = timeRemaining
  startTime = timeRemaining * 1000
}

function shuffleDice() {
  var theseDice = availableDice
  for (let d = 0; d < 16; d++) {
    let rand16 = Math.floor(Math.random() * 16)
    let dice1 = theseDice[d]
    let dice2 = theseDice[rand16]
    theseDice[rand16] = dice1
    theseDice[d] = dice2
  }
  return theseDice
}

function getLetters(numLetters) {
  var dice = []
  var lettersNeeded = numLetters
  var letters = []
  while (lettersNeeded >= 16) {
    dice = dice.concat(shuffleDice())
    lettersNeeded -= 16
  }
  var otherDice = shuffleDice().slice(0, lettersNeeded)
  dice = dice.concat(otherDice)
  // console.log(dice)
  for (cube of dice) {
    var rand6 = Math.floor(Math.random() * 6)
    var addLetter = cube[rand6]
    if (addLetter === 'Q') addLetter = 'Qu'
    letters.push(addLetter)
  }
  return letters
}

function createTable(width, height) {
  console.log(width, height)
  tableData.width = width
  tableData.height = height

  buttonContainer.style.display = 'none'
  boggleContainer.style.display = 'inline'
  boggleTable.innerHTML = ''

  var letters = getLetters(width * height)
  tableData.letters = letters

  var boxNum = 0
  for (let h = 0; h< height; h++) {
    let rowHtml = '<tr>\n'
    let letterRow = []
    for (let w = 0; w < width; w++) {
      rowHtml += '<td id="' + boxNum.toString() + '" class="table-cell">&#11044;</td>\n'
      letterRow[w] = letters[boxNum]
      boxNum++
    }
    rowHtml += '</tr>\n'
    boggleTable.innerHTML += rowHtml
    letterTable[h] = letterRow
  }
  startButton.style.display = 'inline'
}

function runGame() {
  showLetters()
  timeStart = Date.now()
  gameRunning = true
}

function startPauseGame () {
  if (gameRunning) {
    gameRunning = false
    startTime = timeRemaining
    hideLetters()
    startButton.innerHTML = 'Continue'
  } else {
    showLetters()
    timeStart = Date.now()
    startButton.innerHTML = 'Pause'
    gameRunning = true
  }
}

function showLetters () {
  var allCells = document.querySelectorAll('.table-cell')
  var letters = tableData.letters
  var numLetters = letters.length
  for (var c = 0; c < numLetters; c++) {
    let letter = letters[c]
    let cell = allCells[c]
    cell.innerHTML = letter
  }
}

function hideLetters() {
  var allCells = document.querySelectorAll('.table-cell')
  var numCells = allCells.length
  for (var c = 0; c < numCells; c++) {
    let cell = allCells[c]
    cell.innerHTML = '⬤'
  }
}

function timer() {
  if (gameRunning) {
    var timePassed = Date.now() - timeStart
    timeRemaining = startTime - timePassed
    timeLeftContainer.innerHTML = Math.ceil(timeRemaining / 1000)
    if (timeRemaining < 0) {
      timeRemaining = 0
      startButton.style.display = 'None'
      gameRunning = false
      hideLetters()
      showPopup('Time\'s up, pencils down! Click the button to check your answers.', 'Time\'s up!', showLetters)
    }
  }
}

function closePopup () {
  popupModule.style.display = 'none'
}

function showPopup(popupText, header='Warning', ...doFunctions) {
  popupModule.style.display = 'inline-block'
  popupTextContainer.innerHTML = popupText
  popupHeaderContainer.innerHTML = header
  closePopupButton.onclick = function () {
    for (df of doFunctions) {
      df()
    }
    closePopup()
  }
  
}

function checkWord(word) {
  word = word.toUpperCase()
  var startLetter = word[0]
  var numRows = letterTable.length
  

  for (let r = 0; r < numRows; r++) {
    let row = letterTable[r]
    let c = row.indexOf(startLetter)
    let qAdd = 0
    if (c !== -1) {
      if (startLetter === 'Q') {
        if (word[1] === 'U') {
          qAdd = 1
        } else {
          return false
        }
      }
      if(findNextLetter(r, c, word.substr(1 + qAdd), [[r, c]])) {
        return true
      }
    }
  }
  return false

  function checkLetter(row, col, remaining, usedC) {
    console.log('At (' + String(row) + ',' + String(col) + ')')
    if (usedC.nestedIncludes([row, col])) {
      console.log('Used already')
      return false
    }

    if ((row < 0) || (col < 0) || (row >= tableData.width) || (col >= tableData.height)) {
      console.log('Out of range')
      return false
    }
    var findLetter = remaining[0]
    console.log('Looking for:', findLetter)
    let checkLetter = letterTable[row][col]
    console.log('Checking against:', checkLetter)
    if (findLetter === checkLetter) {
      console.log('Match!')
      let newUC = [...usedC]
      newUC.push([row, col])
      console.log('New list:', newUC)
      return findNextLetter(row, col, remaining.substr(1), newUC)
    } else if (remaining.substr(0, 2) === checkLetter.toUpperCase()) { // For Qu
      let newUC = [...usedC]
      newUC.push([row, col])
      console.log('New list:', newUC)
      return findNextLetter(row, col, remaining.substr(2), newUC)

    }
    return false
  }

  function findNextLetter(row, col, remaining, usedCoord) {
    if (remaining === '') {
      return true
    }
  
    if (checkLetter(row - 1, col - 1, remaining, usedCoord)) {
      return true
    }
    if (checkLetter(row - 1, col, remaining, usedCoord)) {
      return true
    }
    if (checkLetter(row - 1, col + 1, remaining, usedCoord)) {
      return true
    }
    if (checkLetter(row, col - 1, remaining, usedCoord)) {
      return true
    }
    if (checkLetter(row, col + 1, remaining, usedCoord)) {
      return true
    }
    if (checkLetter(row + 1, col - 1, remaining, usedCoord)) {
      return true
    }
    if (checkLetter(row + 1, col, remaining, usedCoord)) {
      return true
    }
    if (checkLetter(row + 1, col + 1, remaining, usedCoord)) {
      return true
    }
    return false
  }

}

// Should update later for more nested, but not needed for this project
Array.prototype.nestedIncludes = function (checkArray) {
  if (typeof checkArray !== 'object') {
    return false
  } else {
    let arrayLen = this.length
    for (let i = 0; i < arrayLen; i++) {
      let item = this[i]
      let itemLen = item.length
      let isMatch = true
      for (let l = 0; l < itemLen; l++) {
        if (item[l] !== checkArray[l]) {
          isMatch = false
          break
        }
      }
      if (isMatch) {
        return true
      }
    }
    return false
  }
}
