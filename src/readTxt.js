const fs = require('fs').promises
const path = require('path')

/**
 * Lee el contenido de un archivo .txt como string.
 *
 * @param {string} filePath - Ruta del archivo (absoluta o relativa).
 * @returns {Promise<string>} Contenido del archivo como string.
 */
async function readTxtFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath)
    const content = await fs.readFile(absolutePath, 'utf8')
    return content
  } catch (err) {
    console.error(`❌ Error leyendo el archivo: ${err.message}`)
    throw err
  }
}

module.exports = { readTxtFile }
