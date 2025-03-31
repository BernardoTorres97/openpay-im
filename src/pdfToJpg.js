const { createCanvas } = require('canvas')

async function convertPdfToJpg(pdfBuffer, pagesToProcess = null) {
  const pdfjsLib = await import('pdfjs-dist')
  const worker = await import('pdfjs-dist/build/pdf.worker.mjs')

  pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default

  const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer })
  const pdfDocument = await loadingTask.promise

  const numPages = pdfDocument.numPages
  const pages =
    pagesToProcess || Array.from({ length: numPages }, (_, i) => i + 1)
  const results = []

  for (const pageNum of pages) {
    const page = await pdfDocument.getPage(pageNum)
    const viewport = page.getViewport({ scale: 2.0 })

    const canvas = createCanvas(viewport.width, viewport.height)
    const context = canvas.getContext('2d')

    await page.render({ canvasContext: context, viewport }).promise

    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 })
    results.push(buffer)
  }

  return results
}

module.exports = { convertPdfToJpg }
