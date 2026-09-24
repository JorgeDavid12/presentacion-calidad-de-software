import { useEffect, useRef } from 'react'

const MAX_DPR = 1.5
const TARGET_FPS = 30
const FRAME_INTERVAL = 1000 / TARGET_FPS
const DEFAULT_ACCENT = [62, 247, 255]
const ALERT = [255, 50, 109]
const SODIUM = [255, 173, 50]
const ACID = [232, 255, 63]
const PALE = [222, 239, 239]

const PROFILES = {
  urban: {
    count: 34,
    rain: 0.18,
    dust: 0.28,
    network: false,
    connectionDistance: 118,
    connectionAlpha: 0.08,
    backdropAlpha: 0.54,
    speed: 0.72,
    warm: false,
    glitch: false,
  },
  cover: {
    count: 46,
    rain: 0.72,
    dust: 0.1,
    network: false,
    connectionDistance: 0,
    connectionAlpha: 0,
    backdropAlpha: 0.92,
    speed: 1,
    warm: false,
    glitch: false,
  },
  closing: {
    count: 42,
    rain: 0.38,
    dust: 0.52,
    network: false,
    connectionDistance: 0,
    connectionAlpha: 0,
    backdropAlpha: 0.86,
    speed: 0.62,
    warm: true,
    glitch: false,
  },
  trace: {
    count: 40,
    rain: 0.03,
    dust: 0.08,
    network: true,
    connectionDistance: 164,
    connectionAlpha: 0.25,
    backdropAlpha: 0.58,
    speed: 0.52,
    warm: false,
    glitch: false,
  },
  failure: {
    count: 32,
    rain: 0.24,
    dust: 0.1,
    network: false,
    connectionDistance: 104,
    connectionAlpha: 0.08,
    backdropAlpha: 0.66,
    speed: 0.9,
    warm: false,
    glitch: true,
  },
  dust: {
    count: 32,
    rain: 0.04,
    dust: 0.82,
    network: false,
    connectionDistance: 0,
    connectionAlpha: 0,
    backdropAlpha: 0.56,
    speed: 0.44,
    warm: true,
    glitch: false,
  },
  calm: {
    count: 24,
    rain: 0,
    dust: 0.2,
    network: false,
    connectionDistance: 0,
    connectionAlpha: 0,
    backdropAlpha: 0.3,
    speed: 0.28,
    warm: false,
    glitch: false,
  },
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const rgba = (rgb, alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`

function hashString(value) {
  let hash = 2166136261
  const text = String(value)

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function mulberry32(seed) {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function accentSignature(accentRgb) {
  if (Array.isArray(accentRgb)) return accentRgb.join(',')
  if (accentRgb && typeof accentRgb === 'object') {
    return `${accentRgb.r ?? ''},${accentRgb.g ?? ''},${accentRgb.b ?? ''}`
  }
  return String(accentRgb ?? '')
}

function parseAccent(value) {
  let channels

  if (Array.isArray(value)) {
    channels = value
  } else if (value && typeof value === 'object') {
    channels = [value.r, value.g, value.b]
  } else {
    channels = String(value ?? '').match(/-?\d*\.?\d+/g) ?? []
  }

  if (channels.length < 3) return DEFAULT_ACCENT

  const parsed = channels.slice(0, 3).map((channel) => Number(channel))
  if (parsed.some((channel) => !Number.isFinite(channel))) return DEFAULT_ACCENT

  return parsed.map((channel) => Math.round(clamp(channel, 0, 255)))
}

function resolveProfileName(mode, slideId) {
  const requested = String(mode ?? '').trim().toLowerCase()
  const id = String(slideId ?? '').trim().toLowerCase()
  const aliases = {
    default: 'urban',
    urban: 'urban',
    city: 'urban',
    cover: 'cover',
    portada: 'cover',
    rain: 'cover',
    lluvia: 'cover',
    depth: 'cover',
    closing: 'closing',
    cierre: 'closing',
    trace: 'trace',
    trazabilidad: 'trace',
    network: 'trace',
    red: 'trace',
    failure: 'failure',
    fallo: 'failure',
    falla: 'failure',
    risk: 'failure',
    riesgo: 'failure',
    static: 'failure',
    glitch: 'failure',
    dust: 'dust',
    polvo: 'dust',
    warm: 'dust',
    closure: 'dust',
    lessons: 'dust',
    lecciones: 'dust',
    calm: 'calm',
    table: 'calm',
    tabla: 'calm',
    report: 'calm',
    reporte: 'calm',
    informe: 'calm',
  }

  if (aliases[requested]) return aliases[requested]
  if (id === 'cover' || /(^|-)cover($|-)/.test(id)) return 'cover'
  if (id === 'closing' || /(^|-)closing($|-)/.test(id)) return 'closing'
  if (id === 'l07-traceability' || id === 'm07-university-case' || /traceability|university-case/.test(id)) return 'trace'
  if (/closure|lessons|lecciones|learning-loop|archive/.test(id)) return 'dust'
  if (/risk|riesgo|failure|failed|fallo|falla|defect|error|result|exit-criteria|not-finished/.test(id)) return 'failure'
  if (/table|tabla|ledger|matrix|matriz|report|reporte|informe|dashboard|metrics|metricas|executable/.test(id)) return 'calm'

  return 'urban'
}

function particleColor(profileName, kind, accent, random) {
  if (profileName === 'failure') {
    return random < 0.58 ? ALERT : random < 0.82 ? accent : PALE
  }

  if (profileName === 'closing' || profileName === 'dust') {
    return random < 0.55 ? SODIUM : random < 0.78 ? ACID : PALE
  }

  if (kind === 'rain') return random < 0.82 ? accent : PALE
  return random < 0.78 ? accent : random < 0.94 ? PALE : ALERT
}

function createParticle(profileName, profile, random, width, height) {
  const roll = random()
  const kind = roll < profile.rain
    ? 'rain'
    : roll < profile.rain + profile.dust
      ? 'dust'
      : 'node'
  const depth = 0.22 + random() * 0.78
  const accent = profile.accent

  return {
    kind,
    x: random() * width,
    y: random() * height,
    depth,
    radius: kind === 'node' ? 0.75 + depth * 1.25 : 0.45 + depth * 1.05,
    length: kind === 'rain' ? 7 + depth * 24 : 0,
    vx: kind === 'rain'
      ? (-9 + random() * 7) * depth
      : (random() - 0.5) * (kind === 'dust' ? 5 : 7),
    vy: kind === 'rain'
      ? (128 + random() * 190) * depth * profile.speed
      : -(3 + random() * (kind === 'dust' ? 13 : 7)) * profile.speed,
    alpha: kind === 'rain'
      ? 0.1 + depth * 0.28
      : 0.12 + random() * (kind === 'node' ? 0.34 : 0.26),
    phase: random() * Math.PI * 2,
    pulse: 0.35 + random() * 0.8,
    color: particleColor(profileName, kind, accent, random()),
  }
}

function resetParticle(particle, random, width, height, fromBottom = false) {
  particle.x = random() * width
  particle.y = fromBottom ? height + particle.length + random() * 24 : -particle.length - random() * 28
  particle.phase = random() * Math.PI * 2
}

function updateParticle(particle, delta, time, random, width, height) {
  if (particle.kind === 'rain') {
    particle.x += particle.vx * delta
    particle.y += particle.vy * delta
  } else {
    const drift = Math.sin(time * 0.00035 * particle.pulse + particle.phase)
    particle.x += (particle.vx + drift * (particle.kind === 'dust' ? 2.4 : 1.2)) * delta
    particle.y += particle.vy * delta
  }

  if (particle.y > height + particle.length + 12) resetParticle(particle, random, width, height)
  if (particle.y < -particle.length - 18) resetParticle(particle, random, width, height, true)
  if (particle.x < -30) particle.x = width + 30
  if (particle.x > width + 30) particle.x = -30
}

function drawParticle(context, particle, time, profileName) {
  const pulse = 0.82 + Math.sin(time * 0.001 * particle.pulse + particle.phase) * 0.18
  context.globalAlpha = particle.alpha * pulse

  if (particle.kind === 'rain') {
    context.beginPath()
    context.strokeStyle = rgba(particle.color, 1)
    context.lineWidth = 0.55 + particle.depth * 0.85
    context.moveTo(particle.x, particle.y)
    context.lineTo(particle.x + particle.vx * 0.045, particle.y - particle.length)
    context.stroke()
    return
  }

  context.beginPath()
  context.fillStyle = rgba(particle.color, 1)

  if (particle.kind === 'dust' && (profileName === 'dust' || profileName === 'closing')) {
    context.ellipse(
      particle.x,
      particle.y,
      particle.radius * 1.45,
      particle.radius * 0.62,
      particle.phase,
      0,
      Math.PI * 2,
    )
  } else {
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
  }

  context.fill()
}

function nearestPairs(particles, maxDistance, neighborsPerParticle = 2) {
  const candidates = particles
    .map((particle, index) => ({ particle, index }))
    .filter(({ particle }) => particle.kind === 'node')
  const uniquePairs = new Map()

  for (const source of candidates) {
    const nearest = []

    for (const target of candidates) {
      if (source.index === target.index) continue
      const dx = source.particle.x - target.particle.x
      const dy = source.particle.y - target.particle.y
      const distance = Math.hypot(dx, dy)
      if (distance <= maxDistance) nearest.push({ target, distance })
    }

    nearest.sort((first, second) => first.distance - second.distance)

    for (const neighbor of nearest.slice(0, neighborsPerParticle)) {
      const low = Math.min(source.index, neighbor.target.index)
      const high = Math.max(source.index, neighbor.target.index)
      uniquePairs.set(`${low}:${high}`, {
        first: particles[low],
        second: particles[high],
        distance: neighbor.distance,
        key: low * 53 + high * 97,
      })
    }
  }

  return [...uniquePairs.values()]
}

function drawNetwork(context, particles, profile, accent, time, reducedMotion) {
  if (!profile.network || profile.connectionDistance <= 0) return

  const pairs = nearestPairs(particles, profile.connectionDistance, 2)

  for (const pair of pairs) {
    const alpha = (1 - pair.distance / profile.connectionDistance) * profile.connectionAlpha
    if (alpha <= 0) continue

    context.beginPath()
    context.globalAlpha = alpha
    context.strokeStyle = rgba(accent, 1)
    context.lineWidth = 0.7
    context.moveTo(pair.first.x, pair.first.y)
    context.lineTo(pair.second.x, pair.second.y)
    context.stroke()

    if (!reducedMotion) {
      const progress = (time * 0.00016 + pair.key * 0.0017) % 1
      const pulseX = pair.first.x + (pair.second.x - pair.first.x) * progress
      const pulseY = pair.first.y + (pair.second.y - pair.first.y) * progress
      context.beginPath()
      context.globalAlpha = Math.min(0.66, alpha * 2.5)
      context.fillStyle = rgba(PALE, 1)
      context.arc(pulseX, pulseY, 1.15, 0, Math.PI * 2)
      context.fill()
    }
  }
}

function createSkyline(random, width, height, layer) {
  const buildings = []
  let x = -width * 0.03
  const baseWidth = layer === 0 ? width * 0.034 : width * 0.05
  const baseline = height * (layer === 0 ? 0.69 : 0.76)

  while (x < width * 1.04) {
    const buildingWidth = baseWidth * (0.55 + random() * 1.3)
    const buildingHeight = height * (layer === 0
      ? 0.035 + random() * 0.13
      : 0.055 + random() * 0.19)
    const antenna = random() > 0.74 ? buildingHeight * (0.16 + random() * 0.32) : 0

    buildings.push({
      x,
      y: baseline - buildingHeight,
      width: buildingWidth,
      height: buildingHeight,
      antenna,
      lit: random() > 0.62,
    })
    x += buildingWidth * (0.78 + random() * 0.32)
  }

  return buildings
}

function drawSkylineLayer(context, buildings, accent, layer, alpha) {
  context.save()
  context.globalAlpha = alpha * (layer === 0 ? 0.42 : 0.72)
  context.fillStyle = layer === 0 ? 'rgb(10, 18, 24)' : 'rgb(4, 9, 14)'

  for (const building of buildings) {
    context.fillRect(building.x, building.y, building.width, building.height)

    if (building.antenna > 0) {
      context.strokeStyle = rgba(accent, 0.22)
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(building.x + building.width * 0.58, building.y)
      context.lineTo(building.x + building.width * 0.58, building.y - building.antenna)
      context.stroke()
    }

    if (building.lit && building.width > 18) {
      context.fillStyle = rgba(accent, layer === 0 ? 0.1 : 0.075)
      const windowWidth = Math.max(1, building.width * 0.035)
      context.fillRect(
        building.x + building.width * 0.18,
        building.y + building.height * 0.28,
        windowWidth,
        Math.max(1, building.height * 0.06),
      )
      context.fillStyle = layer === 0 ? 'rgb(10, 18, 24)' : 'rgb(4, 9, 14)'
    }
  }

  context.restore()
}

function drawPerspectiveStreet(context, width, height, accent, alpha, strongDepth) {
  const horizon = height * 0.69
  const vanishingX = width * 0.54

  context.save()
  context.globalAlpha = alpha * (strongDepth ? 0.38 : 0.17)
  context.strokeStyle = rgba(accent, 0.32)
  context.lineWidth = 1

  const lanes = strongDepth ? 9 : 5
  for (let index = -lanes; index <= lanes; index += 1) {
    const endX = vanishingX + index * (width / Math.max(7, lanes * 1.45))
    context.beginPath()
    context.moveTo(vanishingX, horizon)
    context.lineTo(endX, height + 24)
    context.stroke()
  }

  const rows = strongDepth ? 9 : 5
  for (let index = 1; index <= rows; index += 1) {
    const depth = index / rows
    const y = horizon + depth * depth * (height - horizon + 30)
    context.globalAlpha = alpha * (0.04 + depth * (strongDepth ? 0.32 : 0.12))
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }

  const reflection = context.createLinearGradient(0, horizon, 0, height)
  reflection.addColorStop(0, rgba(accent, 0))
  reflection.addColorStop(0.72, rgba(accent, strongDepth ? 0.045 : 0.018))
  reflection.addColorStop(1, rgba(accent, strongDepth ? 0.09 : 0.032))
  context.globalAlpha = alpha
  context.fillStyle = reflection
  context.fillRect(0, horizon, width, height - horizon)
  context.restore()
}

function drawUtilityCables(context, width, height, accent, alpha) {
  context.save()
  context.globalAlpha = alpha * 0.22
  context.strokeStyle = rgba(accent, 0.28)
  context.lineWidth = 1

  for (let index = 0; index < 3; index += 1) {
    const y = height * (0.11 + index * 0.055)
    context.beginPath()
    context.moveTo(-20, y)
    context.quadraticCurveTo(width * (0.36 + index * 0.06), y + height * 0.075, width + 20, y - height * 0.015)
    context.stroke()
  }

  context.restore()
}

function rebuildBackdrop(canvas, ratio, width, height, profileName, profile, accent, seed) {
  canvas.width = Math.max(1, Math.round(width * ratio))
  canvas.height = Math.max(1, Math.round(height * ratio))
  const context = canvas.getContext('2d', { alpha: true })
  if (!context) return

  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)

  const random = mulberry32(seed ^ Math.round(width * 17) ^ Math.round(height * 31))
  const strongDepth = profileName === 'cover' || profileName === 'closing'
  const farBuildings = createSkyline(random, width, height, 0)
  const nearBuildings = createSkyline(random, width, height, 1)

  drawUtilityCables(context, width, height, accent, profile.backdropAlpha)
  drawSkylineLayer(context, farBuildings, accent, 0, profile.backdropAlpha)
  drawSkylineLayer(context, nearBuildings, accent, 1, profile.backdropAlpha)
  drawPerspectiveStreet(context, width, height, accent, profile.backdropAlpha, strongDepth)

  if (profileName === 'closing' || profileName === 'dust') {
    const glow = context.createRadialGradient(width * 0.18, height * 0.78, 0, width * 0.18, height * 0.78, width * 0.32)
    glow.addColorStop(0, rgba(SODIUM, 0.08))
    glow.addColorStop(1, rgba(SODIUM, 0))
    context.fillStyle = glow
    context.fillRect(0, 0, width, height)
  }
}

function drawBriefGlitch(context, width, height, time, startedAt, duration, seed) {
  const elapsed = time - startedAt
  if (elapsed < 0 || elapsed >= duration) return

  const intensity = Math.pow(1 - elapsed / duration, 2)
  const random = mulberry32(seed ^ Math.floor(elapsed / FRAME_INTERVAL))
  const bands = 2 + Math.floor(random() * 3)

  context.save()
  for (let index = 0; index < bands; index += 1) {
    const y = random() * height
    const bandHeight = 1 + random() * Math.min(13, height * 0.016)
    const startX = random() * width * 0.32
    const bandWidth = width * (0.2 + random() * 0.66)
    const color = index % 2 === 0 ? ALERT : PALE
    context.globalAlpha = intensity * (0.025 + random() * 0.075)
    context.fillStyle = rgba(color, 1)
    context.fillRect(startX, y, bandWidth, bandHeight)
  }

  context.globalAlpha = intensity * 0.1
  context.fillStyle = rgba(ALERT, 1)
  context.fillRect(width * (0.08 + random() * 0.72), 0, 1, height)
  context.restore()
}

export default function ParticleField({ mode = 'auto', slideId = '', accentRgb = DEFAULT_ACCENT }) {
  const canvasRef = useRef(null)
  const accentKey = accentSignature(accentRgb)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const context = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!context) return undefined

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = reducedMotionQuery.matches
    const profileName = resolveProfileName(mode, slideId)
    const accent = parseAccent(accentKey)
    const profile = { ...PROFILES[profileName], accent }
    const seed = hashString(`${profileName}:${slideId}:${accent.join(',')}`)
    const random = mulberry32(seed)
    const backdrop = document.createElement('canvas')
    const startedAt = performance.now()
    const glitchDuration = profile.glitch ? 260 + (seed % 100) : 0

    let width = 0
    let height = 0
    let ratio = 1
    let particles = []
    let animationFrame = null
    let resizeFrame = null
    let lastFrameTime = 0
    let disposed = false

    const drawFrame = (time, delta, update = true) => {
      context.clearRect(0, 0, width, height)
      context.globalAlpha = 1
      context.drawImage(backdrop, 0, 0, backdrop.width, backdrop.height, 0, 0, width, height)

      if (update) {
        for (const particle of particles) {
          updateParticle(particle, delta, time, random, width, height)
        }
      }

      drawNetwork(context, particles, profile, accent, time, reducedMotion)

      for (const particle of particles) {
        drawParticle(context, particle, time, profileName)
      }

      if (profile.glitch && !reducedMotion) {
        drawBriefGlitch(context, width, height, time, startedAt, glitchDuration, seed)
      }

      context.globalAlpha = 1
    }

    const createParticles = () => {
      const responsiveCount = width < 850 ? profile.count - 8 : profile.count
      const count = clamp(responsiveCount, 24, 48)
      particles = Array.from(
        { length: count },
        () => createParticle(profileName, profile, random, width, height),
      )
    }

    const resize = () => {
      if (disposed) return
      const bounds = canvas.getBoundingClientRect()
      width = Math.max(1, Math.round(bounds.width || window.innerWidth))
      height = Math.max(1, Math.round(bounds.height || window.innerHeight))
      ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR)

      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      rebuildBackdrop(backdrop, ratio, width, height, profileName, profile, accent, seed)
      createParticles()
      drawFrame(performance.now(), 0, false)
    }

    const schedule = () => {
      if (disposed || reducedMotion || document.hidden || animationFrame !== null) return
      animationFrame = window.requestAnimationFrame(render)
    }

    const render = (time) => {
      animationFrame = null
      if (disposed || document.hidden || reducedMotion) return

      const elapsed = time - lastFrameTime
      if (elapsed >= FRAME_INTERVAL) {
        const delta = Math.min(elapsed / 1000, 0.08)
        lastFrameTime = time - (elapsed % FRAME_INTERVAL)
        drawFrame(time, delta, true)
      }

      schedule()
    }

    const handleResize = () => {
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = null
        resize()
      })
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
        animationFrame = null
        return
      }

      lastFrameTime = performance.now()
      if (reducedMotion) drawFrame(lastFrameTime, 0, false)
      else schedule()
    }

    const handleReducedMotionChange = (event) => {
      reducedMotion = event.matches

      if (reducedMotion) {
        if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
        animationFrame = null
        drawFrame(performance.now(), 0, false)
        return
      }

      lastFrameTime = performance.now()
      schedule()
    }

    resize()

    if (!reducedMotion) {
      lastFrameTime = performance.now()
      schedule()
    }

    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    reducedMotionQuery.addEventListener?.('change', handleReducedMotionChange)

    return () => {
      disposed = true
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame)
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener?.('change', handleReducedMotionChange)
      particles = []
      backdrop.width = 1
      backdrop.height = 1
    }
  }, [mode, slideId, accentKey])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}
