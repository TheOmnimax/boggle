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
  let allWords = new Object()
  for (let boardRow of board) {
    for (let boardSpace of boardRow) {
      checkNextLetter('', boardSpace, [boardSpace], [boardSpace.id])
    }
  }
  console.log('Found words')
  console.timeEnd('Word finder')
  return allWords

  function checkNextLetter (builtWord, boardSpace, spaceList, idList) {
    builtWord += boardSpace.name.toLowerCase()
    if (!wordList.includes(',' + builtWord)) {
      return
    } else if (wordDict[builtWord] && !(builtWord in allWords)) {
      let coords = []
      for (let space of spaceList) {
        coords.push([space.row, space.col])
      }
      allWords[builtWord] = coords
    }
    let connectedSpaces = boardSpace.connectedSpaces
    for (let connectSpace of connectedSpaces) {
      if (!idList.includes(connectSpace.id)) {
        let newSpaceList = spaceList.slice()
        newSpaceList.push(connectSpace)
        let newIdList = idList.slice()
        newIdList.push(connectSpace.id)
        checkNextLetter(builtWord, connectSpace, newSpaceList, newIdList)
      }
    }
  } // End checkNextLetter
}
