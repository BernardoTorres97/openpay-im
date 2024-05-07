const Openpay = require('openpay')
const { sequelize, gbplus, intermercado } = require('./db')
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

    const edoCuenta = await getEdoCuenta(payload.idOrden)

    const reportContent = report({
      saldoVencidoRea: payload.montoPagar,
      referencia: payload.referencia,
      imgUrl: payload.urlCodigoBarras,
      fechaLimite,
      edoCuenta,
    })

    const options = {
      border: {
        top: '30px',
        bottom: '30px',
        left: 0,
        right: 0,
      },
    }

    pdf.create(reportContent, options).toFile(reportName, function (err, res) {
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

async function getEdoCuenta(idOrden) {
  const query = `
  SELECT distinct x.folioInterno,
  ISNULL(pf.nombre1+' ','')+ISNULL(pf.nombre2+' ','')+ISNULL(pf.apellidoPaterno+' ','')+ISNULL(pf.apellidoMaterno,'') AS Nombre,
  n.nombre AS convenio,
  convert(varchar,case when n.identidad not in(40,124) then 'Tasa Mensual' else '' end) as TTasaMensual,
  convert(varchar,case when n.identidad not in(40,124) then 'Tasa Anual' else '' end) as  TTasaAnual,
  convert(varchar, case when n.identidad not in(40,124) then convert(varchar, round(k.interes, 3, 1)*100 )+'%' else ' ' end) AS TasaMensual,
  convert(varchar, case when n.identidad not in(40,124) then convert(varchar,ROUND(k.interes*12, 3, 1)*100 )+'%' else ' ' end) AS TasaAnual,
  ROUND(ISNULL(r.catInformativo,0.643), 3, 1) AS CAT,
  ROUND(r.iva, 3, 1) AS Impuesto,
  q.nombre AS TipoServicio,
  CASE WHEN n.idTipoClaveEmpleado=1001 THEN pf.rfc ELSE e.ndp END AS ClaveCliente,
  intermercado.dbo.GETMONTHNAMEBYLANGUAGEANDNUMMONTH(MONTH(GETDATE()),'Spanish') + ' ' + CAST(YEAR(GETDATE()) AS VARCHAR(4)) AS PeriodoEmision,
  'Días '+k.diasPago+' de cada mes' AS FechaLimitePago,
  CAST(k.descuento*k.Plazo AS MONEY) AS SaldoInicial,
  ISNULL(total.importe,0) AS TotalAbonado,
  (k.descuento*k.plazo)-ISNULL(total.importe,0) AS SaldoActual,
  CONVERT(VARCHAR(10), GETDATE(), 103) AS FechaEmision,
  u.nombre AS EstadoCliente,
  CONVERT(VARCHAR(10), x.tiempoLiberacion, 103) AS FechaVenta,
  k.plazo AS Plazos,
  CAST(k.descuento AS MONEY) AS DescuentoPeriodico,
  occ.PeriodoInicio, occ.PeriodoFin,
  CASE WHEN q.idTratamiento=1 THEN ISNULL(p.modelo, 'S/N') ELSE 'P'+RIGHT('000'+ CONVERT(VARCHAR,intermercado.dbo.getPrecioCapitalOrden(x.idOrden)/100),4) END AS Modelo,
  CASE WHEN q.idTratamiento=1 THEN ISNULL(a.serie, 'S/N') ELSE 'P'+RIGHT('000'+ CONVERT(VARCHAR,intermercado.dbo.getPrecioCapitalOrden(x.idOrden)/100),4) END AS NoSerie,
  q.nombre+' $'+CONVERT(VARCHAR, CAST(intermercado.dbo.getPrecioCapitalOrden(x.idOrden) AS MONEY), 1) AS Descripcion,
  --
  mov.Fecha,
  convert(varchar,mov.Periodo) as Periodo,
  mov.Importe,
  ROUND((mov.importe * (sol.importe/(k.descuento*k.plazo))),2) AS Capital,
  ROUND(mov.importe * ((((k.descuento*k.plazo) - sol.importe)/1.16)/(k.descuento*k.plazo)) ,2) AS Interes,
  ROUND(mov.importe - (ROUND((mov.importe * (sol.importe/(k.descuento*k.plazo))),2) + ROUND(mov.importe * ((((k.descuento*k.plazo)-sol.importe)/1.16)/(k.descuento*k.plazo)) ,2)),2) AS Iva,
  mov.Movimiento,
  mov.Origen,
  op.urlCodigoBarras as url,op.montoPagar as SaldoVencido, op.idTransaccionOP,
  referencia  as referencia, UPPER(CAST(DAY((eomonth(GETDATE()))) AS VARCHAR)+ ' de '+intermercado.dbo.GETMONTHNAMEBYLANGUAGEANDNUMMONTH(MONTH((eomonth(GETDATE()))),'Spanish')+' de '+CAST(YEAR((eomonth(GETDATE()))) AS VARCHAR)) as vigencia

  --
  FROM intermercado.dbo.orden x WITH(NOLOCK)
  LEFT OUTER JOIN intermercado.dbo.cliente e WITH(NOLOCK) ON x.idCliente=e.idCliente
  LEFT OUTER JOIN intermercado.dbo.sindicato s WITH(NOLOCK) ON e.idSindicato=s.idSindicato
  LEFT OUTER JOIN intermercado.dbo.ordencondicion occ WITH(NOLOCK) ON occ.idOrdenCondicion = x.idCondicionActual
  LEFT OUTER JOIN intermercado.dbo.ordencondicion k WITH(NOLOCK) ON k.idordencondicion=ISNULL(x.idcondicionoriginal,x.idcondicionactual)
  LEFT OUTER JOIN intermercado.dbo.venta v WITH(NOLOCK) ON x.idOrden=v.idOrden AND v.idProducto NOT IN (3,5209,5192,5204,5205,5208,5211)
  LEFT OUTER JOIN intermercado.dbo.ventaDetalle d WITH(NOLOCK) ON x.idOrden=d.idOrden AND d.principal='S'
  LEFT OUTER JOIN intermercado.dbo.producto p WITH(NOLOCK) ON v.idProducto=p.idProducto
  LEFT OUTER JOIN intermercado.dbo.impuesto i WITH(NOLOCK) ON v.idImpuesto=i.idImpuesto
  LEFT OUTER JOIN intermercado.dbo.entidad n WITH(NOLOCK) ON e.idEntidad=n.idEntidad
  LEFT OUTER JOIN intermercado.dbo.catalogo u WITH(NOLOCK) ON e.idEstatus=u.idCatalogo
  LEFT OUTER JOIN intermercado.dbo.tipoOrden q WITH(NOLOCK) ON x.idTipo=q.idTipoOrden
  LEFT OUTER JOIN intermercado.dbo.tratamientofiscal w WITH(NOLOCK) ON q.idTratamiento=w.idTratamiento
  LEFT OUTER JOIN intermercado.dbo.credito r WITH(NOLOCK) ON x.idCredito=r.idCredito
  LEFT OUTER JOIN intermercado.dbo.articulo a WITH(NOLOCK) ON d.idArticulo=a.idArticulo
  left outer join intermercado.dbo.personafisica pf WITH(NOLOCK) on e.idpersonafisica=pf.idpersonafisica
  LEFT OUTER JOIN intermercado.dbo.solicitud sol WITH (NOLOCK) ON sol.idOrden = x.idOrden
  left outer join intermercado.dbo.saldovencido sv WITH (NOLOCK) on sv.idorden=x.idorden
  left outer join gbplus.op.pagoAdeudo op WITH (NOLOCK) on op.idOrden=x.idOrden
  LEFT OUTER JOIN (
    SELECT
    m.idorden,
    CONVERT(VARCHAR(10), MAX(m.fechamovimiento), 103) AS Fecha,
    intermercado.dbo.GETPERIODOFROMIDCALENDARIOCOBRANZA(m.idCalendario) AS Periodo,
    CAST(SUM(tm.factor*m.importe) AS MONEY) AS Importe,
    MAX(tm.concepto) AS Movimiento,
    MAX(om.descripcion) AS Origen
    FROM intermercado.dbo.movimiento m WITH(NOLOCK)
    LEFT OUTER JOIN intermercado.dbo.tipomovimiento tm WITH(NOLOCK) ON tm.idtipomovimiento = m.idtipo
    LEFT OUTER JOIN intermercado.dbo.ordencondicion occ WITH(NOLOCK) ON occ.idordencondicion = m.idordencondicion
    LEFT OUTER JOIN intermercado.dbo.origenmovimiento om WITH(NOLOCK) ON om.idorigenmovimiento = m.idorigenmovimiento
    WHERE m.idorden = ${idOrden}
    GROUP BY m.idorden,m.idCalendario,m.idtipo,m.idorigenmovimiento
  ) mov ON mov.idorden = x.idorden
  LEFT OUTER JOIN (
    SELECT
    m.idorden,
    CAST(SUM(tm.factor*m.importe) AS MONEY) AS Importe
    FROM intermercado.dbo.movimiento m WITH(NOLOCK)
    LEFT OUTER JOIN intermercado.dbo.tipomovimiento tm WITH(NOLOCK) ON tm.idtipomovimiento = m.idtipo
    WHERE m.idorden = ${idOrden}
    GROUP BY m.idorden
  ) total ON total.idorden = x.idorden
  WHERE x.idOrden=${idOrden}
  ORDER BY Periodo
`

  const result = await intermercado.query(query)
  return result
}

async function generateAllBarCodes() {
  NUM_CARGOS_ERROR = 0
  NUM_CARGOS_GENERADOS = 0
  NUM_CARGOS_SIN_EMAIL = 0

  const [results] = await sequelize.query(`
    SELECT TOP 2
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
