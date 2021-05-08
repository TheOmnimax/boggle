const button4 = document.querySelector('#button4')
const button5 = document.querySelector('#button4')
const button6 = document.querySelector('#button4')
const buttonOther = document.querySelector('#button-other')

button4.onclick = function () {
  console.log('Click')
  createTable(4, 4)
}

function createTable(width, height) {
  console.log(width, height)
}