const fs = require('fs')
const path = require('path')

let one = JSON.parse(
  fs.readFileSync(path.join(__dirname, './assets/培训机构名单1.json'), 'utf8')
)
let oneArray = []
for (var i = 0; i < one.length; i++) {
  oneArray.push({
    name: one[i],
    address: '',
    descript: '',
  })
}

let two = fs
  .readFileSync(path.join(__dirname, './assets/培训机构名单2.txt'), 'utf8')
  .split('\r\n\r\n')
let twoArray = []

two.forEach((item) => {
  let t = item.split('\r\n')
  let name = t[0].slice(3)
  let address = t[1].slice(3)
  twoArray.push({
    name: name,
    address,
    descript: '',
  })
})

let map = {}

twoArray.forEach((element) => {
  map[element.name] = true
})

oneArray.forEach((item) => {
  if (!map[item.name]) twoArray.push(item)
})

twoArray.sort(function (a, b) {
  return a.name.localeCompare(b.name)
})

console.log(twoArray)

module.exports = twoArray
