// utils/pdfToJpg.js
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

/**
 * Convierte un PDF a imágenes JPG usando Poppler (pdftoppm)
 * @param {string} inputPdfPath - Ruta al archivo PDF
 * @param {string} outputDir - Carpeta donde se guardarán las imágenes
 * @param {string} [outputPrefix='page'] - Prefijo para los archivos de salida
 * @returns {Promise<string[]>} - Array de rutas a las imágenes generadas
 */
function convertPdfToJpg(inputPdfPath, outputDir, outputPrefix = 'page') {
  return new Promise((resolve, reject) => {
    const absoluteOutputDir = path.resolve(outputDir)

    // Crea la carpeta de salida si no existe
    if (!fs.existsSync(absoluteOutputDir)) {
      fs.mkdirSync(absoluteOutputDir, { recursive: true })
    }

    const outputFilePattern = path.join(absoluteOutputDir, outputPrefix)
    const cmd = `pdftoppm -jpeg "${inputPdfPath}" "${outputFilePattern}"`

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error al convertir el PDF: ${error.message}`))
        return
      }

      // Buscar archivos generados
      const files = fs
        .readdirSync(absoluteOutputDir)
        .filter(
          (file) => file.startsWith(outputPrefix) && file.endsWith('.jpg'),
        )
        .map((file) => path.join(absoluteOutputDir, file))

      resolve(files)
    })
  })
}

module.exports = { convertPdfToJpg }
