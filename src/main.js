require('dotenv').config()

const barCodeGenerator = require('./generateBarCode')
const schedule = require('node-schedule')
let cron = '0 0 15,30 * *'

const express = require('express')
const app = express()
app.use(express.json())
const port = process.env.SERVER_PORT

let job = schedule.scheduleJob(cron, function () {
  barCodeGenerator.generateAllBarCodes()
})

app.post('/set-cron', (req, res) => {
  cron = req.body.cron
  const newJob = job.reschedule(cron)

  if (newJob) return res.send(`Se ha cambiado la expresión cron a "${cron}"`)

  return res.send('Expresión cron inválida')
})

app.post('/generate-bar-code', async (req, res) => {
  try {
    const response = await barCodeGenerator.generateBarCode({
      ...req.body,
      method: 'store',
    })

    res.send(response)
  } catch (error) {
    res.send(error)
  }
})

app.post('/generate-all-bar-codes', async (req, res) => {
  const { NUM_CARGOS_ERROR, NUM_CARGOS_GENERADOS } =
    await barCodeGenerator.generateAllBarCodes()

  res.send({
    message: 'Se han generado todos los códigos de barras pendientes',
    NUM_CARGOS_GENERADOS,
    NUM_CARGOS_ERROR,
  })
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
