import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { slides } from './data/slides.js'
import GlobalAtmosphereCanvas from './components/GlobalAtmosphereCanvas.jsx'
import { CyberVisual } from './components/CyberVisuals.jsx'

const SPEAKER_ACCENTS = {
  David: { color: '#3ef7ff', rgb: '62, 247, 255' },
  Luis: { color: '#ff3dc8', rgb: '255, 61, 200' },
  Francisco: { color: '#ffd64a', rgb: '255, 214, 74' },
  Marvin: { color: '#a779ff', rgb: '167, 121, 255' },
  Equipo: { color: '#3ef7ff', rgb: '62, 247, 255' },
}

const BLOCK_CHAPTERS = {
  'Bloque 1': {
    number: '01',
    speaker: 'DAVID',
    focus: 'PLANIFICACIÓN Y CONTROL',
  },
  'Bloque 2': {
    number: '02',
    speaker: 'LUIS',
    focus: 'ANÁLISIS Y DISEÑO',
  },
  'Bloque 3': {
    number: '03',
    speaker: 'FRANCISCO',
    focus: 'IMPLEMENTACIÓN Y EJECUCIÓN',
  },
  'Bloque 4': {
    number: '04',
    speaker: 'MARVIN',
    focus: 'EVALUACIÓN Y CIERRE',
  },
}

const TRANSITION_BUDGETS = {
  signal: 0.46,
  drift: 0.48,
  focus: 0.52,
  aperture: 0.55,
  glitch: 0.42,
}

const BLOCK_EXIT_DURATION = 0.72
const BLOCK_ENTER_DURATION = 0.52

const ATMOSPHERE_FAMILIES = {
  cover: {
    palette: ['#55e8ff', '#a779ff', '#ecfaff'],
    primaryRgb: '85, 232, 255',
    secondaryRgb: '167, 121, 255',
    images: [
      { image: '/assets/wallpaperflare.com_wallpaper.jpg', position: 'center 48%', imageOpacity: 0.72 },
      { image: '/assets/wallpaperflare.com_wallpaper (6).jpg', position: 'center 48%', imageOpacity: 0.46 },
    ],
  },
  david: {
    palette: ['#3ef7ff', '#77d9ff', '#dffbff'],
    primaryRgb: '62, 247, 255',
    secondaryRgb: '79, 161, 255',
    images: [
      { image: '/assets/wallpaperflare.com_wallpaper (7).jpg', position: 'center 52%', imageOpacity: 0.5 },
      { image: '/assets/wallpaperflare.com_wallpaper (6).jpg', position: 'center 46%', imageOpacity: 0.46 },
      { image: '/assets/wallpaperflare.com_wallpaper (1).jpg', position: 'center 52%', imageOpacity: 0.34 },
      { image: '/assets/wallpaperflare.com_wallpaper (3).jpg', position: 'center 51%', imageOpacity: 0.42 },
    ],
  },
  luis: {
    palette: ['#ff3dc8', '#3ef7ff', '#dffbff'],
    primaryRgb: '255, 61, 200',
    secondaryRgb: '62, 247, 255',
    images: [
      { image: '/assets/wallpaperflare.com_wallpaper (5).jpg', position: 'center 52%', imageOpacity: 0.45 },
      { image: '/assets/wallpaperflare.com_wallpaper (4).jpg', position: 'center 56%', imageOpacity: 0.24 },
      { image: '/assets/wallpaperflare.com_wallpaper (9).jpg', position: 'center 50%', imageOpacity: 0.25 },
      { image: '/assets/wallpaperflare.com_wallpaper (10).jpg', position: 'center 48%', imageOpacity: 0.2 },
    ],
  },
  francisco: {
    palette: ['#ffd64a', '#ff4e95', '#dffbff'],
    primaryRgb: '255, 214, 74',
    secondaryRgb: '255, 78, 149',
    images: [
      { image: '/assets/wallpaperflare.com_wallpaper (2).jpg', position: 'center 54%', imageOpacity: 0.44 },
      { image: '/assets/wallpaperflare.com_wallpaper (8).jpg', position: 'center 50%', imageOpacity: 0.28 },
      { image: '/assets/wallhaven-zp552w_3840x2160.png', position: 'center 52%', imageOpacity: 0.18 },
      { image: '/assets/wallpaperflare.com_wallpaper (3).jpg', position: 'center 51%', imageOpacity: 0.38 },
    ],
  },
  marvin: {
    palette: ['#a779ff', '#3ef7ff', '#ffd64a'],
    primaryRgb: '167, 121, 255',
    secondaryRgb: '62, 247, 255',
    images: [
      { image: '/assets/district-rain.webp', position: 'center 48%', imageOpacity: 0.48 },
      { image: '/assets/wallpaperflare.com_wallpaper (6).jpg', position: 'center 48%', imageOpacity: 0.42 },
      { image: '/assets/wallpaperflare.com_wallpaper (9).jpg', position: 'center 49%', imageOpacity: 0.22 },
      { image: '/assets/wallpaperflare.com_wallpaper (10).jpg', position: 'center 49%', imageOpacity: 0.19 },
    ],
  },
}

function atmosphereImageFor(family, slide) {
  const slidesInBlock = slides.filter((candidate) => candidate.block === slide.block)
  const slideIndex = Math.max(0, slidesInBlock.findIndex((candidate) => candidate.id === slide.id))
  return family.images[slideIndex % family.images.length]
}

function resolveAtmosphere(slide) {
  if (slide.kind === 'cover' || slide.kind === 'closing') {
    return {
      id: slide.kind === 'closing' ? 'closing' : 'cover',
      ...ATMOSPHERE_FAMILIES.cover,
      ...ATMOSPHERE_FAMILIES.cover.images[0],
    }
  }

  const block = String(slide.block ?? '').toLowerCase()
  const atmosphereId = block.includes('apertura')
    ? 'cover'
    : block.includes('1')
      ? 'david'
      : block.includes('2')
        ? 'luis'
        : block.includes('3')
          ? 'francisco'
          : 'marvin'
  const family = ATMOSPHERE_FAMILIES[atmosphereId]

  return { id: atmosphereId, ...family, ...atmosphereImageFor(family, slide) }
}

function Background() {
  return (
    <div className="deck-background" aria-hidden="true">
      <div className="deck-background__image" />
      <div className="deck-background__grade" />
      <div className="deck-background__fog deck-background__fog--primary" />
      <div className="deck-background__fog deck-background__fog--secondary" />
      <div className="deck-background__hud" />
      <div className="deck-background__interference" />
    </div>
  )
}

