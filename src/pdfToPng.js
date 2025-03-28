const pdf = require('pdf-poppler')
const fs = require('fs').promises
const path = require('path')
const { v4: uuidv4 } = require('uuid')

/**
 * Convierte un PDF en memoria (Buffer) a un array de Buffers de imágenes PNG (una por página).
 * @param {Buffer} pdfBuffer - Buffer del archivo PDF.
 * @returns {Promise<Buffer[]>} - Array de Buffers con las imágenes PNG generadas.
 */
async function pdfToPngBuffer(pdfBuffer) {
  try {
    // Crear un directorio temporal para procesamiento
    const tempDir = path.join(__dirname, 'temp', uuidv4())
    await fs.mkdir(tempDir, { recursive: true })

    // Guardar el Buffer del PDF en un archivo temporal
    const tempPdfPath = path.join(tempDir, 'temp.pdf')
    await fs.writeFile(tempPdfPath, pdfBuffer)

    // Configuración de pdf-poppler
    const opts = {
      format: 'png',
      out_dir: tempDir,
      out_prefix: 'page',
      page: null, // Convierte todas las páginas
    }

    // Convertir PDF a PNG (se guardan en tempDir)
    await pdf.convert(tempPdfPath, opts)

    // Leer los PNG generados y obtener sus Buffers
    const files = await fs.readdir(tempDir)
    const pngFiles = files.filter((file) => file.endsWith('.png'))
    const pngBuffers = await Promise.all(
      pngFiles.map(async (file) => {
        const filePath = path.join(tempDir, file)
        const buffer = await fs.readFile(filePath)
        return buffer
      }),
    )

    // Limpiar archivos temporales
    await fs.rm(tempDir, { recursive: true, force: true })

    return pngBuffers
  } catch (error) {
    throw new Error(`Error al convertir PDF a PNG: ${error.message}`)
  }
}

module.exports = pdfToPngBuffer
