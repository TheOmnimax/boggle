onmessage = function (e) {
  let receivedData = e.data
  let board = receivedData[0]
  let wordDict = receivedData[1]
  let wordList = receivedData[2]
  console.log('About to start word finder')
  let foundWords = wordFinder(board, wordDict, wordList)
  console.log(foundWords)
  this.postMessage(foundWords)
}

function wordFinder (board, wordDict, wordList) {
  console.time('Word finder')
  console.log('Starting word finder...')
  let allWords = []
  for (let boardRow of board) {
    for (let boardSpace of boardRow) {
      checkNextLetter('', boardSpace)
    }
  }
  console.log('Found words')
  console.timeEnd('Word finder')
  return allWords

  function checkNextLetter (builtWord, boardSpace) {
    builtWord += boardSpace.name.toLowerCase()
    if (!wordList.includes(',' + builtWord)) {
      return
    } else if (wordDict[builtWord]) {
      allWords.push(builtWord)
    }
    let connectedSpaces = boardSpace.connectedSpaces
    for (let connectSpace of connectedSpaces) {
      checkNextLetter(builtWord, connectSpace)
    }
  } // End checkNextLetter
}
