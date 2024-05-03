const Openpay = require('openpay')
const { sequelize, gbplus } = require('./db')
const pdf = require('html-pdf')

const report = require('./report')

const openpay = new Openpay(process.env.MERCHANT_ID, process.env.PRIVATE_KEY)

let NUM_CARGOS_GENERADOS = 0
let NUM_CARGOS_ERROR = 0
let NUM_CARGOS_SIN_EMAIL = 0

async function registerCharge(payload) {
  try {
    await gbplus.query(`
      INSERT INTO op.pagoAdeudo (folioInterno, idOrden, montoPagar, tiempoCreacion, urlCodigoBarras, idTransaccionOP, urlPdf, referencia)
      VALUES ('${payload.folioInterno}', ${payload.idOrden}, ${payload.montoPagar}, '${
      payload.tiempoCreacion
    }', 
      '${payload.urlCodigoBarras.split('?')[0]}', '${payload.idTransaccionOP}', '${
      payload.urlPdf
    }', '${payload.referencia}')
    `)
  } catch (error) {
    throw new Error(error)
  }
}

async function getBarCode(chargePayload) {
  return new Promise((resolve, reject) => {
    try {
      openpay.charges.create(chargePayload, (error, body) => {
        if (error) {
          NUM_CARGOS_ERROR += 1
          return reject(error)
        }
        console.log(body)

        NUM_CARGOS_GENERADOS += 1
        return resolve(body)
      })
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  })
}

async function generateBarCode(chargePayload) {
  const payloadOP = {
    method: 'store',
    amount: chargePayload.saldoVencidoRea,
    description: `Saldo vencido ${chargePayload.folioInterno}`,
    customer: {
      name: chargePayload.nombreCliente.toUpperCase(),
      email: chargePayload.email,
      phone_number: chargePayload.telefonoFijo,
    },
  }

  try {
    const result = await getBarCode(payloadOP)

    const payload = {
      folioInterno: chargePayload.folioInterno,
      idOrden: chargePayload.idOrden,
      montoPagar: chargePayload.saldoVencidoRea,
      tiempoCreacion: new Date().toISOString().replace('T', ' ').substring(0, 19),
      urlCodigoBarras: result?.payment_method?.barcode_url,
      urlPdf: result?.payment_method?.url_store,
      idTransaccionOP: result?.id,
      referencia: result?.payment_method?.reference,
    }

    await registerCharge(payload)

    const reportName = `./reports/saldoVencido_${payload.referencia}.pdf`

    const fechaLimite = new Date(new Date().getTime() + 2592000000).toLocaleDateString(
      'mx-SP',
    )

    const reportContent = report({
      saldoVencidoRea: payload.montoPagar,
      referencia: payload.referencia,
      fechaLimite,
      imgUrl: payload.urlCodigoBarras,
    })

    pdf.create(reportContent).toFile(reportName, function (err, res) {
      if (err) {
        console.log(err)
      } else {
        console.log(res)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function generateAllBarCodes() {
  NUM_CARGOS_ERROR = 0
  NUM_CARGOS_GENERADOS = 0
  NUM_CARGOS_SIN_EMAIL = 0

  const [results] = await sequelize.query(`
    SELECT TOP 5
      s.idOrden,
      s.foliointerno AS folioInterno,
      s.idCliente,
      s.idPersonaFisica,
      s.saldoVencidoRea,
      s.nombreCliente,
      [dbo].[fn_getContactoPersonaFisica] ( idpersonafisica, 1301 ) AS telefonoFijo,
      [dbo].[fn_getContactoPersonaFisica] ( idpersonafisica, 1305 ) AS email,
      pa.urlCodigoBarras 
    FROM
      SICOINT_GenerarEnvioCobranzaView s WITH ( NOLOCK )
      LEFT JOIN gbplus.op.pagoAdeudo pa WITH ( NOLOCK ) ON pa.folioInterno = s.folioInterno 
    WHERE
      saldoVencidoRea > 100 
      AND idEstatus = 2609 
      AND idDepartamento IN ( 7901, 7902, 79025 ) 
      AND pa.urlCodigoBarras IS NULL  
  ;`)

  const promises = []

  for (let i = 0; i < results.length; i++) {
    if (results[i].email) {
      const payload = {
        ...results[i],
        saldoVencidoRea: Number(results[i].saldoVencidoRea.toFixed(2)),
      }

      if (results[i].saldoVencidoRea >= 29999) {
        promises.push(generateMultipleBarcodes(payload))
      } else {
        promises.push(generateBarCode(payload))
      }
    } else {
      NUM_CARGOS_SIN_EMAIL += 1
    }
  }

  await Promise.all(promises)

  return {
    NUM_CARGOS_ERROR,
    NUM_CARGOS_GENERADOS,
    NUM_CARGOS_SIN_EMAIL,
  }
}

function generateMultipleBarcodes(chargePayload) {
  let adeudo = chargePayload.saldoVencidoRea
  const promises = []

  while (adeudo > 0) {
    let saldoVencidoRea

    if (adeudo >= 29998) {
      saldoVencidoRea = 29998
      adeudo -= 29998
    } else {
      saldoVencidoRea = adeudo
      adeudo = 0
    }

    const payload = {
      ...chargePayload,
      saldoVencidoRea: Number(saldoVencidoRea.toFixed(2)),
    }

    promises.push(generateBarCode(payload))
  }

  return promises
}

module.exports = {
  generateBarCode,
  generateAllBarCodes,
}
