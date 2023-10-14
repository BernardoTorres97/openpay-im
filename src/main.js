require('dotenv').config()
const barCodeGenerator = require('./generateBarCode')
const schedule = require('node-schedule')

schedule.scheduleJob('0 0 15,30 * *', function () {
  barCodeGenerator.generateAllBarCodes()
})

barCodeGenerator.generateAllBarCodes()
