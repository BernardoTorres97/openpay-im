const Openpay = require('openpay')
const sequelize = require('./db')

const openpay = new Openpay(process.env.MERCHANT_ID, process.env.PRIVATE_KEY)

async function generateBarCode(chargeRequest) {
  console.log(chargeRequest)
  return new Promise((resolve) => {
    try {
      openpay.charges.create(chargeRequest, (error, body) => {
        if (error) throw new Error(error)

        resolve(body)
      })
    } catch (error) {
      throw new Error(error)
    }
  })
}

async function generateAllBarCodes() {
  const [results] = await sequelize.query(
    'SELECT s.foliointerno, s.idCliente, s.idPersonaFisica, s.saldoVencidoRea, s.nombreCliente, [dbo].[fn_getContactoPersonaFisica] (idpersonafisica,1301) AS telefonoFijo, [dbo].[fn_getContactoPersonaFisica] (idpersonafisica,1305) AS email FROM SICOINT_GenerarEnvioCobranzaView s WHERE saldoVencidoRea > 100 AND idEstatus=2609 AND idDepartamento IN(7901,7902,79025)',
  )

  for (let i = 0; i < results.length; i++) {
    const chargeRequest = {
      method: 'store',
      amount: results[i].saldoVencidoRea,
      description: `Saldo vencido ${results[i].foliointerno}`,
      customer: {
        name: results[i].nombreCliente.toUpperCase(),
        email: results[i].email,
        phone_number: results[i].telefonoFijo,
      },
    }

    if (results[i].email) await generateBarCode(chargeRequest)
  }
}

module.exports = {
  generateBarCode,
  generateAllBarCodes,
}
