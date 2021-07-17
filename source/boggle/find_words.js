function wordFinder(lTable, wordDict, wordList) {
  var allWords = []

  let numRows = lTable.length
  let numCols
  for (let r = 0; r < numRows; r++) {
    let row = lTable[r]
    numCols = row.length
    for (let c = 0; c < numCols; c++) {
      let startLetter = row[c]
      console.log('Start letter:', startLetter)
      checkNextLetter(r, c, startLetter, [[r, c]])
    }
  }
  console.log(allWords)
  return allWords

  function checkNextLetter(r, c, builtWord) {
    builtWord = builtWord.toLowerCase()
    // console.log('Built so far:', builtWord)
    if (wordDict[builtWord]) {
      allWords.push(builtWord)
      console.log('Word found:', builtWord)
    } else if (!wordList.includes(builtWord)) {
      return
    }

    let nextLetter

    // Top row
    if (r > 0) {
      if ((c > 0)) {
        nextLetter = lTable[r - 1][c - 1]
        // console.log('Next letter:', nextLetter)
        checkNextLetter(r - 1, c - 1, builtWord + nextLetter)
      }

      nextLetter = lTable[r - 1][c]
      checkNextLetter(r - 1, c, builtWord + nextLetter)

      if (c < numCols - 1) {
        nextLetter = lTable[r - 1][c + 1]
        checkNextLetter(r - 1, c + 1, builtWord + nextLetter)
      }
    }

    // Middle row
    if (c > 0) {
      nextLetter = lTable[r][c - 1]
      checkNextLetter(r, c - 1, builtWord + nextLetter)
    }
    if (c < numCols - 1) {
      nextLetter = lTable[r][c + 1]
      checkNextLetter(r, c, builtWord + nextLetter)
    }

    // Bottom row
    if (r < numRows - 1) {
      if (c > 0) {
        nextLetter = lTable[r + 1][c - 1]
        checkNextLetter(r + 1, c - 1, builtWord + nextLetter)
      }

      nextLetter = lTable[r + 1][c]
      checkNextLetter(r + 1, c, builtWord + nextLetter)

      if (c < numCols - 1) {
        nextLetter = lTable[r + 1][c + 1]
        checkNextLetter(r + 1, c + 1, builtWord + nextLetter)
      }
    }

  }
}