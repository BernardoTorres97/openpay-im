const { PDFDocument } = require('pdf-lib')
const sharp = require('sharp')
const { fromBuffer } = require('pdf2pic')

/**
 * Convierte un PDF (como Buffer) a una imagen (PNG, JPG, JPEG)
 * @param {Buffer} pdfBuffer - Buffer del PDF a convertir
 * @param {Object} [options={}] - Opciones de conversión
 * @param {string} [options.format='png'] - Formato de salida (png, jpg, jpeg)
 * @param {number} [options.quality=90] - Calidad para formatos JPG/JPEG (1-100)
 * @param {number} [options.density=300] - DPI para la conversión
 * @param {number} [options.page=1] - Número de página a convertir (1-based)
 * @returns {Promise<Buffer>} Buffer con la imagen convertida
 */
async function convertPdfToImage(pdfBuffer, options = {}) {
  const { format = 'png', quality = 90, density = 300, page = 1 } = options

  // Validaciones
  if (!Buffer.isBuffer(pdfBuffer)) {
    throw new Error('El input debe ser un Buffer')
  }

  if (!['png', 'jpg', 'jpeg'].includes(format.toLowerCase())) {
    throw new Error('Formato no soportado. Use png, jpg o jpeg')
  }

  if (page < 1) {
    throw new Error('El número de página debe ser mayor o igual a 1')
  }

  try {
    // 1. Cargar el PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer)
    const pageCount = pdfDoc.getPageCount()

    if (page > pageCount) {
      throw new Error(`El PDF solo tiene ${pageCount} páginas`)
    }

    // 2. Extraer la página específica como PDF independiente
    const newPdf = await PDFDocument.create()
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [page - 1])
    newPdf.addPage(copiedPage)
    const singlePagePdf = await newPdf.save()

    // 3. Convertir el PDF de una página a imagen
    const convert = fromBuffer(singlePagePdf, {
      density,
      saveFilename: 'temp', // No se usa realmente ya que trabajamos en memoria
      savePath: '/tmp', // Ruta temporal, aunque no escribimos en disco
      format,
      quality,
      width: 2480, // Ancho máximo
      height: 3508, // Alto máximo (A4)
      preserveAspectRatio: true,
    })

    const image = await convert(page, { responseType: 'buffer' })

    // 4. Procesar con sharp para optimizar
    let sharpProcessor = sharp(image.buffer)

    if (format.toLowerCase() === 'png') {
      sharpProcessor = sharpProcessor.png({ compressionLevel: 9 })
    } else {
      sharpProcessor = sharpProcessor.jpeg({ quality })
    }

    return await sharpProcessor.toBuffer()
  } catch (error) {
    throw new Error(`Error al convertir PDF a imagen: ${error.message}`)
  }
}
module.exports = { convertPdfToImage }
