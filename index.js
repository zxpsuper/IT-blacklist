const trainList = require('./src/Training.js')
const outsourcing = require('./src/Outsourcing.js')
const fs = require('fs')

fs.writeFile('./dist/trainList.json', JSON.stringify(trainList), function (
  err
) {
  if (err) console.log(err)
})

fs.writeFile(
  './dist/outsourcingList.json',
  JSON.stringify(outsourcing),
  function (err) {
    if (err) console.log(err)
  }
)
