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
const popupButtonContainer = document.querySelector('#popup-buttons')

const foundContainer = document.querySelector('#found-list')
const rejectedContainer = document.querySelector('#rejected-list')
const showAllContainer = document.querySelector('#all-list')

const wordInput = document.querySelector('#enter-words')
const findButton = document.querySelector('#find-words')

const wfWorker = new Worker('find_words.js')

const availableDice = ['AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
  'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
  'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
  'EIOSST', 'ELRTTY', 'HIMNQU', 'HLNNRZ'] // https://stanford.edu/class/archive/cs/cs106x/cs106x.1132/handouts/17-Assignment-3-Boggle.pdf

// https://johnresig.com/blog/dictionary-lookups-in-javascript/
var wordDict = {}
var wordList
$.get("word_list.txt", function (txt) {
  // Get an array of all the words
  var words = txt.split(',');
  wordList = txt

  // And add them as properties to the dictionary lookup
  // This will allow for fast lookups later
  for (var i = 0; i < words.length; i++) {
    wordDict[words[i]] = true;
  }

  // The game would start after the dictionary was loaded
  // startGame();
})

var tableData = {}
var letterTable = [[]]

var gameRunning = false
var timeStart // The Unix time the timer started
var startTime // The time remaining when the timer was last puased
var timeRemaining

var foundWords = {}
var rejectedWords = {}
var allWords // Will eventually store all words that could have been used

button4.onclick = function () {
  startGame(4, 4)
}
button5.onclick = function () {
  startGame(5, 5)
}
button6.onclick = function () {
  startGame(6, 6)
}
buttonOther.onclick = function () {
  let val1 = other1.value
  let val2 = other2.value
  if ((val1 == '') || val2 == '') {
    return
  }

  if (!isNaN(val2) && !isNaN(val2)) {
    startGame(parseInt(val1), parseInt(val2))
  }

}
startButton.onclick = startPauseGame
setTimeButton.onclick = function () {
  if (gameRunning) {
    showPopup('Cannot set time while timer is running.')
  } else {
    setTime()
  }
}
findButton.onclick = findWords
document.querySelector('#show-all').onclick = function () {
  if (allWords == null) {
    let button1 = getCloseButton(closeText = 'Aw, man!')
    showPopup('Nice try, but you can\'t show all words until time runs out.', 'No cheating!', button1)
  } else {
    let button1 = getCloseButton(closeText = 'No')

    let button2 = document.createElement('button')
    button2.appendChild(document.createTextNode('Yes'))
    button2.onclick = function () {
      closePopup()
      showAllContainer.innerHTML = Object.keys(allWords).join('<br>')
    }
  
    showPopup('Are you sure you would like to show all possible words on this board?', 'Show all words', [button1, button2])
  }
  
}

wordInput.addEventListener('input', function (e) {
  let inputType = e.inputType
  if ((inputType === 'insertLineBreak') || ((e.data == null) && (inputType === 'insertText'))) {
    wordInput.value = wordInput.value.replace('\n', '')
    findWords()
    wordInput.focus()
  }
})

wfWorker.onmessage = function (e) {
  allWords = e.data
}

setTime()
setInterval(timer, 1)

