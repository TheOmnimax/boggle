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
      checkNextLetter(r, c, startLetter, [])
    }
  }
  console.log(allWords)
  return allWords

  function checkNextLetter(r, c, builtWord, usedCoord) {
    if(usedCoord.nestedIncludes([r, c])) {
      return
    }
    usedCoord.push([r, c])
    builtWord = builtWord.toLowerCase()
    // console.log('Built so far:', builtWord)
    if (wordDict[builtWord]) {
      allWords.push(builtWord)
      console.log('Word found:', builtWord)
    } else if (!wordList.includes(builtWord)) {
      return
    }

    let nextLetter

    let newR
    let newC

    // Top row
    if (r > 0) {
      newR = r - 1
      newC = c - 1
      if (c > 0) {
        nextLetter = lTable[newR][newC]
        // console.log('Next letter:', nextLetter)
        checkNextLetter(newR, newC, builtWord + nextLetter,usedCoord)
      }

      nextLetter = lTable[newR][c]
      checkNextLetter(newR, c, builtWord + nextLetter, usedCoord)

      newC = c + 1
      if (newC < numCols) {
        nextLetter = lTable[newR][newC]
        checkNextLetter(newR, newC, builtWord + nextLetter, usedCoord)
      }
    }

    // Middle row
    if (c > 0) {
      newC = c - 1
      nextLetter = lTable[r][newC]
      checkNextLetter(r, newC, builtWord + nextLetter, usedCoord)
    }
    newC = c + 1
    if (newC < numCols) {
      nextLetter = lTable[r][newC]
      checkNextLetter(r, newC, builtWord + nextLetter, usedCoord)
    }

    // Bottom row
    newR = r + 1
    if (newR < numRows) {
      if (c > 0) {
        newC = c - 1
        nextLetter = lTable[newR][newC]
        checkNextLetter(newR, newC, builtWord + nextLetter, usedCoord)
      }

      nextLetter = lTable[newR][c]
      checkNextLetter(newR, c, builtWord + nextLetter, usedCoord)

      newC = c + 1
      if (newC < numCols) {
        nextLetter = lTable[newR][newC]
        checkNextLetter(newR, newC, builtWord + nextLetter, usedCoord)
      }
    }
  }
}