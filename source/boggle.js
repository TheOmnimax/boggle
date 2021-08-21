const buttonContainer = document.querySelector('#start-buttons')
const button4 = buttonContainer.querySelector('#button4')
const button5 = buttonContainer.querySelector('#button5')
const button6 = buttonContainer.querySelector('#button6')
const buttonOther = buttonContainer.querySelector('#button-other')
const other1 = buttonContainer.querySelector('#other1')
const other2 = buttonContainer.querySelector('#other2')
const gameBoard = document.querySelector('#game-board')
const boggleContainer = gameBoard.querySelector('#boggle-container')
const boggleTableContainer = boggleContainer.querySelector('#boggle-table')
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

const showWordsButton = document.querySelector('#show-all')

const wordInput = document.querySelector('#enter-words')
const findButton = document.querySelector('#find-words')

var boggleBoard
var boggleTable

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
  wordList = ',' + txt

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
showWordsButton.onclick = function () {
  if (boggleBoard == null) {
    showPopup('I mean, there\'s no board yet, so...', 'Huh?')
  } else if (Object.keys(boggleBoard.allWords).length === 0) {
    let button1 = getCloseButton(closeText = 'Oh, alright.')
    showPopup('The word list is still being built. Please wait a few more seconds.', 'Still working', button1)
  } else {
    let button1 = getCloseButton(closeText = 'No')

    let button2 = document.createElement('button')
    button2.appendChild(document.createTextNode('Yes'))
    button2.onclick = function () {
      closePopup()
      showWordsButton.style.display = 'none'
      let wordElements = createFoundDisp(allWords)
      for (let e of wordElements) {
        showAllContainer.appendChild(e)
      }
    }

    showPopup('Are you sure you would like to show all possible words on this board?', 'Show all words', [button1, button2])
  }

}

wordInput.addEventListener('input', function (e) {
  let inputType = e.inputType
  if ((inputType === 'insertLineBreak') || ((e.data == null) && (inputType === 'insertText'))) {
    wordInput.value = wordInput.value.replace('\n', '')
    findWords()
  }
})

setTime()
setInterval(timer, 1)

function setTime () {
  timeRemaining = timeInput.value
  timeLeftContainer.innerHTML = timeRemaining
  startTime = timeRemaining * 1000
}

function startGame (width, height) {
  boggleBoard = new BoggleBoard(width, height)
  createTable()
  findButton.innerText = 'Working...'
  showWordsButton.innerText = 'Working...'
}

function createTable () {
  boggleBoard.rollDice()
  boggleBoard.connectSpaces()
  boggleBoard.findAllWords(wordDict, wordList)

  buttonContainer.style.display = 'none'
  boggleContainer.style.display = 'inline'
  removeAllChildNodes(boggleTableContainer)

  boggleTable = boggleBoard.createBoard()
  boggleTableContainer.appendChild(boggleTable)
  hideLetters()

  startButton.style.display = 'inline'
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
  var letters = boggleBoard.letterList
  var numLetters = letters.length
  for (var c = 0; c < numLetters; c++) {
    let letter = letters[c]
    let cell = allCells[c]
    cell.innerHTML = letter
  }
}

function hideLetters () {
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

  if ((allWords == null) && (boggleBoard != null)) {
    if (Object.keys(boggleBoard.allWords).length > 0) {
      allWords = boggleBoard.allWords
      findButton.innerText = 'Find'
      showWordsButton.innerText = 'Show all'
    }
  }
}

function getCloseButton (closeText = 'Close') {
  let closeButton = document.createElement('button')
  closeButton.appendChild(document.createTextNode(closeText))
  closeButton.onclick = closePopup
  return closeButton
}

function closePopup () {
  popupModule.style.display = 'none'
}

function showPopup (popupText, header = 'Warning', buttons = []) {
  if (buttons.length === 0) {
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

function checkWord (word) {
  if (word in allWords) {
    return allWords[word]
  } else {
    return []
  }
}

function createFoundDisp (obj) {
  let elementList = []
  for (let key in obj) {
    let wordP = document.createElement('p')
    wordP.classList.add('word')
    wordP.appendChild(document.createTextNode(key + ': ' + String(BoggleBoard.scoreWord(key))))
    wordP.onclick = function () {
      boggleBoard.highlightCells(obj[key])
    }
    elementList.push(wordP)
  }
  return elementList
}

function createRejectedDisp (obj) {
  return Object.entries(obj).map(x => String(x[0]) + ': ' + x[1]).join('<br>')
}

function findWords () { // Called by button
  if (boggleBoard == null) {
    showPopup('I mean, there\'s no board yet, so you can\'t really find words yet.', 'No board yet')
  } else if (allWords == null) {
    showPopup('Still loading the word list. Please wait...', 'Still loading')
  } else {
    let rawWordData = wordInput.value
    let wordList = rawWordData.split(/[, ]+/g)
    for (let word of wordList) {
      if (word.length === 0) {
        continue
      }
      let coord = checkWord(word)
      if (!checkWordExists(word)) {
        if (!(word in rejectedWords)) {
          rejectedWords[word] = 'Does not exist'
        }
      } else if (coord.length === 0) {
        if (!(word in rejectedWords)) {
          rejectedWords[word] = 'Not found'
        }
      } else {
        if (!(word in foundWords)) {
          foundWords[word] = coord
        }
      }
    }

    removeAllChildNodes(foundContainer)
    let foundList = createFoundDisp(foundWords)
    for (let f of foundList) {
      foundContainer.appendChild(f)
    }

    rejectedContainer.innerHTML = createRejectedDisp(rejectedWords)
  }
  wordInput.value = ''
  wordInput.focus()
}

function checkWordExists (word) {
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

function removeAllChildNodes (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}