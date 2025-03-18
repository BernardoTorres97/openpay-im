module.exports = function report(payload) {
  const info = payload.edoCuenta[0][0]

  return `
   <!DOCTYPE html>
<html>
  <head>
    <title>Document</title>
  </head>
  <body>

  <div class="flex-center" style="width: 100%">
      <div id="logoIntermercado" style="margin-right: 50px; margin-left: 40px">
        <img
          src="https://intermercado.mx/wp-content/uploads/2021/02/logo-web-im-1.png"
          alt="Logo Intermercado"
          class="img-fluid"
        />
      </div>
      <div id="headerContainer">
        <span style="font-weight: 500; font-size: 26px" class="block"
          >ESTADO DE CUENTA</span
        >
        <div style="font-size: 12px; padding-left: 60px">
          <span class="block" style="font-size: 23px">Todo a tu alcance</span>
          <span class="block">GB Plus SA de CV SOFOM ENR</span>
          <span class="block">RFC GPL0704252G3</span>
          <span class="block">Ignacio Allende 8, Colonia Centro</span>
        </div>
      </div>
    </div>

  <section style="padding: 0 40px; width: 100%; font-size: 11px; margin-top: 24px"">
      <div class="flex-between">
        <div>
          <div class="card">
            <span class="label" style="font-weight: 600">INFORMACIÓN GENERAL</span>
            <span class="block"><b>Nombre: </b>${info.Nombre}</span>
            <span class="block"><b>Convenio: </b>${info.convenio}</span>
          </div>
          <div class="card" style="margin-top: 16px">
            <span class="block"><b>Tasa Mensual: </b>${info.TasaMensual}</span>
            <span class="block"><b>Convenio: </b>${info.TasaAnual}</span>
            <span class="block"><b>CAT: </b>${(info.CAT * 100).toFixed(2)}%</span>
            <span class="block"><b>IVA: </b>16%</span>
          </div>
        </div>
        <div class="card">
          <span class="block"><b>Tipo de servicio: </b>${info.TipoServicio}</span>
          <span class="block"><b>Clave del client: </b>${info.ClaveCliente}</span>
          <span class="block"><b>Período: </b>${info.PeriodoEmision}</span>
          <span class="block"><b>Fecha límite pago: </b>${info.FechaLimitePago}</span>
          <span class="block"
            ><b>Saldo inicial: </b>$${info.SaldoInicial.toLocaleString()}</span
          >
          <span class="block"
            ><b>Total abonado: </b>$${info.TotalAbonado.toLocaleString()}</span
          >
          <span class="block"
            ><b>Saldo actual: </b>$${info.SaldoActual.toLocaleString()}</span
          >
          <span class="block"><b>Fecha emisión: </b>${info.FechaEmision}</span>
          <span class="block"><b>Estado del cliente: </b>${info.EstadoCliente}</span>
        </div>
      </div>

      <span class="label" style="margin-top: 16px; font-weight: 600; margin-bottom: 2px">DATOS DEL CRÉDITO</span>
       <div class="card flex" style="margin: 0 auto; text-align: center">
        <div>
          <b class="block">Folio Solicitud:</b>
          <span class="block">${info.folioInterno}</span>
        </div>
        <div>
          <b class="block">Fecha Venta:</b>
          <span class="block">${info.FechaVenta}</span>
        </div>
        <div>
          <b class="block">Plazos:</b>
          <span class="block">${info.Plazos}</span>
        </div>
        <div>
          <b class="block">Descuento Periodico:</b>
          <span class="block">$${info.DescuentoPeriodico.toLocaleString()}</span>
        </div>
        <div>
          <b class="block">Periodo Inicio:</b>
          <span class="block">${info.PeriodoInicio}</span>
        </div>
        <div>
          <b class="block">Periodo Fin:</b>
          <span class="block">${info.PeriodoFin}</span>
        </div>
        <div>
          <b class="block">Importe:</b>
          <span class="block">$${info.Importe.toLocaleString()}</span>
        </div>
      </div>

      <span class="label" style="margin-top: 16px; font-weight: 600; margin-bottom: 2px">DATOS DEL SERVICIO</span>
      <div class="card flex" style="margin: 0 auto">
        <div>
          <b class="block">Modelo:</b>
          <span class="block">${info.Modelo}</span>
        </div>
        <div>
          <b class="block">No. Serie:</b>
          <span class="block">${info.NoSerie}</span>
        </div>
        <div>
          <b class="block">Descripción:</b>
          <span class="block">${info.Descripcion}</span>
        </div>
        <div>
          <b class="block">Importe:</b>
          <span class="block">$${info.Importe.toLocaleString()}</span>
        </div>
      </div>
      <span class="block" style="margin-top: 2px"><b>Total: </b>$${info.Importe.toLocaleString()}</span>
    </section>

  <span class="label" style="margin-top: 20px; margin-left: 40px; font-weight: 600">MOVIMIENTOS</span>
    <table style="font-size: 10px; padding: 40px; padding-top: 0; width: " id="edoCuenta">
      <tr style="font-weight: 600;">
        <th>Fecha</th>
        <th>Período</th>
        <th>Importe</th>
        <th>Capital</th>
        <th>Interés</th>
        <th>IVA</th>
        <th>Movimiento</th>
        <th>Origen</th>
        <th>Folio</th>
      </tr>
    ${(function fn() {
      let html = ``

      payload.edoCuenta[0].forEach((edo) => {
        html += ` 
            <tr>
              <td>${edo.Fecha.toLocaleString()}</td>
              <td>${edo.Periodo.toLocaleString()}</td>
              <td>$${edo.Importe.toLocaleString()}</td>
              <td>$${edo.Capital.toLocaleString()}</td>
              <td>$${edo.Interes.toLocaleString()}</td>
              <td>$${edo.Iva.toLocaleString()}</td>
              <td>${edo.Movimiento}</td>
              <td>${edo.Origen}</td>
              <td>${edo.folioInterno}</td>
            </tr>
          `
      })

      return html + '</table>'
    })()}
    
   <section style="margin: 80px 40px 0 40px; font-size: 11px">
      <span class="label"
        ><b>Erika Hernández: Unidad Especializada de Atención a Usuarios</b></span
      >
      <span class="block"
        ><b>Domicilio: </b>Ignacio Allende 8, Colonia Centro, Xalapa, Veracruz, C. P.
        91000 <b style="margin-left: 40px">Teléfonos: </b>01 228 8418300, 01 800
        5009195</span
      >
      <span class="block"
        ><b>Correo electrónico: </b
        ><a href="mailto:atencionclientes@intermercado.com.mx"
          >atencionclientes@intermercado.com.mx</a
        ><b style="margin-left: 40px">Página de interenet: </b
        ><a href="http://www.intermercado.com.mx" target="_blank"
          >http://www.intermercado.com.mx</a
        ></span
      >
      <b class="block">
        Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios
        Financieros (CONDUSEF):
      </b>
      <span class="block"
        >Con fundamento en el artículo 23 de la Ley para la Transparencia y Ordenamiento
        de los Servicios Financieros, el plazo para presentar solicitud de aclaración: 90
        días naturales contador a partir de la fecha de corte o, en su caso, de la
        realización de la operación o del servicio.</span
      >
      <div
        class="flex-between"
        style="
          color: white;
          background-color: #28367d;
          width: 100%;
          padding: 4px 6px;
          margin-top: 6px;
        "
      >
        <a href="http://www.intermercado.com.mx" target="_blank" style="color: white"
          >http://www.intermercado.com.mx</a
        >
        <b>Ignacio Allende 8, Colonia Centro, Xalapa, Veracruz, C.P. 91000</b>
      </div>
    </section>


    <div style="page-break-before: always;"></div>

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
            src="https://www.onlinecasinoreports.com.mx/images/paynet-big.png"
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
                  src="${payload.imgUrl}"
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
          atencionclientes@intermercado.com.mx</span
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
          <div style="width: 130px">
            <img src="https://i.ibb.co/qxGskr1/ahorro.jpg" alt="" class="img-fluid" />
          </div>
          <div style="width: 130px">
            <img src="https://i.ibb.co/KzxCKNQn/farmacia-guadalajara-e1663854661466.jpg" alt="Logo Super Farmacia" class="img-fluid" />
          </div>
        </div>
        <div class="flex-center logos">
          <div style="width: 100px">
            <img src="https://i.ibb.co/8zScK0S/walmart.jpg" alt="" class="img-fluid" />
          </div>
          <div style="width: 100px">
            <img src="https://i.ibb.co/8rRwKVH/sams.png" alt="" class="img-fluid" />
          </div>
          <div style="width: 100px">
            <img
              src="https://i.ibb.co/Dp2FRbS/bodega-Aurrera-express.png"
              alt=""
              class="img-fluid"
            />
          </div>
          <div style="width: 100px">
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
    padding: 10px 80px;
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

  #edoCuenta td {
    padding-right: 10px;
    padding-left: 10px;
  }

  #headerContainer {
    background-color: #28367d;
    color: #eee;
    text-align: center;
    width: 100%;
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    padding: 18px 30px 18px 50px;
  }

   .card {
    border: 2px solid #111;
    padding: 4px 8px;
  }

  .flex-between {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
  }

  .card div {
    margin-right: 24px;
  }

  a {
    color: black;
  }
</style>

  `
}
