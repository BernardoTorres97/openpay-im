require('dotenv').config()

const barCodeGenerator = require('./generateBarCode')

barCodeGenerator.generateAllBarCodes().then((result) => {
  console.log(result)
})
