const Openpay = require('openpay')
const sequelize = require('./db')

const openpay = new Openpay(process.env.MERCHANT_ID, process.env.PRIVATE_KEY)

function generateBarCode(chargeRequest) {
  // TODO: obtener todos los clientes de la BD a quienes se les enviará el Jasper

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

  try {
    // TODO: generar pago en tienda para cada cliente
    openpay.charges.create(chargeRequest, function (error, body) {
      if (error) {
        console.log(error)
      } else {
        // TODO: guardar el url del código de barras y el url del pago en BD y marcar estatus de la entidad como "código generado"
        console.log(body)
      }
    })
  } catch (err) {
    console.log(err)
  }
}

async function generateAllBarCodes() {
  const [results, metadata] = await sequelize.query(
    'select  *, [dbo].[fn_getContactoPersonaFisica] (idpersonafisica,1301) as telefonoFijo, [dbo].[fn_getContactoPersonaFisica] (idpersonafisica,1305) as email from SICOINT_GenerarEnvioCobranzaView s where saldoVencidoRea >100 and idEstatus=2609 and idDepartamento in(7901,7902,79025)',
  )

  for (let i = 0; i < 3; i++) {
    const chargeRequest = {
      method: 'store',
      amount: results[i].saldoVencidoRea,
      description: `Saldo vencido ${results[i].folioInterno}`,
      customer: {
        name: results[i].nombreCliente.toUpperCase(),
        email: results[i].contacto,
        phone_number: results[i].contacto,
      },
    }

    console.log(chargeRequest)

    generateBarCode(chargeRequest)
  }

  // results.forEach((cliente) => {
  //   const chargeRequest = {
  //     method: 'store',
  //     customer: {
  //       name: cliente.nombreCliente.toUpperCase(),
  //       last_name: ' ',
  //     },
  //     description: '',
  //     amount: '',
  //   }

  //   // generateBarCode(chargeRequest)
  // })
}

module.exports = {
  generateBarCode,
  generateAllBarCodes,
}
