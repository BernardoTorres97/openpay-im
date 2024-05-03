const payload = {
  fechaLimite: '',
}

module.exports = function report(payload) {
  return `
   <!DOCTYPE html>
<html>
  <head>
    <title>Document</title>
  </head>
  <body>
    <div id="header">
      <div id="logoIntermercado">
        <img
          src="https://intermercado.mx/wp-content/uploads/2021/02/logo-web-im-1.png"
          alt="Logo Intermercado"
          class="img-fluid"
        />
      </div>
      <div class="flex-center">
        <span id="paynetLabel" class="inline-block" style="margin-top: 6px"
          >Servicio a pagar:</span
        >
        <div id="logoPaynet" class="inline-block">
          <img
            src="https://site.openpay.mx/recursos/img/marketing_kit/logo_paynet1.png"
            alt="Logo Paynet"
            class="img-fluid"
          />
        </div>
      </div>
    </div>

    <div class="container" style="padding-top: 50px">
      <div class="flex">
        <div class="flex" style="width: 50%; padding-right: 70px">
          <div class="square"></div>
          <div class="container-body">
            <div>
              <span class="container-title block">Fecha límite de pago:</span>
              <span class="block" style="margin-top: 6px; margin-bottom: 12px"
                >${payload.fechaLimite}</span
              >
              <div>
                <img
                  src="https://sandbox-api.openpay.mx/barcode/1010100352090463"
                  alt="Código barras"
                  class="img-fluid"
                />
              </div>
              <span class="label" style="margin-top: 4px"
                >Muestra este código impreso o desde tu celular</span
              >
              <span class="label" style="margin-top: 6px"
                >En caso de que el escáner no sea capaz de leer el código de barras,
                escribir la referencia tal como se muestra:</span
              >
              <span
                class="block"
                style="text-align: center; margin-top: 8px; font-weight: 600"
                >${payload.referencia}</span
              >
            </div>
          </div>
        </div>
        <div id="amountToPay" class="flex-center">
          <span class="block text-center" style="font-weight: 600; font-size: 24px"
            >Saldo Vencido a pagar:</span
          >
          <span
            class="block text-center"
            style="font-weight: 600; font-size: 36px; margin-top: 16px"
            >$${payload.saldoVencidoRea.toLocaleString()}<span style="margin-left: 20px; font-size: 20px">MXN</span></span
          >
          <span class="label" style="margin-top: 24px"
            >La comisión por recepción del pago varía de acuerdo a los términos y
            condiciones que cada cadena comercial establece y es ajena a
            Intermercado.</span
          >
        </div>
      </div>
    </div>

    <div class="container flex" style="margin-top: 60px">
      <div class="square"></div>
      <div class="container-body">
        <span class="container-title block">Detalle de pago</span>
      </div>
    </div>

    <div style="font-size: 14px; margin-top: 20px" class="flex">
      <span
        class="block"
        style="
          width: 35%;
          padding: 16px 0;
          padding-left: 56px;
          background-color: #eee;
          border-right: 3px solid #fff;
        "
        >Concepto</span
      >
      <span
        class="block"
        style="width: 65%; background-color: #eee; padding: 16px 0; padding-left: 36px"
        >Pago crédito Intermercado</span
      >
    </div>

    <div class="container flex" style="margin-top: 60px">
      <div class="square"></div>
      <div class="container-body">
        <span class="container-title block">Cómo realizar el pago</span>
        <ol style="margin-left: 16px; font-size: 14px; margin-top: 8px">
          <li>Acude a cualquier tienda afiliada dentro de la fecha límite de pago</li>
          <li>
            Entrega al cajero el código de barras y menciona que relizarás un pago de
            servicio Paynet
          </li>
          <li>
            Antes de pagar verifica que los datos coniciden con los de este recibo de pago
          </li>
          <li>
            Realiza el pago en efectivo por el total a pagar, este se reflejará al
            instante
          </li>
          <li>Conserva el ticket para cualquier aclaración</li>
        </ol>
        <span class="label" style="margin-top: 18px"
          >Si tienes dudas comunícate a Intermercado al teléfono 800 500 9195 o al correo
          atencionaclientes@intermercado.com.mx</span
        >
      </div>
    </div>

    <div class="flex-center" style="padding-left: 54px; margin-top: 40px">
      <span style="width: 35%">Puedes pagarlo en:</span>
      <div>
        <div class="flex-center logos">
          <div>
            <img
              src="https://i.ibb.co/4FZQJgW/7eleven-logo.png"
              alt="Logo 7Eleven"
              class="img-fluid"
            />
          </div>
          <div>
            <img src="https://i.ibb.co/gJNRdg7/tiendas-k.jpg" alt="" class="img-fluid" />
          </div>
          <div>
            <img src="https://i.ibb.co/qxGskr1/ahorro.jpg" alt="" class="img-fluid" />
          </div>
          <div>
            <img src="https://i.ibb.co/GtKXSJR/benavides.png" alt="" class="img-fluid" />
          </div>
        </div>
        <div class="flex-center logos">
          <div>
            <img src="https://i.ibb.co/8zScK0S/walmart.jpg" alt="" class="img-fluid" />
          </div>
          <div>
            <img src="https://i.ibb.co/8rRwKVH/sams.png" alt="" class="img-fluid" />
          </div>
          <div>
            <img
              src="https://i.ibb.co/Dp2FRbS/bodega-Aurrera-express.png"
              alt=""
              class="img-fluid"
            />
          </div>
          <div>
            <img
              src="https://i.ibb.co/8xtT1H7/walmart-express.png"
              alt=""
              class="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex-center" style="margin-top: 40px">
      <span style="margin-right: 10px">Powered by</span>
      <div style="width: 100px">
        <img
          src="https://www.openpay.mx/_nuxt/img/openpay-color.77b290c.webp"
          alt="Logo Openpay"
          class="img-fluid"
        />
      </div>
    </div>
  </body>
</html>

<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  .text-center {
    text-align: center;
  }

  .label {
    display: block;
    font-size: 12px;
  }

  .block {
    display: block;
  }

  .flex {
    display: flex;
    display: -webkit-box;
  }

  .flex-center {
    display: -webkit-box;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
  }

  .float-left {
    float: left;
  }

  .clear-left {
    clear: left;
  }

  .inline-block {
    display: inline-block;
  }

  .img-fluid {
    width: 100%;
    height: auto;
    display: block;
  }

  #amountToPay {
    width: 50%;
    background-color: #28367d;
    padding: 20px;
    color: #eee;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
  }

  #logoIntermercado {
    width: 120px;
  }

  #paynetLabel {
    font-size: 20px;
  }

  #header {
    padding: 40px 80px;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
  }

  #logoPaynet {
    margin-left: 8px;
    width: 120px;
  }

  .container-body {
    margin-left: 24px;
  }

  .container {
    width: 100%;
  }

  .container .square {
    width: 30px;
    height: 50px;
    background-color: #28367d;
  }

  .container-title {
    font-size: 22px;
    font-weight: 700;
  }

  #logos {
    width: 65%;
  }

  .logos div {
    width: 50px;
    margin: 0 20px;
  }
</style>

  `
}
