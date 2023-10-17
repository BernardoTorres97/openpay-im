# Generación de código de barras mediante OpenPay

Por defecto se correrá un script cada día 15 y 30 del mes que generará los códigos de barras para los clientes qe cumplan con la condición "saldoVencidoRea > 100 and idEstatus=2609 and idDepartamento in(7901,7902,79025)"

## API

Existen 3 endpoints para gestionar este servicio, los cuales son los siguientes:

- **/set-cron** reagenda qué días se correrá automáticamente el script

- **/generate-bar-code** generá de forma manual el código de barras de un cliente

- **/generate-all-bar-codes** genera todos los códigos de barras pendientes

### /set-cron

Es necesario enviar una expresión cron. Se recomienda usar [CronGuru](https://crontab.guru/) para validar la expresión cron

**Request**

```json
{
  "cron": "0 0 1 * *"
}
```

**Response**
OK - 200

```json
	"Se ha cambiado la expresión cron a "0 0 1 * *""
```

Bad Request - 400

```json
"Expresión cron inválida"
```

### /generate-bar-code

**Request**

```json
{
  "amount": 100, // requerida
  "description": "Cargo inicial a mi cuenta",
  "customer": {
    // requerida
    "name": "Juan", // requerida
    "last_name": "Vazquez Juarez",
    "phone_number": "4448936475",
    "email": "juan.vazquez@empresa.mx" // requerida
  }
}
```

**Response**

```json
{
  "id": "tro7ptxti0hfadrw8s1i",
  "authorization": null,
  "operation_type": "in",
  "transaction_type": "charge",
  "status": "in_progress",
  "conciliated": false,
  "creation_date": "2023-10-17T12:45:22-06:00",
  "operation_date": "2023-10-17T12:45:22-06:00",
  "description": "Cargo inicial a mi cuenta",
  "error_message": null,
  "order_id": null,
  "amount": 100,
  "customer": {
    "name": "Juan",
    "last_name": "Vazquez Juarez",
    "email": "juan.vazquez@empresa.mx",
    "phone_number": "4448936475",
    "address": null,
    "creation_date": "2023-10-17T12:45:22-06:00",
    "external_id": null,
    "clabe": null
  },
  "currency": "MXN",
  "payment_method": {
    "type": "store",
    "reference": "1010101346018565",
    "barcode_url": "https://sandbox-api.openpay.mx/barcode/1010101346018565?width=1&height=45&text=false",
    "url_store": "https://sandbox-api.openpay.mx/v1/m1s62cedy1clxykshdmv/customers/8446031/tro7ptxti0hfadrw8s1i/store_confirm"
  },
  "method": "store"
}
```

### /generate-all-bar-codes

**Request**

```json

```

**Response**

```json
"Se han generado todos los códigos de barras pendientes"
```
