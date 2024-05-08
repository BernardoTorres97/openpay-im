require('dotenv').config()

const barCodeGenerator = require('./generateBarCode')
const schedule = require('node-schedule')
const { sequelize, gbplus } = require('./db')

let cron = '0 0 15,30 * *'

const express = require('express')
const app = express()
app.use(express.json())
const port = process.env.PORT

let job = schedule.scheduleJob(cron, function () {
  barCodeGenerator.generateAllBarCodes()
})

app.get('/hello', (req, res) => {
  return res.send({ message: 'Hello World!' })
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
  const { NUM_CARGOS_ERROR, NUM_CARGOS_GENERADOS, NUM_CARGOS_SIN_EMAIL } =
    await barCodeGenerator.generateAllBarCodes()

  res.send({
    message: 'Se han generado todos los códigos de barras pendientes',
    NUM_CARGOS_GENERADOS,
    NUM_CARGOS_ERROR,
    NUM_CARGOS_SIN_EMAIL,
  })
})

app.post('/webhook-handler', async (req, res) => {
  const { body } = req

  console.log(body)

  if (body.type === 'charge.succeeded' && body.transaction?.status === 'completed') {
    const payload = {
      tipoEvento: body.type,
      importe: body.transaction?.amount,
      idTransaccion: body.transaction?.id,
      tiempoCreacion: new Date(body.event_date || null)
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19),
    }

    await gbplus.query(`
        INSERT INTO op.eventoOpenpay (tipoEvento, importe, idTransaccion, tiempoPago)
        VALUES ('${payload.tipoEvento}', ${payload.importe}, '${payload.idTransaccion}', '${payload.tiempoPago}')  
      `)
  }

  return res.send({ message: 'ok' })
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