function setTime() {
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

function startGame(width, height) {
  console.log('Starting game')
  createTable(width, height)
  wfWorker.postMessage([letterTable, wordDict, wordList])
}

function createTable(width, height) {
  tableData.width = width
  tableData.height = height

  buttonContainer.style.display = 'none'
  boggleContainer.style.display = 'inline'
  boggleTable.innerHTML = ''

  var letters = getLetters(width * height)
  tableData.letters = letters

  var boxNum = 0
  for (let h = 0; h < height; h++) {
    let rowElement = document.createElement('tr')

    let letterRow = []
    for (let w = 0; w < width; w++) {
      let cellElement = document.createElement('td')
      cellElement.setAttribute('id', boxNum.toString())
      cellElement.classList.add('table-cell')
      cellElement.appendChild(document.createTextNode(String.fromCharCode(11044)))
      rowElement.appendChild(cellElement)
      letterRow[w] = letters[boxNum]
      boxNum++
    }
    boggleTable.appendChild(rowElement)
    letterTable[h] = letterRow
  }
  startButton.style.display = 'inline'
  console.log(boggleTable.innerHTML)
}

function startPauseGame() {
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

function showLetters() {
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
    cell.innerHTML = '&#11044;'
  }
}

function timer () {
  if (gameRunning) {
    var timePassed = Date.now() - timeStart
    timeRemaining = startTime - timePassed
    timeLeftContainer.innerHTML = Math.ceil(timeRemaining / 1000)
    if (timeRemaining < 0) {
      timeRemaining = 0
      startButton.style.display = 'None'
      gameRunning = false
      hideLetters()

      let button1 = document.createElement('button')
      button1.appendChild(document.createTextNode('Close'))
      button1.onclick = function () {
        closePopup()
        showLetters()
      }
      showPopup('Time\'s up, pencils down! Click the button to check your answers.', 'Time\'s up!', button1)
    }
  }
}

function getCloseButton(closeText = 'Close') {
  let closeButton = document.createElement('button')
  closeButton.appendChild(document.createTextNode(closeText))
  closeButton.onclick = closePopup
  return closeButton
}

function closePopup() {
  popupModule.style.display = 'none'
}

function showPopup(popupText, header = 'Warning', buttons = []/* ...doFunctions*/) {
  if (buttons === []) {
    let button = document.createElement('button')
    button.appendChild(document.createTextNode('Close'))
    button.onclick = closePopup
    buttons = [button]
  }

  removeAllChildNodes(popupButtonContainer)
  if (Array.isArray(buttons)) {
    for (let button of buttons) {
      popupButtonContainer.appendChild(button)
    }
  } else {
    popupButtonContainer.appendChild(buttons)
  }

  popupModule.style.display = 'inline-block'
  popupTextContainer.innerText = popupText
  popupHeaderContainer.innerText = header
}

function checkWord(word) {
  word = word.toUpperCase()
  var startLetter = word[0]
  let qAdd = 0
  if (startLetter === 'Q') {
    if (word[1] === 'U') {
      startLetter = 'Qu'
      qAdd = 1
    } else {
      return false
    }
  }
  let numRows = tableData.height
  let numCols = tableData.width

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      let workingLetter = letterTable[r][c]
      if (workingLetter === startLetter) {
        let foundSet = findNextLetter(r, c, word.substr(1 + qAdd), [[r, c]])
        if (foundSet !== false) {
          return foundSet
        }
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
      return usedCoord
    }

    let checkReturn

    checkReturn = checkLetter(row - 1, col - 1, remaining, usedCoord)
    if (checkReturn !== false) return checkReturn

    checkReturn = checkLetter(row - 1, col, remaining, usedCoord)
    if (checkReturn !== false) return checkReturn

    checkReturn = checkLetter(row - 1, col + 1, remaining, usedCoord)
    if (checkReturn !== false) return checkReturn

    checkReturn = checkLetter(row, col - 1, remaining, usedCoord)
    if (checkReturn !== false) return checkReturn

    checkReturn = checkLetter(row, col + 1, remaining, usedCoord)
    if (checkReturn !== false) return checkReturn

    checkReturn = checkLetter(row + 1, col - 1, remaining, usedCoord)
    if (checkReturn !== false) return checkReturn

    checkReturn = checkLetter(row + 1, col, remaining, usedCoord)
    if (checkReturn !== false) return checkReturn

    checkReturn = checkLetter(row + 1, col + 1, remaining, usedCoord)
    if (checkReturn !== false) return checkReturn

    /*if (checkLetter(row - 1, col - 1, remaining, usedCoord)) {
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
    }*/
    return false
  }
}

function createLbList(obj) {
  return Object.entries(obj).map(x => String(x[0]) + ': ' + String(x[1])).join('<br>')
}

function findWords() { // Called by button
  let rawWordData = wordInput.value
  let wordList = rawWordData.split(/[, ]+/g)
  for (let word of wordList) {
    let coord = checkWord(word)
    if (coord === false) {
      if (!(word in rejectedWords)) {
        rejectedWords[word] = 'Not found'
      }
    } else if (!checkWordExists(word)) {
      if (!(word in rejectedWords)) {
        rejectedWords[word] = 'Does not exist'
      }
    } else {
      if (!(word in foundWords)) {
        foundWords[word] = coord
      }
    }
  }

  foundContainer.innerHTML = createLbList(foundWords)
  rejectedContainer.innerHTML = createLbList(rejectedWords)
}

function checkWordExists(word) {
  if (wordDict[word]) {
    return true
  } else {
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

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}