import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { hasSpecialScene3D, SpecialScene3D } from './SpecialScenes3D.jsx'

const MAX_FAR_PARTICLES = 92
const MAX_NEAR_PARTICLES = 38
const MAX_DATA_LINES = 7
const FRAME_INTERVAL = 1 / 30
const AMBIENT_FRAME_INTERVAL = 1000 / 30
const PALE = new THREE.Color('#dffbff')

const randomBetween = (min, max) => min + Math.random() * (max - min)

function createParticleLayer(maxParticles, materialOptions) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxParticles * 3), 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(maxParticles * 3), 3))
  geometry.setDrawRange(0, 0)

  const material = new THREE.PointsMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    vertexColors: true,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    ...materialOptions,
  })

  return {
    geometry,
    material,
    points: new THREE.Points(geometry, material),
    states: Array.from({ length: maxParticles }, () => ({})),
  }
}

function seedParticleLayer(layer, count, palette, near = false) {
  const position = layer.geometry.getAttribute('position')
  const color = layer.geometry.getAttribute('color')

  for (let index = 0; index < count; index += 1) {
    const particle = layer.states[index]
    const tone = palette[Math.floor(Math.random() * palette.length)] ?? PALE
    const colorBias = 0.72 + Math.random() * 0.28

    particle.x = randomBetween(-6.4, 6.4)
    particle.y = randomBetween(-3.8, 3.8)
    particle.z = near ? randomBetween(0.35, 1.55) : randomBetween(-3.5, -0.45)
    particle.vx = randomBetween(-0.022, 0.022) * (near ? 1.8 : 1)
    particle.vy = randomBetween(0.012, 0.045) * (near ? 0.82 : 0.55)
    particle.phase = Math.random() * Math.PI * 2
    particle.drift = randomBetween(0.24, 0.8)

    position.setXYZ(index, particle.x, particle.y, particle.z)
    color.setXYZ(index, tone.r * colorBias, tone.g * colorBias, tone.b * colorBias)
  }

  layer.geometry.setDrawRange(0, count)
  position.needsUpdate = true
  color.needsUpdate = true
}

function updateParticleLayer(layer, count, delta, elapsed) {
  const position = layer.geometry.getAttribute('position')

  for (let index = 0; index < count; index += 1) {
    const particle = layer.states[index]
    particle.x += particle.vx * delta * 60
    particle.y += (particle.vy + Math.sin(elapsed * particle.drift + particle.phase) * 0.0016) * delta * 60

    if (particle.y > 4.25) {
      particle.y = -4.25
      particle.x = randomBetween(-6.8, 6.8)
    }
    if (particle.x > 6.8) particle.x = -6.8
    if (particle.x < -6.8) particle.x = 6.8

    position.setXYZ(index, particle.x, particle.y, particle.z)
  }

  position.needsUpdate = true
}

