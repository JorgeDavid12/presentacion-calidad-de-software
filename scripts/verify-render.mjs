import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const expectedSpeakers = {
  David: 8,
  Luis: 8,
  Francisco: 8,
  Marvin: 8,
}

const server = await createServer({
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
})

try {
  const { slides } = await server.ssrLoadModule('/src/data/slides.js')
  const { CyberVisual } = await server.ssrLoadModule('/src/components/CyberVisuals.jsx')

  if (slides.length !== 35) {
    throw new Error(`Se esperaban 35 escenas y se encontraron ${slides.length}.`)
  }

  const ids = new Set(slides.map((slide) => slide.id))
  if (ids.size !== slides.length) {
    throw new Error('Existen IDs de escena duplicados.')
  }

  for (const [speaker, expected] of Object.entries(expectedSpeakers)) {
    const actual = slides.filter((slide) => slide.speaker === speaker).length
    if (actual !== expected) {
      throw new Error(`${speaker} debería tener ${expected} escenas y tiene ${actual}.`)
    }
  }

  for (const slide of slides) {
    const html = renderToStaticMarkup(React.createElement(CyberVisual, { slide }))
    if (!html || html.length < 40) {
      throw new Error(`La escena ${slide.id} no produjo contenido visual.`)
    }
    if (html.includes('data-unsupported-visual')) {
      throw new Error(`La escena ${slide.id} usa un kind sin implementación: ${slide.kind}.`)
    }
  }

  console.log(`OK: ${slides.length} escenas, IDs únicos, reparto 8/8/8/8 y render visual completo.`)
} finally {
  await server.close()
}
