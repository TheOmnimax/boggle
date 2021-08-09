class BoggleBoard extends SquareBoard {
  constructor(width, height) {
    super(width, height)
    this.boggleBag = new BoggleBag(this.numSpaces)
    let retrievedLetters = this.boggleBag.pourDice()
    let spaceId = 0
    for (let r = 0; r < height; r++) {
      let row = []
      for (let c = 0; c < width; c++) {
        row[c] = new BoardSpace(spaceId, retrievedLetters[spaceId])
        spaceId++
      }
      this.board[r] = row
    }

    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        let boardSpace = this.board[r][c]
        if (r > 0) {
          if (c > 0) {
            boardSpace.connectSpace(this.board[r - 1][c - 1])
          }
          boardSpace.connectSpace(this.board[r - 1][c])
          if (c < this.width - 1) {
            boardSpace.connectSpace(this.board[r - 1][c + 1])
          }
        }

        if (c > 0) {
          boardSpace.connectSpace(this.board[r][c - 1])
        }
        if (c < this.width - 1) {
          boardSpace.connectSpace(this.board[r][c + 1])
        }

        if (r < this.height - 1) {
          if (c > 0) {
            boardSpace.connectSpace(this.board[r+1][c-1])
          }
          boardSpace.connectSpace(this.board[r+1][c])
          if (c < this.width - 1) {
            boardSpace.connectSpace(this.board[r+1][c+1])
          }
        }
      } // End cycle through each cell in row
    } // End cycle through each row
  } // End constructor
}

class BoggleDice extends Dice { // Single die for Boggle
  static boggleDice = ['AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
    'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
    'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
    'EIOSST', 'ELRTTY', 'HIMNQU', 'HLNNRZ']

  constructor(diceNum) {
    super(BoggleDice.boggleDice[diceNum])
  }
}

class BoggleBag extends DiceBag {
  constructor(numDice) {
    super()
    for (numDice; numDice >= 16; numDice -= 16) {
      this.addDice(...BoggleBag.getSixteenDice())
    }
    this.addDice(...BoggleBag.getRandDice(numDice))
  }

  pourDice() {
    this.shuffleDice()
    return this.rollDice()
  }

  static getSixteenDice() {
    let diceList = []
    for (let d = 0; d < 16; d++) {
      diceList.push(new BoggleDice(d))
    }
    return diceList
  }

  static getRandDice(numDice) { // For fewer than 16 dice, use this to generate the additionally needed dice
    let randInt = shuffle(generateNumArray(16)).slice(0, numDice)
    let diceList = []
    for (let d = 0; d < numDice; d++) {
      diceList.push(new BoggleDice(randInt[d]))
    }
    return diceList
  }
}