function createDataLines() {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX_DATA_LINES * 6), 3))
  geometry.setDrawRange(0, 0)

  const material = new THREE.LineBasicMaterial({
    color: '#dffbff',
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  return {
    geometry,
    material,
    lines: new THREE.LineSegments(geometry, material),
    states: Array.from({ length: MAX_DATA_LINES }, () => ({})),
  }
}

function seedDataLines(layer, count, color) {
  const position = layer.geometry.getAttribute('position')

  for (let index = 0; index < count; index += 1) {
    const line = layer.states[index]
    line.x = randomBetween(-6.6, 5.1)
    line.y = randomBetween(-3.2, 3.25)
    line.z = randomBetween(-0.5, 0.8)
    line.length = randomBetween(0.28, 1.05)
    line.speed = randomBetween(0.012, 0.035)
    line.phase = Math.random() * Math.PI * 2

    position.setXYZ(index * 2, line.x, line.y, line.z)
    position.setXYZ(index * 2 + 1, line.x + line.length, line.y, line.z)
  }

  layer.geometry.setDrawRange(0, count * 2)
  layer.material.color.copy(color)
  position.needsUpdate = true
}

function updateDataLines(layer, count, delta, elapsed) {
  const position = layer.geometry.getAttribute('position')

  for (let index = 0; index < count; index += 1) {
    const line = layer.states[index]
    line.x += line.speed * delta * 60
    if (line.x > 6.8) {
      line.x = -6.8
      line.y = randomBetween(-3.2, 3.25)
    }

    const pulse = Math.sin(elapsed * 0.7 + line.phase) * 0.055
    position.setXYZ(index * 2, line.x, line.y + pulse, line.z)
    position.setXYZ(index * 2 + 1, line.x + line.length, line.y + pulse, line.z)
  }

  position.needsUpdate = true
}

function ParticleField({ atmosphere, intensity, reducedMotion, throttleUpdates }) {
  const farLayer = useMemo(() => createParticleLayer(MAX_FAR_PARTICLES, { size: 0.048, opacity: 0.4 }), [])
  const nearLayer = useMemo(() => createParticleLayer(MAX_NEAR_PARTICLES, { size: 0.092, opacity: 0.54 }), [])
  const dataLines = useMemo(createDataLines, [])
  const profileRef = useRef(null)
  const elapsedRef = useRef(0)
  const accumulatorRef = useRef(0)

  useEffect(() => {
    const compactViewport = window.innerWidth < 820
    const impactMultiplier = intensity === 'impact' || intensity === 'hero' ? 1 : 0.8
    const palette = atmosphere.palette.map((tone) => new THREE.Color(tone))
    const farCount = Math.round((compactViewport ? 46 : 70) * impactMultiplier)
    const nearCount = Math.round((compactViewport ? 14 : 24) * impactMultiplier)
    const lineCount = intensity === 'impact' || intensity === 'hero'
      ? compactViewport ? 3 : 6
      : compactViewport ? 1 : 3

    profileRef.current = {
      farCount,
      nearCount,
      lineCount,
    }

    seedParticleLayer(farLayer, farCount, palette)
    seedParticleLayer(nearLayer, nearCount, [...palette, PALE], true)
    seedDataLines(dataLines, lineCount, palette[0] ?? PALE)

    farLayer.material.opacity = reducedMotion ? 0.28 : intensity === 'calm' ? 0.32 : 0.42
    nearLayer.material.opacity = reducedMotion ? 0.22 : intensity === 'calm' ? 0.35 : 0.52
    dataLines.material.opacity = reducedMotion ? 0.04 : intensity === 'calm' ? 0.08 : 0.16
  }, [atmosphere, dataLines, farLayer, intensity, nearLayer, reducedMotion])

  useEffect(() => () => {
    farLayer.geometry.dispose()
    farLayer.material.dispose()
    nearLayer.geometry.dispose()
    nearLayer.material.dispose()
    dataLines.geometry.dispose()
    dataLines.material.dispose()
  }, [dataLines, farLayer, nearLayer])

  useEffect(() => {
    accumulatorRef.current = 0
  }, [throttleUpdates])

  useFrame((_, delta) => {
    const profile = profileRef.current
    if (!profile || reducedMotion || document.hidden) return

    accumulatorRef.current += delta
    if (throttleUpdates && accumulatorRef.current < FRAME_INTERVAL) return

    const frameDelta = Math.min(accumulatorRef.current, 0.06)
    accumulatorRef.current = 0
    elapsedRef.current += frameDelta

    updateParticleLayer(farLayer, profile.farCount, frameDelta, elapsedRef.current)
    updateParticleLayer(nearLayer, profile.nearCount, frameDelta, elapsedRef.current)
    updateDataLines(dataLines, profile.lineCount, frameDelta, elapsedRef.current)
  })

  return (
    <>
      <primitive object={farLayer.points} />
      <primitive object={nearLayer.points} />
      <primitive object={dataLines.lines} />
    </>
  )
}

function usePageVisibility() {
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden)

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  return pageVisible
}

function VisibilityFrameloop({ pageVisible, reducedMotion, specialSceneActive }) {
  const { invalidate } = useThree()

  useEffect(() => {
    let frameId = null
    let previousFrameTime = 0

    const cancelAmbientFrame = () => {
      if (frameId === null) return
      window.cancelAnimationFrame(frameId)
      frameId = null
    }

    const renderAmbientFrame = (time) => {
      frameId = null
      if (reducedMotion || !pageVisible || specialSceneActive) return

      if (previousFrameTime === 0 || time - previousFrameTime >= AMBIENT_FRAME_INTERVAL) {
        previousFrameTime = time
        invalidate()
      }
      frameId = window.requestAnimationFrame(renderAmbientFrame)
    }

    invalidate()
    if (pageVisible && !reducedMotion && !specialSceneActive) {
      frameId = window.requestAnimationFrame(renderAmbientFrame)
    }

    return () => {
      cancelAmbientFrame()
    }
  }, [invalidate, pageVisible, reducedMotion, specialSceneActive])

  return null
}

export default function GlobalAtmosphereCanvas({ atmosphere, intensity, reducedMotion, slide, replayToken }) {
  const specialSceneActive = hasSpecialScene3D(slide?.id)
  const pageVisible = usePageVisibility()
  const continuousFrameloop = pageVisible && !reducedMotion && specialSceneActive

  return (
    <Canvas
      className="global-atmosphere-canvas"
      aria-hidden="true"
      dpr={reducedMotion ? 1 : [1, 1.35]}
      frameloop={continuousFrameloop ? 'always' : 'demand'}
      camera={{ fov: 52, near: 0.1, far: 20, position: [0, 0, 4] }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor('#020306', 0)}
      fallback={<div className="global-atmosphere-fallback" />}
    >
      <VisibilityFrameloop
        pageVisible={pageVisible}
        reducedMotion={reducedMotion}
        specialSceneActive={specialSceneActive}
      />
      <ParticleField
        atmosphere={atmosphere}
        intensity={intensity}
        reducedMotion={reducedMotion}
        throttleUpdates={continuousFrameloop}
      />
      <SpecialScene3D slide={slide} reducedMotion={reducedMotion} replayToken={replayToken} />
    </Canvas>
  )
}
