require('dotenv').config()

const barCodeGenerator = require('./generateBarCode')

barCodeGenerator.generateAllBarCodes(process.argv[2] || null).then((result) => {
  console.log(result)
})
