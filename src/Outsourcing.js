const fs = require('fs')
const path = require('path')

let one = fs
  .readFileSync(path.join(__dirname, './assets/外包公司名单1.txt'), 'utf8')
  .split('\r\n')

let map = {}
one.forEach((item) => {
  map[item] = true
})

module.exports = Object.keys(map).map((item) => {
  let obj = {
    name: item.replace(/\s/g, ''),
    address: '',
    descript: '',
  }
  return obj
})
