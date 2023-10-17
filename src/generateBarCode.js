const Openpay = require('openpay')
const sequelize = require('./db')

const openpay = new Openpay(process.env.MERCHANT_ID, process.env.PRIVATE_KEY)

async function generateBarCode(chargeRequest) {
  // const chargeRequest = {
  //   method: 'store',
  //   amount: 100,
  //   description: 'Cargo inicial a mi cuenta',
  //   SALDO VENCIDO + FOLIO
  //   customer: {
  //     name: 'Cliente Mx',
  //     last_name: 'Vazquez Juarez',
  //     phone_number: '4448936475',
  //     email: 'juan.vazquez@empresa.mx',
  //   },
  // }

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
    'select s.foliointerno, s.idCliente, s.idPersonaFisica, s.saldoVencidoRea, s.nombreCliente, [dbo].[fn_getContactoPersonaFisica] (idpersonafisica,1301) as telefonoFijo, [dbo].[fn_getContactoPersonaFisica] (idpersonafisica,1305) as email from SICOINT_GenerarEnvioCobranzaView s where saldoVencidoRea > 100 and idEstatus=2609 and idDepartamento in(7901,7902,79025)',
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
