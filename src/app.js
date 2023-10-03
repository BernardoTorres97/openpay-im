const Openpay = require('openpay')

const openpay = new Openpay(process.env.MERCHANT_ID, process.env.PRIVATE_KEY)

function generarCodigoBarras() {
  // TODO: obtener todos los clientes de la BD a quienes se les enviará el Jasper

  const chargeRequest = {
    method: 'store',
    amount: 100,
    description: 'Cargo inicial a mi cuenta',
    customer: {
      name: 'Cliente Mx',
      last_name: 'Vazquez Juarez',
      phone_number: '4448936475',
      email: 'juan.vazquez@empresa.mx',
    },
  }

  try {
    // TODO: generar pago en tienda para cada cliente
    openpay.charges.create(chargeRequest, function (error, body) {
      if (error) {
        console.log(error)
      } else {
        // TODO: guardar el url del código de barras y el url del pago en BD y marcar estatus del cliente como "enviado"
        console.log(body)
      }
    })
  } catch (err) {
    return console.log(err)
  }
}
