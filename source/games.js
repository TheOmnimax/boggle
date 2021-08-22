/**
 * Used to create a game board in a square, with a simple width and height.
 */
class SquareBoard {
  /**
   * @param {int} width Width of the board
   * @param {int} height Height of the board
  */
  constructor(width, height) {
    this.numSpaces = width * height
    this.width = width
    this.height = height
    this.board = [[]] // This will be a grid array, and each element will be of type BoardSpace
  }

  /**
   * Generates a "table" element that will be displayed in the HTML. Saved in "cellGrid" so their look can be changed in the class.
   * @return {Element<table>}
   */
  createBoard () {
    let boardTable = document.createElement('table')
    let boxNum = 0
    this.cellGrid = []
    this.cellList = []
    for (let h = 0; h < this.height; h++) {
      let rowElement = document.createElement('tr')
      for (let w = 0; w < this.width; w++) {
        let cellElement = document.createElement('td')
        cellElement.setAttribute('id', boxNum.toString())
        cellElement.classList.add('table-cell')
        rowElement.appendChild(cellElement)
        boxNum++
        this.cellList.push(cellElement)
      }
      boardTable.appendChild(rowElement)
      let rowCells = rowElement.querySelectorAll('td')
      this.cellGrid.push(rowCells)
    }

    return boardTable
  }

  /**
   * Highlights a single cell in the table
   * @param {Array<number>} coord Coordinates of the cell in the table that should be highlighted.
   * @param {string} className Name of the class that should be applied.
   */
  highlightCell (coord, className = 'highlight') {
    this.cellGrid[coord[0]][coord[1]].classList.add(className)
  }

  /**
   * Remove the highlighting of all the cells.
   * @param {string} className Name of the class that should be applied.
   */
  dehighlightAll (className = 'highlight') {
    for (let cell of this.cellList) {
      cell.classList.remove(className)
    }
  }

  /**
   * @param {Array<Array<number>>} coords Pairs of coordinates that should be highlighted
   * @param {string} className Name of the class that should be applied.
   */
  highlightCells (coords, className = 'highlight') {
    this.dehighlightAll()
    for (let coord of coords) {
      this.highlightCell(coord, className)
    }
  }

}

/**
 * Represents a single space on the board.
 */
class BoardSpace {
  constructor(spaceId, piece) {
    this.connectedSpaces = []
    this.id = spaceId
    if (piece != null) {
      this.assignPiece(piece)
    }
  }

  connectSpace () { // Add space that is connected, to find which ones are adjacent
    let numArgs = arguments.length
    for (let a = 0; a < numArgs; a++) {
      let arg = arguments[a]
      if (arg.constructor.name !== 'BoardSpace') {
        throw 'Parameter ' + String(a) + ' is of type ' + arg.constructor.name + ', not BoardSpace'
      }
      this.connectedSpaces.push(arg)
    }
  } // End connectSpace

  assignPiece (piece) {
    this.name = piece
  }

  assignCoord (row, col) {
    this.row = row
    this.col = col
  }
}

class GamePiece {
  constructor(name) {
    if (name == null) {
      this.used
    }
    this.name = name
  }
}

class Dice {
  constructor(sides) {
    let numArgs = arguments.length

    if (numArgs === 0) {
      throw 'No dice sides given!'
    } else if (numArgs === 1) { // If there is one argument given, that argument needs to be an array, where each item is a dice side
      if (typeof sides === 'string') {
        if (sides.length <= 1) {
          throw 'Not enough dice sides!'
        }
      } else if (!Array.isArray(sides)) {
        throw 'Not enough dice sides!'
      }
    } else { // If there are multiple parameters, each parameter should be a dice side, so turn that into an array for the object
      sides = []
      for (let a = 0; a < numArgs; a++) {
        sides.push(arguments[a])
      }
    }

    this.sides = sides
    this.numSides = sides.length
  }

  roll () {
    let sideNum = Math.floor(Math.random() * this.numSides)
    this.upSide = this.sides[sideNum]
    return this.upSide
  }
}

class NumDice extends Dice { // Standard, numbered die
  constructor(high = 6, low = 1, step = 1) {
    let diceSides = []
    for (let s = low; s <= high; s += step) {
      diceSides.push(s)
    }
    super(diceSides)
  }
}

class DiceBag { // Bag of dice. Arguments should be a series of Dice objects, or an object with a class that extends that
  constructor() {
    this.allDice = []
    if (arguments.length > 0) {
      this.addDice(arguments)
    }
  }
  addDice () {
    let numArgs = arguments.length
    for (let a = 0; a < numArgs; a++) {
      this.allDice.push(arguments[a])
    }
    this.numDice = this.allDice.length
  }

  shuffleDice () { // Change the order of the dice, in case the order needs to be shuffled
    this.allDice = shuffle(this.allDice)
    return this.allDice
  }

  rollDice () { // Roll all dice in the bag
    let rolledDice = []
    for (let dice of this.allDice) {
      rolledDice.push(dice.roll())
    }
    return rolledDice
  }
}


class Player {
  constructor(id) {
    this.id = id
    this.score = 0
  }

  setName (name) {
    this.name = name
  }

  addScore (add) {
    this.score += add
  }
}


function shuffle (array) {
  let arrayLength = array.length
  for (let s = 0; s < arrayLength; s++) {
    let shufflePos = Math.floor(Math.random() * arrayLength)
    array = swapPos(array, s, shufflePos)

  }
  return array
}

function swapPos (array, pos1, pos2) {
  let curPiece = array[pos1]
  array[pos1] = array[pos2]
  array[pos2] = curPiece
  return array
}

function generateNumArray (size) {
  if (size == null) {
    throw 'No size given!'
  }
  return [...Array(size).keys()]
}
