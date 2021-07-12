const buttonContainer = document.querySelector('#buttons')
const button4 = buttonContainer.querySelector('#button4')
const button5 = buttonContainer.querySelector('#button5')
const button6 = buttonContainer.querySelector('#button6')
const buttonOther = buttonContainer.querySelector('#button-other')
const other1 = buttonContainer.querySelector('#other1')
const other2 = buttonContainer.querySelector('#other2')
const gameBoard = document.querySelector('#game-board')
const boggleTable = document.querySelector('#boggle-table')

const availableDice = ['AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
'EIOSST', 'ELRTTY', 'HIMNQU', 'HLNNRZ'] // https://stanford.edu/class/archive/cs/cs106x/cs106x.1132/handouts/17-Assignment-3-Boggle.pdf


createTable(6, 6)

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
  gameBoard.style.display = 'inline'

  var letters = getLetters(width * height)

  var boxNum = 0
  for (let h = 0; h< height; h++) {
    let rowHtml = '<tr>\n'
    for (let w = 0; w < width; w++) {
      rowHtml += '<td id="' + boxNum.toString() + '">' + letters[boxNum] + '</td>\n'
      boxNum++
    }
    rowHtml += '</tr>\n'
    boggleTable.innerHTML += rowHtml
  }
}