const CURTAIN_SLICES = [
  'polygon(0 0, 100% 0, 100% 24%, 0 20%)',
  'polygon(0 16%, 100% 20%, 100% 44%, 0 40%)',
  'polygon(0 36%, 100% 40%, 100% 64%, 0 60%)',
  'polygon(0 56%, 100% 60%, 100% 84%, 0 80%)',
  'polygon(0 76%, 100% 80%, 100% 100%, 0 100%)',
]

const CURTAIN_STYLE = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  overflow: 'hidden',
  pointerEvents: 'none',
  opacity: 0,
  visibility: 'hidden',
  isolation: 'isolate',
}

const CURTAIN_EDGE_STYLE = {
  position: 'absolute',
  zIndex: 4,
  top: 0,
  bottom: 0,
  left: 0,
  width: '2px',
  background: 'var(--accent)',
  boxShadow: '0 0 28px 6px rgba(var(--accent-rgb), .7)',
  willChange: 'transform',
}

const CURTAIN_SIGNAL_STYLE = {
  position: 'absolute',
  zIndex: 5,
  top: '50%',
  left: '50%',
  padding: '.55rem .8rem',
  border: '1px solid rgba(var(--accent-rgb), .35)',
  transform: 'translate(-50%, -50%)',
  background: 'rgba(2, 6, 11, .88)',
  color: 'var(--accent)',
  font: '700 .58rem/1 var(--mono)',
  letterSpacing: '.2em',
  whiteSpace: 'nowrap',
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const formatBlock = (block) => {
  const match = String(block).match(/\d+/)
  return match ? `BLOQUE ${match[0].padStart(2, '0')}` : block
}

function resolveTransitionFamily(preset = '') {
  if (/fault|comparison|glitch|flash|corruption/.test(preset)) return 'glitch'
  if (/aperture|split|barrier|lock|check|eclipse|radial/.test(preset)) return 'aperture'
  if (/orbit|zoom|dashboard|heat|monolith|rewind|journey/.test(preset)) return 'focus'
  if (/lane|branch|node|flow|rank|transfer|conveyor|shift/.test(preset)) return 'drift'
  return 'signal'
}

function resolveTransitionDuration(slide, family) {
  const authored = clamp((slide.transition?.duration ?? 0.82) * 0.5, 0.4, 0.58)
  const familyBudget = TRANSITION_BUDGETS[family] ?? TRANSITION_BUDGETS.signal
  return clamp((authored + familyBudget) / 2, 0.4, 0.58)
}

function isSpeakerBlock(slide) {
  return Boolean(slide && BLOCK_CHAPTERS[slide.block])
}

function isChapterBoundary(outgoingSlide, incomingSlide) {
  if (!isSpeakerBlock(incomingSlide) || outgoingSlide.block === incomingSlide.block) return false
  return isSpeakerBlock(outgoingSlide) || outgoingSlide.kind === 'team'
}

function getCurtainParts(curtain) {
  return {
    slices: curtain ? [...curtain.querySelectorAll('.transition-curtain__slice')] : [],
    edge: curtain?.querySelector('.transition-curtain__edge') ?? null,
    signal: curtain?.querySelector('.transition-curtain__signal') ?? null,
    depth: curtain?.querySelector('.transition-curtain__depth') ?? null,
    scan: curtain?.querySelector('.transition-curtain__scan') ?? null,
    glitchBands: curtain ? [...curtain.querySelectorAll('.transition-curtain__glitch-band')] : [],
  }
}

function getBlockTransitionParts(overlay) {
  return {
    outgoing: overlay?.querySelector('.block-transition__outgoing') ?? null,
    outgoingBlock: overlay?.querySelector('[data-block-outgoing]') ?? null,
    incoming: overlay?.querySelector('.block-transition__incoming') ?? null,
    incomingBlock: overlay?.querySelector('[data-block-incoming]') ?? null,
    incomingSpeaker: overlay?.querySelector('[data-block-speaker]') ?? null,
    incomingFocus: overlay?.querySelector('[data-block-focus]') ?? null,
    scan: overlay?.querySelector('.block-transition__scan') ?? null,
    grid: overlay?.querySelector('.block-transition__grid') ?? null,
  }
}

function collectSceneTargets(scene) {
  const revealNodes = scene ? [...scene.querySelectorAll('[data-reveal]')] : []
  const titleWords = revealNodes.filter((node) => node.dataset.reveal === 'title-word')
  const visualReveals = revealNodes.filter((node) => node.dataset.reveal === 'visual')
  const supportingReveals = revealNodes.filter((node) => (
    node.dataset.reveal !== 'title-word' && node.dataset.reveal !== 'visual'
  ))
  const supportingGroups = [...supportingReveals.reduce((groups, node) => {
    const beat = Number.parseInt(node.dataset.beat ?? '0', 10)
    const key = Number.isFinite(beat) ? beat : 0
    const group = groups.get(key) ?? []
    group.push(node)
    groups.set(key, group)
    return groups
  }, new Map()).entries()].sort(([left], [right]) => left - right)

  return {
    revealNodes,
    titleWords,
    visualReveals,
    supportingGroups,
    flowLines: scene ? [...scene.querySelectorAll('[data-flow-line]')] : [],
    glitchTargets: scene ? [...scene.querySelectorAll('[data-glitch-target]')] : [],
  }
}

function titleEntranceOffset(family, direction) {
  switch (family) {
    case 'drift': return { xPercent: direction * 18, yPercent: 0, rotateX: 0, scale: 1 }
    case 'focus': return { xPercent: 0, yPercent: 8, rotateX: 0, scale: 0.94 }
    case 'aperture': return { xPercent: 0, yPercent: 110, rotateX: -18, scale: 1 }
    case 'glitch': return { xPercent: direction * 7, yPercent: 0, rotateX: 0, scale: 1 }
    default: return { xPercent: 0, yPercent: 92, rotateX: -10, scale: 1 }
  }
}

function supportingEntranceOffset(family, direction) {
  switch (family) {
    case 'drift': return { x: direction * 24, y: 0, scale: 1, rotateX: 0 }
    case 'focus': return { x: 0, y: 8, scale: 0.965, rotateX: 0 }
    case 'aperture': return { x: 0, y: 11, scale: 1, rotateX: -8 }
    case 'glitch': return { x: direction * 9, y: 0, scale: 1, rotateX: 0 }
    default: return { x: 0, y: 9, scale: 1, rotateX: 0 }
  }
}

function addControlledGlitch(timeline, deck, targets, position) {
  if (!deck || !targets.length) return

  timeline
    .call(() => deck.classList.add('deck-shell--glitching'), null, position)
    .to(targets, {
      x: -3,
      y: 1,
      textShadow: '5px 0 0 rgba(62, 247, 255, .34), -4px 0 0 rgba(255, 61, 200, .26)',
      duration: 0.045,
      ease: 'steps(1)',
    }, position)
    .to(targets, {
      x: 3,
      y: -1,
      textShadow: '-5px 0 0 rgba(255, 61, 200, .34), 4px 0 0 rgba(62, 247, 255, .24)',
      duration: 0.045,
      ease: 'steps(1)',
    }, position + 0.045)
    .to(targets, {
      x: 0,
      y: 0,
      textShadow: 'none',
      duration: 0.055,
      ease: 'steps(1)',
    }, position + 0.09)
    .call(() => deck.classList.remove('deck-shell--glitching'), null, position + 0.15)
}

function KineticTitle({ title }) {
  const words = title.trim().split(/\s+/)

  return (
    <h2 className="scene-heading__kinetic" aria-label={title}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span
            className="scene-heading__word"
            data-reveal="title-word"
            aria-hidden="true"
            style={{ display: 'inline-block' }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h2>
  )
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  ))

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = (event) => setReducedMotion(event.matches)

    setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener?.('change', updatePreference)
    return () => mediaQuery.removeEventListener?.('change', updatePreference)
  }, [])

  return reducedMotion
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window === 'undefined') return 0
    const requested = Number.parseInt(new URLSearchParams(window.location.search).get('slide') ?? '1', 10)
    return Number.isFinite(requested) ? clamp(requested - 1, 0, slides.length - 1) : 0
  })
  const [replayToken, setReplayToken] = useState(0)
  const reducedMotion = useReducedMotion()

  const deckRef = useRef(null)
  const sceneContentRef = useRef(null)
  const curtainRef = useRef(null)
  const blockTransitionRef = useRef(null)
  const activeTimelineRef = useRef(null)
  const pendingTransitionRef = useRef(null)
  const queuedTargetRef = useRef(null)
  const queuedFrameRef = useRef(null)
  const navigationIntentRef = useRef(currentIndex)
  const goToRef = useRef(null)
  const currentIndexRef = useRef(0)
  const directionRef = useRef(1)
  const lockedRef = useRef(false)
  const pointerRef = useRef(null)

  const currentSlide = slides[currentIndex]
  const isMinimalScene = currentSlide.kind === 'cover' || currentSlide.kind === 'closing'
  const displayBlock = formatBlock(currentSlide.block)
  const slideNumber = currentIndex + 1
  const accent = SPEAKER_ACCENTS[currentSlide.speaker] ?? SPEAKER_ACCENTS.Equipo
  const layout = currentSlide.visual?.layout ?? currentSlide.kind
  const intensity = currentSlide.visual?.intensity ?? 'calm'
  const visualAccent = currentSlide.visual?.accent ?? currentSlide.speaker.toLowerCase()
  const transitionPreset = currentSlide.transition?.preset ?? 'signal'
  const transitionFamily = resolveTransitionFamily(transitionPreset)
  const atmosphere = useMemo(() => resolveAtmosphere(currentSlide), [currentSlide])

  currentIndexRef.current = currentIndex

  const deckStyle = useMemo(() => ({
    '--accent': accent.color,
    '--accent-rgb': accent.rgb,
    '--atmo-image': `url("${atmosphere.image}")`,
    '--atmo-position': atmosphere.position,
    '--atmo-image-opacity': atmosphere.imageOpacity,
    '--atmo-primary-rgb': atmosphere.primaryRgb,
    '--atmo-secondary-rgb': atmosphere.secondaryRgb,
  }), [accent.color, accent.rgb, atmosphere])

  useLayoutEffect(() => {
    if (reducedMotion || !deckRef.current) return undefined

    const context = gsap.context(() => {
      const drift = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
      drift
        .to('.deck-background__fog--primary', { xPercent: 5, yPercent: -4, duration: 16 }, 0)
        .to('.deck-background__fog--secondary', { xPercent: -6, yPercent: 3, duration: 21 }, 0)
        .to('.deck-background__hud', { opacity: 0.42, duration: 11 }, 0)

      gsap.timeline({ repeat: -1, repeatDelay: 14 })
        .to('.deck-background__interference', { opacity: 0.18, duration: 0.1 })
        .to('.deck-background__interference', { opacity: 0.035, duration: 0.12 })
        .to('.deck-background__interference', { opacity: 0, duration: 0.08 })
    }, deckRef)

    return () => context.revert()
  }, [atmosphere.id, reducedMotion])

  const settleTransition = useCallback(() => {
    if (queuedFrameRef.current !== null) {
      window.cancelAnimationFrame(queuedFrameRef.current)
      queuedFrameRef.current = null
    }

    const scene = sceneContentRef.current
    const curtain = curtainRef.current
    const blockOverlay = blockTransitionRef.current
    const ambient = deckRef.current?.querySelector('.deck-ambient')
    const { revealNodes, flowLines, glitchTargets } = collectSceneTargets(scene)
    const { slices, edge, signal, depth, scan, glitchBands } = getCurtainParts(curtain)
    const blockParts = getBlockTransitionParts(blockOverlay)
    const restingDirection = directionRef.current < 0 ? -118 : 118

    if (scene) gsap.set(scene, { clearProps: 'transform,opacity,visibility,filter' })
    if (revealNodes.length) {
      gsap.set(revealNodes, { clearProps: 'transform,opacity,visibility,filter,textShadow' })
    }
    if (flowLines.length) {
      gsap.set(flowLines, { clearProps: 'transform,opacity,visibility,strokeDasharray,strokeDashoffset' })
    }
    if (glitchTargets.length) gsap.set(glitchTargets, { clearProps: 'transform,filter,textShadow' })
    if (slices.length) {
      gsap.set(slices, {
        xPercent: restingDirection,
        yPercent: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        clearProps: 'opacity,visibility,filter',
      })
    }
    if (edge) gsap.set(edge, { clearProps: 'transform,opacity,visibility' })
    if (signal) gsap.set(signal, { clearProps: 'opacity,visibility' })
    if (depth) gsap.set(depth, { clearProps: 'clipPath,transform,opacity,visibility' })
    if (scan) gsap.set(scan, { clearProps: 'transform,opacity,visibility' })
    if (glitchBands.length) gsap.set(glitchBands, { clearProps: 'transform,opacity,visibility' })
    if (curtain) gsap.set(curtain, { autoAlpha: 0 })
    if (ambient) gsap.set(ambient, { clearProps: 'opacity' })
    if (blockOverlay) {
      gsap.set([
        blockOverlay,
        blockParts.outgoing,
        blockParts.incoming,
        blockParts.scan,
        blockParts.grid,
      ].filter(Boolean), { clearProps: 'clipPath,transform,opacity,visibility,filter' })
      gsap.set(blockOverlay, { autoAlpha: 0 })
      blockOverlay.removeAttribute('data-direction')
      blockOverlay.style.removeProperty('--chapter-accent')
      blockOverlay.style.removeProperty('--chapter-accent-rgb')
    }

    deckRef.current?.classList.remove('deck-shell--transitioning', 'deck-shell--glitching')
    if (deckRef.current) {
      deckRef.current.dataset.transitionPhase = 'idle'
      delete deckRef.current.dataset.activeTransition
    }
    const queuedTarget = queuedTargetRef.current
    pendingTransitionRef.current = null
    lockedRef.current = false
    navigationIntentRef.current = currentIndexRef.current

    if (
      queuedTarget !== null
      && queuedTarget !== currentIndexRef.current
      && deckRef.current?.isConnected
    ) {
      navigationIntentRef.current = queuedTarget
      queuedFrameRef.current = window.requestAnimationFrame(() => {
        queuedFrameRef.current = null
        if (lockedRef.current) return
        if (
          navigationIntentRef.current !== queuedTarget
          || currentIndexRef.current === queuedTarget
          || !deckRef.current?.isConnected
        ) {
          if (queuedTargetRef.current === queuedTarget) queuedTargetRef.current = null
          return
        }

        queuedTargetRef.current = null
        goToRef.current?.(queuedTarget)
      })
    } else {
      queuedTargetRef.current = null
    }
  }, [])

  const interruptActiveTransition = useCallback(() => {
    const activeTimeline = activeTimelineRef.current
    activeTimelineRef.current = null

    if (activeTimeline) {
      activeTimeline.eventCallback('onComplete', null)
      activeTimeline.eventCallback('onInterrupt', null)
      activeTimeline.kill()
    }

    settleTransition()
  }, [settleTransition])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.()
      } else {
        await document.documentElement.requestFullscreen?.({ navigationUI: 'hide' })
      }
    } catch {
      // F11 remains available if the browser denies the Fullscreen API.
    }
  }, [])

  const goTo = useCallback((requestedIndex) => {
    if (queuedFrameRef.current !== null) {
      window.cancelAnimationFrame(queuedFrameRef.current)
      queuedFrameRef.current = null
    }
    queuedTargetRef.current = null

    const fromIndex = currentIndexRef.current
    const targetIndex = clamp(requestedIndex, 0, slides.length - 1)

    navigationIntentRef.current = targetIndex
    if (lockedRef.current) {
      queuedTargetRef.current = targetIndex
      return
    }
    if (targetIndex === fromIndex) return

    const direction = targetIndex > fromIndex ? 1 : -1
    const outgoingSlide = slides[fromIndex]
    const incomingSlide = slides[targetIndex]
    const family = resolveTransitionFamily(incomingSlide.transition?.preset)
    const isBlock = isChapterBoundary(outgoingSlide, incomingSlide)
    const duration = isBlock
      ? BLOCK_EXIT_DURATION + BLOCK_ENTER_DURATION
      : resolveTransitionDuration(incomingSlide, family)
    const scene = sceneContentRef.current
    const curtain = curtainRef.current
    const blockOverlay = blockTransitionRef.current
    const deck = deckRef.current

    directionRef.current = direction

    if (reducedMotion || !scene || !curtain || !deck) {
      interruptActiveTransition()
      currentIndexRef.current = targetIndex
      setCurrentIndex(targetIndex)
      return
    }

    const {
      slices,
      edge,
      signal,
      depth,
      scan,
      glitchBands,
    } = getCurtainParts(curtain)
    const { revealNodes, titleWords, glitchTargets } = collectSceneTargets(scene)
    const blockParts = getBlockTransitionParts(blockOverlay)
    const viewportWidth = window.innerWidth
    const sliceOrigin = direction > 0 ? -118 : 118
    const edgeOrigin = direction > 0 ? -8 : viewportWidth + 8
    const edgeDestination = direction > 0 ? viewportWidth + 8 : -8
    const staggerFrom = family === 'aperture' ? 'center' : direction > 0 ? 'start' : 'end'

    pendingTransitionRef.current = {
      direction,
      duration,
      family,
      fromIndex,
      isBlock,
      targetIndex,
    }
    lockedRef.current = true
    deck.classList.add('deck-shell--transitioning')
    deck.dataset.transitionPhase = isBlock ? 'chapter-exit' : 'exiting'
    deck.dataset.activeTransition = family
    curtain.dataset.family = family

    gsap.set(scene, { clearProps: 'transform,opacity,visibility,filter' })
    if (revealNodes.length) {
      gsap.set(revealNodes, { clearProps: 'transform,opacity,visibility,filter,textShadow' })
    }
    gsap.set(curtain, { autoAlpha: 1 })
    if (signal) {
      signal.textContent = `${family === 'glitch' ? 'SYNC' : 'SIGNAL'} // ${String(targetIndex + 1).padStart(2, '0')}`
      gsap.set(signal, { autoAlpha: 0 })
    }
    if (depth) gsap.set(depth, { autoAlpha: 0, clipPath: 'circle(0% at 50% 50%)', scale: 1.08 })
    if (scan) gsap.set(scan, { x: edgeOrigin, autoAlpha: 0 })
    if (glitchBands.length) {
      gsap.set(glitchBands, {
        xPercent: (index) => (index % 2 ? 112 : -112),
        autoAlpha: 0,
      })
    }

    switch (family) {
      case 'aperture':
        gsap.set(slices, {
          xPercent: 0,
          yPercent: 0,
          scaleX: 0,
          transformOrigin: (index) => (index % 2 ? '100% 50%' : '0% 50%'),
        })
        break
      case 'focus':
        gsap.set(slices, { autoAlpha: 0, xPercent: 0 })
        if (depth) gsap.set(depth, { autoAlpha: 1 })
        break
      case 'drift':
        gsap.set(slices, {
          xPercent: (index) => sliceOrigin * (index % 2 ? 1 : 0.82),
          yPercent: (index) => (index - 2) * 4,
          skewX: direction * -4,
        })
        break
      case 'glitch':
        gsap.set(slices, {
          xPercent: (index) => (index % 2 ? -sliceOrigin : sliceOrigin),
          yPercent: (index) => (index - 2) * 2.4,
        })
        break
      default:
        gsap.set(slices, { xPercent: sliceOrigin, yPercent: 0, skewX: 0 })
        break
    }

    if (edge) gsap.set(edge, { x: edgeOrigin, autoAlpha: family === 'focus' ? 0 : 1 })

    if (isBlock && blockOverlay) {
      const outgoingLabel = isSpeakerBlock(outgoingSlide)
        ? `${formatBlock(outgoingSlide.block)} // ${outgoingSlide.speaker.toUpperCase()}`
        : 'APERTURA // EQUIPO'
      const chapter = BLOCK_CHAPTERS[incomingSlide.block]
      const chapterAccent = SPEAKER_ACCENTS[incomingSlide.speaker] ?? SPEAKER_ACCENTS.Equipo

      if (blockParts.outgoingBlock) blockParts.outgoingBlock.textContent = outgoingLabel
      if (blockParts.incomingBlock) blockParts.incomingBlock.textContent = `BLOQUE ${chapter.number}`
      if (blockParts.incomingSpeaker) blockParts.incomingSpeaker.textContent = chapter.speaker
      if (blockParts.incomingFocus) blockParts.incomingFocus.textContent = chapter.focus
      blockOverlay.dataset.direction = String(direction)
      blockOverlay.style.setProperty('--chapter-accent', chapterAccent.color)
      blockOverlay.style.setProperty('--chapter-accent-rgb', chapterAccent.rgb)
      gsap.set(blockOverlay, { autoAlpha: 1, clipPath: 'inset(50% 0 50% 0)' })
      gsap.set([blockParts.outgoing, blockParts.incoming].filter(Boolean), { autoAlpha: 0 })
      if (blockParts.scan) gsap.set(blockParts.scan, { x: edgeOrigin, autoAlpha: 0 })
      if (blockParts.grid) gsap.set(blockParts.grid, { autoAlpha: 0.12, scale: 1.04 })
    }

    const timeline = gsap.timeline({
      paused: true,
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        if (activeTimelineRef.current !== timeline) return
        activeTimelineRef.current = null
        currentIndexRef.current = targetIndex
        setCurrentIndex(targetIndex)
      },
      onInterrupt: () => {
        if (activeTimelineRef.current !== timeline) return
        activeTimelineRef.current = null
        settleTransition()
      },
    })

    if (isBlock && blockOverlay) {
      timeline
        .to(scene, {
          autoAlpha: 0,
          x: direction * -18,
          duration: 0.2,
          ease: 'power2.in',
        }, 0)
        .to(slices, {
          xPercent: 0,
          yPercent: 0,
          scaleX: 1,
          skewX: 0,
          autoAlpha: 1,
          duration: 0.24,
          stagger: { each: 0.012, from: staggerFrom },
          ease: 'power3.inOut',
        }, 0)
        .to(blockOverlay, {
          clipPath: 'inset(0% 0 0% 0)',
          duration: 0.22,
          ease: 'power3.inOut',
        }, 0.12)
        .to('.deck-ambient', {
          opacity: 0.24,
          duration: 0.22,
          ease: 'power2.inOut',
        }, 0.12)
        .fromTo(blockParts.outgoing, {
          autoAlpha: 0,
          y: 9,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.12,
          ease: 'power2.out',
        }, 0.24)
        .to(blockParts.outgoing, {
          autoAlpha: 0,
          y: -8,
          duration: 0.1,
          ease: 'power2.in',
        }, 0.39)
        .fromTo(blockParts.incoming, {
          autoAlpha: 0,
          y: 12,
          scale: 0.98,
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.18,
          ease: 'power3.out',
        }, 0.43)

      if (blockParts.scan) {
        timeline.fromTo(blockParts.scan, {
          x: edgeOrigin,
          autoAlpha: 0,
        }, {
          x: edgeDestination,
          autoAlpha: 0.92,
          duration: 0.36,
          ease: 'power2.inOut',
        }, 0.2)
      }
      addControlledGlitch(
        timeline,
        deck,
        [blockOverlay.querySelector('.block-transition__status')].filter(Boolean),
        0.31,
      )
      timeline.call(() => {}, null, BLOCK_EXIT_DURATION)
    } else {
      const exitDuration = duration * 0.43
      const sceneExit = family === 'focus'
        ? { autoAlpha: 0, scale: 1.025, y: -4 }
        : family === 'drift'
          ? { autoAlpha: 0.08, x: direction * -22 }
          : family === 'glitch'
            ? { autoAlpha: 0, x: direction * -7 }
            : { autoAlpha: 0.08, y: -5 }

      timeline.to(scene, {
        ...sceneExit,
        duration: Math.min(0.19, exitDuration * 0.78),
        ease: 'power2.in',
      }, 0)

      switch (family) {
        case 'aperture':
          timeline.to(slices, {
            scaleX: 1,
            duration: exitDuration,
            stagger: { each: 0.012, from: 'center' },
            ease: 'power3.inOut',
          }, 0)
          break
        case 'focus':
          if (depth) {
            timeline.to(depth, {
              clipPath: 'circle(76% at 50% 50%)',
              scale: 1,
              duration: exitDuration,
              ease: 'power3.inOut',
            }, 0)
          }
          break
        case 'drift':
          timeline.to(slices, {
            xPercent: 0,
            yPercent: 0,
            skewX: 0,
            duration: exitDuration,
            stagger: { each: 0.014, from: staggerFrom },
            ease: 'power3.inOut',
          }, 0)
          break
        case 'glitch':
          timeline.to(slices, {
            xPercent: 0,
            yPercent: 0,
            duration: exitDuration * 0.84,
            stagger: 0.008,
            ease: 'steps(4)',
          }, 0)
          if (glitchBands.length) {
            timeline.to(glitchBands, {
              xPercent: 0,
              autoAlpha: 0.72,
              duration: 0.14,
              stagger: 0.018,
              ease: 'steps(3)',
            }, 0.025)
          }
          addControlledGlitch(timeline, deck, [...titleWords, ...glitchTargets], 0.025)
          break
        default:
          timeline.to(slices, {
            xPercent: 0,
            duration: exitDuration,
            stagger: { each: 0.014, from: staggerFrom },
            ease: 'power3.inOut',
          }, 0)
          break
      }

      if (edge && family !== 'focus') {
        timeline.to(edge, {
          x: edgeDestination,
          duration: exitDuration,
          ease: 'power3.inOut',
        }, 0)
      }
      if (scan && family === 'signal') {
        timeline.fromTo(scan, {
          x: edgeOrigin,
          autoAlpha: 0,
        }, {
          x: edgeDestination,
          autoAlpha: 0.7,
          duration: exitDuration,
          ease: 'power2.inOut',
        }, 0)
      }
      if (signal) {
        timeline.to(signal, {
          autoAlpha: 1,
          duration: Math.min(0.1, exitDuration * 0.42),
          ease: 'power1.out',
        }, exitDuration * 0.48)
      }
    }

    activeTimelineRef.current = timeline
    timeline.play(0)
  }, [interruptActiveTransition, reducedMotion, settleTransition])

  goToRef.current = goTo

  const goRelative = useCallback((step) => {
    goTo(navigationIntentRef.current + step)
  }, [goTo])

  const replayEntrance = useCallback(() => {
    if (lockedRef.current || queuedFrameRef.current !== null) return
    directionRef.current = 1
    setReplayToken((token) => token + 1)
  }, [])

  useLayoutEffect(() => {
    const scene = sceneContentRef.current
    const curtain = curtainRef.current
    const blockOverlay = blockTransitionRef.current
    const deck = deckRef.current
    if (!scene || !curtain || !deck) return undefined

    if (reducedMotion) {
      settleTransition()
      return undefined
    }

    const pending = pendingTransitionRef.current
    const family = pending?.family ?? transitionFamily
    const isBlock = Boolean(pending?.isBlock)
    const duration = pending?.duration ?? resolveTransitionDuration(currentSlide, family)
    const enterDuration = isBlock ? BLOCK_ENTER_DURATION : duration * 0.57
    const {
      revealNodes,
      titleWords,
      visualReveals,
      supportingGroups,
      flowLines,
      glitchTargets,
    } = collectSceneTargets(scene)
    const { slices, edge, signal, depth, scan, glitchBands } = getCurtainParts(curtain)
    const blockParts = getBlockTransitionParts(blockOverlay)
    const viewportWidth = window.innerWidth
    const direction = pending?.direction ?? directionRef.current
    const sliceDestination = direction > 0 ? 118 : -118
    const edgeOrigin = direction > 0 ? -8 : viewportWidth + 8
    const edgeDestination = direction > 0 ? viewportWidth + 8 : -8
    const staggerFrom = family === 'aperture'
      ? 'center'
      : direction > 0 ? 'start' : 'end'

    lockedRef.current = true
    deck.classList.add('deck-shell--transitioning')
    deck.dataset.transitionPhase = isBlock ? 'chapter-enter' : 'entering'
    deck.dataset.activeTransition = family
    curtain.dataset.family = family

    gsap.set(scene, { autoAlpha: 0 })
    if (revealNodes.length) gsap.set(revealNodes, { autoAlpha: 0 })
    flowLines.forEach((line) => {
      if (typeof line.getTotalLength === 'function') {
        const length = Math.max(1, line.getTotalLength())
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length, autoAlpha: 1 })
        return
      }

      const vertical = line.dataset.flowLine === 'vertical'
      gsap.set(line, {
        autoAlpha: 0.24,
        scaleX: vertical ? 1 : 0,
        scaleY: vertical ? 0 : 1,
        transformOrigin: vertical
          ? (direction > 0 ? '50% 0%' : '50% 100%')
          : (direction > 0 ? '0% 50%' : '100% 50%'),
      })
    })

    if (isBlock && blockOverlay) {
      gsap.set(curtain, { autoAlpha: 0 })
      gsap.set(blockOverlay, { autoAlpha: 1, clipPath: 'inset(0% 0 0% 0)' })
      if (blockParts.incoming) gsap.set(blockParts.incoming, { autoAlpha: 1, y: 0, scale: 1 })
    } else {
      gsap.set(curtain, { autoAlpha: 1 })
      if (signal) gsap.set(signal, { autoAlpha: 1 })
      if (scan) gsap.set(scan, { x: edgeOrigin, autoAlpha: family === 'signal' ? 0.7 : 0 })
      if (glitchBands.length) gsap.set(glitchBands, { xPercent: 0, autoAlpha: family === 'glitch' ? 0.72 : 0 })

      switch (family) {
        case 'focus':
          gsap.set(slices, { autoAlpha: 0, xPercent: 0 })
          if (depth) gsap.set(depth, { autoAlpha: 1, clipPath: 'circle(76% at 50% 50%)', scale: 1 })
          if (edge) gsap.set(edge, { autoAlpha: 0 })
          break
        case 'aperture':
          gsap.set(slices, { autoAlpha: 1, xPercent: 0, yPercent: 0, scaleX: 1 })
          if (edge) gsap.set(edge, { x: edgeOrigin, autoAlpha: 1 })
          break
        default:
          gsap.set(slices, { autoAlpha: 1, xPercent: 0, yPercent: 0, scaleX: 1, skewX: 0 })
          if (edge) gsap.set(edge, { x: edgeOrigin, autoAlpha: 1 })
          break
      }
    }

    const timeline = gsap.timeline({
      paused: true,
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        if (activeTimelineRef.current !== timeline) return
        activeTimelineRef.current = null
        settleTransition()
      },
      onInterrupt: () => {
        if (activeTimelineRef.current !== timeline) return
        activeTimelineRef.current = null
        settleTransition()
      },
    })

    if (isBlock && blockOverlay) {
      const exitClip = direction > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)'
      timeline
        .to(blockParts.incoming, {
          autoAlpha: 0,
          y: -10,
          duration: 0.14,
          ease: 'power2.in',
        }, 0.08)
        .to(blockOverlay, {
          clipPath: exitClip,
          duration: 0.34,
          ease: 'power3.inOut',
        }, 0.12)
        .to('.deck-ambient', {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }, 0.12)
        .to(scene, {
          autoAlpha: 1,
          duration: 0.28,
          ease: 'power2.out',
        }, 0.16)
    } else {
      switch (family) {
        case 'aperture':
          timeline.to(slices, {
            scaleX: 0,
            duration: enterDuration,
            stagger: { each: 0.012, from: 'center' },
            ease: 'power3.inOut',
          }, 0)
          break
        case 'focus':
          if (depth) {
            timeline.to(depth, {
              clipPath: 'circle(0% at 50% 50%)',
              scale: 1.08,
              duration: enterDuration,
              ease: 'power3.inOut',
            }, 0)
          }
          break
        case 'drift':
          timeline.to(slices, {
            xPercent: (index) => sliceDestination * (index % 2 ? 1 : 0.82),
            yPercent: (index) => (index - 2) * -4,
            skewX: direction * 4,
            duration: enterDuration,
            stagger: { each: 0.014, from: staggerFrom },
            ease: 'power3.inOut',
          }, 0)
          break
        case 'glitch':
          timeline.to(slices, {
            xPercent: (index) => (index % 2 ? -sliceDestination : sliceDestination),
            yPercent: (index) => (index - 2) * -2.4,
            duration: enterDuration * 0.82,
            stagger: 0.008,
            ease: 'steps(4)',
          }, 0)
          if (glitchBands.length) {
            timeline.to(glitchBands, {
              xPercent: (index) => (index % 2 ? 118 : -118),
              autoAlpha: 0,
              duration: 0.14,
              stagger: 0.016,
              ease: 'steps(3)',
            }, 0.02)
          }
          break
        default:
          timeline.to(slices, {
            xPercent: sliceDestination,
            duration: enterDuration,
            stagger: { each: 0.014, from: staggerFrom },
            ease: 'power3.inOut',
          }, 0)
          break
      }

      timeline.to(scene, {
        autoAlpha: 1,
        duration: Math.min(0.24, enterDuration * 0.82),
        ease: 'power2.out',
      }, Math.min(0.045, enterDuration * 0.12))

      if (edge && family !== 'focus') {
        timeline.to(edge, {
          x: edgeDestination,
          duration: enterDuration,
          ease: 'power3.inOut',
        }, 0)
      }
      if (scan && family === 'signal') {
        timeline.to(scan, {
          x: edgeDestination,
          autoAlpha: 0,
          duration: enterDuration,
          ease: 'power2.inOut',
        }, 0)
      }
      if (signal) {
        timeline.to(signal, {
          autoAlpha: 0,
          duration: Math.min(0.1, enterDuration * 0.4),
          ease: 'power1.in',
        }, 0.035)
      }
    }

    const contentStart = isBlock ? 0.16 : 0.035
    const supportingOffset = supportingEntranceOffset(family, direction)
    supportingGroups.forEach(([beat, group], groupIndex) => {
      timeline.fromTo(group, {
        autoAlpha: 0,
        ...supportingOffset,
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.14,
        stagger: 0.012,
        ease: beat >= 3 ? 'power3.out' : 'power2.out',
      }, contentStart + groupIndex * 0.035)
    })
    if (titleWords.length) {
      const titleOffset = titleEntranceOffset(family, direction)
      timeline.fromTo(titleWords, {
        autoAlpha: 0,
        ...titleOffset,
      }, {
        autoAlpha: 1,
        xPercent: 0,
        yPercent: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.17,
        stagger: 0.012,
        ease: 'power3.out',
      }, contentStart)
    }
    if (visualReveals.length) {
      timeline.fromTo(visualReveals, {
        autoAlpha: 0,
        y: family === 'drift' ? 0 : 7,
        x: family === 'drift' ? direction * 10 : 0,
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: 0.15,
        ease: 'power2.out',
      }, contentStart + 0.015)
    }

    flowLines.forEach((line, index) => {
      const lineBeat = Number.parseInt(line.dataset.flowBeat ?? '1', 10)
      const lineStart = contentStart + Math.max(0, lineBeat - 1) * 0.035 + index * 0.008

      if (typeof line.getTotalLength === 'function') {
        timeline.to(line, {
          strokeDashoffset: 0,
          duration: 0.2,
          ease: 'power2.inOut',
        }, lineStart)
        return
      }

      timeline.to(line, {
        autoAlpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 0.18,
        ease: 'power2.inOut',
      }, lineStart)
    })

    const controlledTargets = [...new Set([
      ...glitchTargets,
      ...(family === 'glitch' ? titleWords : []),
    ])]
    if (controlledTargets.length) {
      addControlledGlitch(timeline, deck, controlledTargets, contentStart + 0.09)
    }

    activeTimelineRef.current = timeline
    timeline.play(0)

    return () => {
      if (activeTimelineRef.current !== timeline || timeline.progress() >= 1) return
      activeTimelineRef.current = null
      timeline.eventCallback('onComplete', null)
      timeline.eventCallback('onInterrupt', null)
      timeline.kill()
      settleTransition()
    }
  }, [
    currentIndex,
    currentSlide,
    reducedMotion,
    replayToken,
    settleTransition,
    transitionFamily,
  ])

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
    }

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'

    return () => {
      html.style.overflow = previous.htmlOverflow
      body.style.overflow = previous.bodyOverflow
      body.style.overscrollBehavior = previous.bodyOverscroll
    }
  }, [])

  useEffect(() => {
    document.title = `${currentSlide.title} — Proceso fundamental del testing`
  }, [currentSlide.title])

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target
      const isTextEditing = target instanceof Element
        && Boolean(target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]'))
      const isButtonLike = target instanceof Element
        && Boolean(target.closest('button, a, [role="button"]'))

      if (isTextEditing || event.repeat) return

      switch (event.key) {
        case 'ArrowRight':
        case 'PageDown':
          event.preventDefault()
          goRelative(1)
          break
        case ' ':
          if (isButtonLike) return
          event.preventDefault()
          goRelative(1)
          break
        case 'ArrowLeft':
        case 'PageUp':
          event.preventDefault()
          goRelative(-1)
          break
        case 'Home':
          event.preventDefault()
          goTo(0)
          break
        case 'End':
          event.preventDefault()
          goTo(slides.length - 1)
          break
        case 'r':
        case 'R':
          event.preventDefault()
          replayEntrance()
          break
        case 'f':
        case 'F':
          event.preventDefault()
          toggleFullscreen()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goRelative, goTo, replayEntrance, toggleFullscreen])

  useEffect(() => () => {
    if (queuedFrameRef.current !== null) {
      window.cancelAnimationFrame(queuedFrameRef.current)
      queuedFrameRef.current = null
    }
    queuedTargetRef.current = null

    const timeline = activeTimelineRef.current
    activeTimelineRef.current = null
    if (timeline) {
      timeline.eventCallback('onComplete', null)
      timeline.eventCallback('onInterrupt', null)
      timeline.kill()
    }
    settleTransition()
  }, [settleTransition])

  const handlePointerDown = (event) => {
    if (event.button !== 0) return
    if (event.target instanceof Element && event.target.closest('button, a')) return

    pointerRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerUp = (event) => {
    const start = pointerRef.current
    pointerRef.current = null
    if (!start || start.id !== event.pointerId) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const elapsed = performance.now() - start.time
    const threshold = Math.min(110, Math.max(52, window.innerWidth * 0.055))

    if (
      Math.abs(deltaX) >= threshold
      && Math.abs(deltaX) > Math.abs(deltaY) * 1.25
      && elapsed < 900
    ) {
      goRelative(deltaX < 0 ? 1 : -1)
    }
  }

  const handlePointerCancel = () => {
    pointerRef.current = null
  }

  return (
    <main
      ref={deckRef}
      className={`deck-shell ${isMinimalScene ? 'deck-shell--minimal' : ''} deck-transition--${transitionFamily}`}
      style={deckStyle}
      data-layout={layout}
      data-intensity={intensity}
      data-accent={visualAccent}
      data-slide-id={currentSlide.id}
      data-slide-kind={currentSlide.kind}
      data-speaker={currentSlide.speaker.toLowerCase()}
      data-transition={transitionPreset}
      data-transition-family={transitionFamily}
      data-atmosphere={atmosphere.id}
      aria-label="Presentación: Proceso fundamental del testing"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <Background />
      <div className="deck-ambient" aria-hidden="true">
        <span className="deck-ambient__beam deck-ambient__beam--one" />
        <span className="deck-ambient__beam deck-ambient__beam--two" />
        <span className="deck-ambient__noise" />
      </div>

      {!isMinimalScene && currentSlide.speaker !== 'Equipo' && (
        <header className="deck-rail" aria-label="Contexto de la slide">
          <span className="deck-rail__block">{displayBlock}</span>
          <span className="deck-rail__signal" aria-hidden="true" />
          <span className="deck-rail__speaker">{currentSlide.speaker}</span>
        </header>
      )}

      <section
        className={`scene-frame scene-frame--${currentSlide.kind} scene-transition--${transitionFamily}`}
        data-layout={layout}
        data-intensity={intensity}
        data-accent={visualAccent}
        data-slide-id={currentSlide.id}
        data-transition-family={transitionFamily}
        aria-labelledby={`deck-title-${currentSlide.id}`}
        aria-roledescription="slide"
        aria-setsize={slides.length}
        aria-posinset={slideNumber}
      >
        <GlobalAtmosphereCanvas
          atmosphere={atmosphere}
          intensity={intensity}
          reducedMotion={reducedMotion}
          slide={currentSlide}
          replayToken={replayToken}
        />
        <h1 id={`deck-title-${currentSlide.id}`} className="deck-visually-hidden">
          {currentSlide.title}
        </h1>
        <div ref={sceneContentRef} className="scene-content">
          <div className={`scene-heading ${isMinimalScene ? 'scene-heading--hero' : ''}`}>
            {!isMinimalScene && currentSlide.eyebrow && (
              <span className="scene-heading__eyebrow" data-reveal="eyebrow">
                {currentSlide.eyebrow}
              </span>
            )}
            <KineticTitle title={currentSlide.title} />
            {!isMinimalScene && currentSlide.subtitle && (
              <p data-reveal="subtitle">{currentSlide.subtitle}</p>
            )}
          </div>
          <div
            key={`visual-${currentSlide.id}`}
            className="scene-visual-reveal"
            data-reveal="visual"
            style={{ minWidth: 0, minHeight: 0, width: '100%', height: '100%' }}
          >
            <CyberVisual slide={currentSlide} />
          </div>
        </div>
      </section>

      <div
        ref={curtainRef}
        className={`transition-curtain transition-curtain--${transitionFamily}`}
        style={CURTAIN_STYLE}
        aria-hidden="true"
      >
        <span className="transition-curtain__depth" />
        {CURTAIN_SLICES.map((clipPath, index) => (
          <span
            className={`transition-curtain__slice transition-curtain__slice--${index + 1}`}
            key={clipPath}
            style={{
              '--slice-index': index,
              position: 'absolute',
              zIndex: 1,
              inset: '-2px -8vw',
              clipPath,
              background: index % 2
                ? 'linear-gradient(105deg, #02050a 0%, #07131e 47%, rgba(var(--accent-rgb), .24) 50%, #02050a 53%, #02050a 100%)'
                : 'linear-gradient(75deg, #02050a 0%, #06121c 45%, rgba(var(--accent-rgb), .18) 51%, #02050a 56%, #02050a 100%)',
              willChange: 'transform',
            }}
          />
        ))}
        <span className="transition-curtain__scan" />
        <span className="transition-curtain__glitch" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <i className="transition-curtain__glitch-band" key={index} style={{ '--glitch-index': index }} />
          ))}
        </span>
        <span className="transition-curtain__edge" style={CURTAIN_EDGE_STYLE} />
        <span className="transition-curtain__signal" style={CURTAIN_SIGNAL_STYLE}>
          SIGNAL // {String(slideNumber).padStart(2, '0')}
        </span>
      </div>

      <div
        ref={blockTransitionRef}
        className="block-transition"
        style={{ opacity: 0, visibility: 'hidden' }}
        aria-hidden="true"
      >
        <div className="block-transition__grid" />
        <div className="block-transition__outgoing">
          <span data-block-outgoing>BLOQUE 01 // DAVID</span>
          <strong className="block-transition__status">SYSTEM COMPLETE</strong>
          <small>HANDOFF PROTOCOL</small>
        </div>
        <div className="block-transition__incoming">
          <span data-block-incoming>BLOQUE 02</span>
          <strong data-block-speaker>LUIS</strong>
          <small data-block-focus>ANÁLISIS Y DISEÑO</small>
        </div>
        <span className="block-transition__scan" />
      </div>

      <p className="deck-visually-hidden" aria-live="polite" aria-atomic="true">
        Slide {slideNumber} de {slides.length}: {currentSlide.title}. {displayBlock}, {currentSlide.speaker}.
      </p>
    </main>
  )
}

export default App
