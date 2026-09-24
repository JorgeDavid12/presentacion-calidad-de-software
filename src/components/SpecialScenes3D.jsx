import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'

const CYAN = '#20ddd8'
const MAGENTA = '#ff326d'
const YELLOW = '#ffad32'
const GREEN = '#52f5ac'
const PALE = '#dffbff'

const SPECIAL_SCENE_IDS = new Set([
  'cover',
  'l03-conditions',
  'f03-environment',
  'f07-confirm-regression',
  'closing',
])

export const hasSpecialScene3D = (sceneId) => SPECIAL_SCENE_IDS.has(sceneId)

const clamp01 = (value) => THREE.MathUtils.clamp(value, 0, 1)

function useActivation({ duration = 1.6, reducedMotion, replayToken = 0, delay = 0.08 }) {
  const activation = useRef({ value: reducedMotion ? 1 : 0 })

  useLayoutEffect(() => {
    activation.current.value = reducedMotion ? 1 : 0
    if (reducedMotion) return undefined

    const tween = gsap.to(activation.current, {
      value: 1,
      delay,
      duration,
      ease: 'power3.out',
      overwrite: true,
    })

    return () => tween.kill()
  }, [delay, duration, reducedMotion, replayToken])

  return activation
}

function InteractiveRig({ children, reducedMotion, strength = 0.06 }) {
  const groupRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (reducedMotion) return undefined

    const onPointerMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointerRef.current.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [reducedMotion])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const damping = 1 - Math.exp(-delta * 3.2)
    const targetX = reducedMotion ? 0 : pointerRef.current.y * strength * -0.55
    const targetY = reducedMotion ? 0 : pointerRef.current.x * strength

    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, damping)
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, damping)
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetY * 0.16, damping)
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetX * 0.12, damping)
  })

  return <group ref={groupRef}>{children}</group>
}

function HoloPanels({ positions, colors, activation, size = [0.78, 0.34, 0.08], delaySpread = 0.62 }) {
  const meshRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const palette = useMemo(() => colors.map((color) => new THREE.Color(color)), [colors])
  const frameSegments = useMemo(() => positions.flatMap((position) => {
    const halfWidth = size[0] / 2
    const halfHeight = size[1] / 2
    const z = position[2] + size[2] / 2 + 0.004
    const corners = [
      [position[0] - halfWidth, position[1] - halfHeight, z],
      [position[0] + halfWidth, position[1] - halfHeight, z],
      [position[0] + halfWidth, position[1] + halfHeight, z],
      [position[0] - halfWidth, position[1] + halfHeight, z],
    ]
    return [
      [corners[0], corners[1]],
      [corners[1], corners[2]],
      [corners[2], corners[3]],
      [corners[3], corners[0]],
    ]
  }), [positions, size])

  useLayoutEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    palette.forEach((color, index) => mesh.setColorAt(index, color))
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [palette])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return

    const total = Math.max(positions.length - 1, 1)
    positions.forEach((position, index) => {
      const threshold = (index / total) * delaySpread
      const localProgress = clamp01((activation.current.value - threshold) / (1 - delaySpread + 0.001))
      const eased = 1 - (1 - localProgress) ** 3
      const float = Math.sin(state.clock.elapsedTime * 0.68 + index * 0.9) * 0.025

      dummy.position.set(position[0], position[1] + float, position[2])
      dummy.rotation.set(-0.06 + position[2] * 0.07, position[2] * -0.12, (index % 2 ? -1 : 1) * 0.018)
      dummy.scale.set(Math.max(0.001, eased), Math.max(0.001, eased), Math.max(0.001, eased))
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })

    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]} frustumCulled={false}>
        <boxGeometry args={size} />
        <meshBasicMaterial
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </instancedMesh>
      <ConnectionSet
        segments={frameSegments}
        activation={activation}
        color={PALE}
        lineWidth={0.65}
        opacity={0.2}
      />
    </group>
  )
}

function ConnectionSet({ segments, activation, color = CYAN, lineWidth = 1.2, opacity = 0.5 }) {
  const lineRef = useRef(null)
  const points = useMemo(() => segments.flatMap(([start, end]) => [start, end]), [segments])

  useFrame(() => {
    if (!lineRef.current?.material) return
    lineRef.current.material.opacity = opacity * activation.current.value
  })

  return (
    <Line
      ref={lineRef}
      points={points}
      segments
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={0}
      depthWrite={false}
      toneMapped={false}
    />
  )
}

function ChainPulse({ points, activation, reducedMotion, color = CYAN, speed = 0.11, radius = 0.055 }) {
  const pulseRef = useRef(null)
  const vectorPoints = useMemo(() => points.map((point) => new THREE.Vector3(...point)), [points])

  useFrame((state) => {
    const pulse = pulseRef.current
    if (!pulse || vectorPoints.length < 2) return

    const active = activation.current.value
    const travel = reducedMotion ? 0.72 : (state.clock.elapsedTime * speed) % 1
    const scaled = travel * (vectorPoints.length - 1)
    const index = Math.min(Math.floor(scaled), vectorPoints.length - 2)
    const local = scaled - index
    pulse.position.lerpVectors(vectorPoints[index], vectorPoints[index + 1], local)
    pulse.scale.setScalar(Math.max(0.001, active * (0.88 + Math.sin(state.clock.elapsedTime * 4) * 0.12)))
  })

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[radius, 10, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function CoreParticles({ mode, energy, reducedMotion }) {
  const pointsRef = useRef(null)
  const materialRef = useRef(null)
  const positions = useMemo(() => {
    const data = new Float32Array(66 * 3)
    for (let index = 0; index < 66; index += 1) {
      const radius = 0.35 + ((index * 37) % 100) / 100 * 1.08
      const angle = index * 2.399963
      data[index * 3] = Math.cos(angle) * radius
      data[index * 3 + 1] = Math.sin(angle) * radius * 0.76
      data[index * 3 + 2] = ((index * 29) % 100) / 100 * 0.9 - 0.45
    }
    return data
  }, [])

  useFrame((state, delta) => {
    const points = pointsRef.current
    if (!points) return

    const energyValue = energy.current.value
    if (!reducedMotion) points.rotation.z += delta * (mode === 'shutdown' ? 0.025 : 0.09)
    const dispersion = mode === 'shutdown'
      ? 1.04 + (1 - energyValue) * 0.72
      : 0.86 + energyValue * 0.14
    points.scale.setScalar(dispersion)

    if (materialRef.current) {
      materialRef.current.opacity = (mode === 'shutdown' ? 0.32 : 0.62) * energyValue
      materialRef.current.size = 0.035 + Math.sin(state.clock.elapsedTime * 1.2) * 0.003
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={PALE}
        size={0.038}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  )
}

function CyberCore({ mode = 'opening', reducedMotion, replayToken }) {
  const groupRef = useRef(null)
  const coreRef = useRef(null)
  const ringRefs = useRef([])
  const materialRefs = useRef([])
  const activation = useActivation({ duration: 2.1, reducedMotion, replayToken, delay: 0.06 })
  const energy = useRef({ value: mode === 'shutdown' ? 1 : reducedMotion ? 0.86 : 0.16 })

  useLayoutEffect(() => {
    energy.current.value = mode === 'shutdown' ? 1 : reducedMotion ? 0.86 : 0.16
    if (reducedMotion) return undefined

    const tween = gsap.to(energy.current, {
      value: mode === 'shutdown' ? 0.42 : 1,
      duration: mode === 'shutdown' ? 4.6 : 2.5,
      delay: mode === 'shutdown' ? 0.35 : 0.08,
      ease: mode === 'shutdown' ? 'power2.out' : 'power3.out',
      overwrite: true,
    })

    return () => tween.kill()
  }, [mode, reducedMotion, replayToken])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return

    const active = activation.current.value
    const energyValue = energy.current.value
    const baseScale = 0.72 + active * 0.28
    group.scale.setScalar(baseScale)
    group.position.z = -0.18 + active * 0.18

    if (!reducedMotion) {
      group.rotation.y += delta * (mode === 'shutdown' ? 0.025 : 0.08) * energyValue
      group.rotation.z += delta * (mode === 'shutdown' ? 0.012 : 0.035) * energyValue
      ringRefs.current.forEach((ring, index) => {
        if (!ring) return
        ring.rotation.z += delta * (0.035 + index * 0.018) * (index % 2 ? -1 : 1) * energyValue
        ring.rotation.y += delta * 0.018 * (index + 1) * energyValue
      })
    }

    if (coreRef.current) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.08 * energyValue
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.11 * energyValue
    }

    materialRefs.current.forEach((material, index) => {
      if (!material) return
      material.opacity = (index === 0 ? 0.56 : 0.38) * energyValue * active
    })
  })

  const dataLines = useMemo(() => [
    [[-1.75, 0.12, -0.32], [-0.72, 0.12, -0.04]],
    [[0.82, 0.42, -0.16], [1.92, 0.82, -0.42]],
    [[0.68, -0.55, 0.12], [1.85, -0.96, -0.35]],
    [[-1.72, -0.82, -0.45], [-0.65, -0.42, 0.06]],
  ], [])

  return (
    <group ref={groupRef} position={[0.28, -0.08, 0]} rotation={[0.08, -0.18, -0.08]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.58, 3]} />
        <meshBasicMaterial
          ref={(material) => { materialRefs.current[0] = material }}
          color={CYAN}
          transparent
          opacity={0}
          wireframe
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={0.78}>
        <sphereGeometry args={[0.56, 24, 24]} />
        <meshStandardMaterial
          ref={(material) => { materialRefs.current[1] = material }}
          color="#07171d"
          emissive={CYAN}
          emissiveIntensity={1.35}
          transparent
          opacity={0}
          roughness={0.34}
          metalness={0.55}
        />
      </mesh>
      {[
        { radius: 0.92, tube: 0.018, color: CYAN, rotation: [1.18, 0.08, 0.18] },
        { radius: 1.17, tube: 0.013, color: MAGENTA, rotation: [0.42, 0.75, -0.34] },
        { radius: 1.43, tube: 0.01, color: YELLOW, rotation: [1.42, -0.35, 0.72] },
      ].map((ring, index) => (
        <mesh
          key={ring.color}
          ref={(mesh) => { ringRefs.current[index] = mesh }}
          rotation={ring.rotation}
        >
          <torusGeometry args={[ring.radius, ring.tube, 6, 112]} />
          <meshBasicMaterial
            ref={(material) => { materialRefs.current[index + 2] = material }}
            color={ring.color}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
      <ConnectionSet segments={dataLines} activation={activation} color={CYAN} lineWidth={1} opacity={0.4} />
      <CoreParticles mode={mode} energy={energy} reducedMotion={reducedMotion} />
    </group>
  )
}

function ConditionsScene({ reducedMotion, replayToken }) {
  const activation = useActivation({ duration: 1.85, reducedMotion, replayToken })
  const root = [0, 0.78, 0.18]
  const positions = useMemo(() => [
    root,
    [-2.78, -0.82, -0.32],
    [-1.68, -0.92, 0.16],
    [-0.56, -0.76, -0.12],
    [0.56, -0.92, 0.24],
    [1.68, -0.76, -0.2],
    [2.78, -0.9, 0.12],
  ], [])
  const segments = useMemo(() => positions.slice(1).map((position) => [root, position]), [positions])

  return (
    <group>
      <ConnectionSet segments={segments} activation={activation} color={CYAN} lineWidth={1.15} opacity={0.55} />
      <HoloPanels
        positions={positions}
        colors={[YELLOW, CYAN, MAGENTA, CYAN, MAGENTA, CYAN, YELLOW]}
        activation={activation}
        size={[0.78, 0.34, 0.075]}
      />
      <ChainPulse points={[root, positions[4]]} activation={activation} reducedMotion={reducedMotion} color={YELLOW} speed={0.16} />
    </group>
  )
}

function ExecutionFingerprintScene({ reducedMotion, replayToken }) {
  const activation = useActivation({ duration: 1.55, reducedMotion, replayToken, delay: 0.12 })
  const positions = useMemo(() => [
    [-2.38, -0.18, -0.34],
    [-1.22, -0.12, 0.2],
    [-0.06, -0.2, -0.12],
    [-2.38, -1.12, 0.12],
    [-1.22, -1.06, -0.24],
    [-0.06, -1.14, 0.28],
  ], [])
  const hub = [-1.22, -0.66, -0.5]
  const segments = useMemo(() => positions.map((position) => [position, hub]), [positions])

  return (
    <group rotation={[0.035, -0.055, 0]}>
      <ConnectionSet segments={segments} activation={activation} color={MAGENTA} lineWidth={0.85} opacity={0.34} />
      <HoloPanels
        positions={positions}
        colors={[MAGENTA, YELLOW, MAGENTA, CYAN, MAGENTA, CYAN]}
        activation={activation}
        size={[0.92, 0.44, 0.1]}
        delaySpread={0.42}
      />
      <mesh position={hub}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshBasicMaterial color={PALE} transparent opacity={0.75} toneMapped={false} />
      </mesh>
    </group>
  )
}

function RetestOrbitScene({ reducedMotion, replayToken }) {
  const activation = useActivation({ duration: 2.1, reducedMotion, replayToken })
  const orbitRef = useRef(null)
  const pulseRef = useRef(null)
  const center = useMemo(() => new THREE.Vector3(-0.55, -0.4, 0), [])
  const radius = 1.2
  const positions = useMemo(() => Array.from({ length: 6 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / 6
    return [
      center.x + Math.cos(angle) * radius,
      center.y + Math.sin(angle) * radius * 0.82,
      Math.sin(angle * 2) * 0.24,
    ]
  }), [center])

  useFrame((state, delta) => {
    const active = activation.current.value
    if (orbitRef.current && !reducedMotion) {
      orbitRef.current.rotation.x += delta * 0.028
      orbitRef.current.rotation.y += delta * 0.045
    }

    if (pulseRef.current) {
      const angle = reducedMotion ? Math.PI * 0.68 : -Math.PI / 2 + state.clock.elapsedTime * 0.42
      pulseRef.current.position.set(
        center.x + Math.cos(angle) * radius,
        center.y + Math.sin(angle) * radius * 0.82,
        Math.sin(angle * 2) * 0.24,
      )
      pulseRef.current.scale.setScalar(Math.max(0.001, active))
    }
  })

  return (
    <group>
      <group ref={orbitRef} position={[center.x, center.y, -0.12]}>
        <mesh rotation={[1.54, 0.06, 0]}>
          <torusGeometry args={[radius, 0.022, 6, 128]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.48} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[1.34, 0.32, 0.16]} scale={[1, 0.82, 1]}>
          <torusGeometry args={[radius * 0.72, 0.01, 5, 96]} />
          <meshBasicMaterial color={MAGENTA} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      <HoloPanels
        positions={positions}
        colors={[MAGENTA, MAGENTA, YELLOW, CYAN, YELLOW, GREEN]}
        activation={activation}
        size={[0.64, 0.32, 0.09]}
        delaySpread={0.7}
      />
      <mesh position={[center.x, center.y, 0.08]}>
        <icosahedronGeometry args={[0.34, 2]} />
        <meshStandardMaterial color="#02090c" emissive={CYAN} emissiveIntensity={0.38} metalness={0.78} roughness={0.52} />
      </mesh>
      <mesh position={[center.x, center.y, 0.08]} scale={1.08}>
        <icosahedronGeometry args={[0.34, 1]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.44} wireframe toneMapped={false} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial color={PALE} toneMapped={false} />
      </mesh>
    </group>
  )
}

function JourneyScene({ reducedMotion, replayToken }) {
  const activation = useActivation({ duration: 2.3, reducedMotion, replayToken, delay: 0.05 })
  const travelerRef = useRef(null)
  const travelerRingRef = useRef(null)
  const travel = useRef({ value: reducedMotion ? 0.58 : 0 })
  const travelerPoint = useMemo(() => new THREE.Vector3(), [])
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.12, -0.38, -0.25),
    new THREE.Vector3(-2.34, 0.34, 0.2),
    new THREE.Vector3(-1.46, -0.42, -0.08),
    new THREE.Vector3(-0.54, 0.22, 0.28),
    new THREE.Vector3(0.36, -0.36, -0.2),
    new THREE.Vector3(1.22, 0.28, 0.24),
    new THREE.Vector3(2.08, -0.28, -0.12),
    new THREE.Vector3(3.1, 0.14, 0.18),
  ], false, 'catmullrom', 0.32), [])
  const stagePositions = useMemo(() => Array.from({ length: 8 }, (_, index) => {
    const point = curve.getPointAt(index / 7)
    return [point.x, point.y, point.z]
  }), [curve])
  const echoPoints = useMemo(() => curve.getPoints(80).map((point) => [point.x, point.y - 0.14, point.z - 0.18]), [curve])

  useLayoutEffect(() => {
    travel.current.value = reducedMotion ? 0.58 : 0
    if (reducedMotion) return undefined

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.9 })
      .to(travel.current, { value: 1, duration: 8.8, ease: 'none' })
      .set(travel.current, { value: 0 })

    return () => timeline.kill()
  }, [reducedMotion, replayToken])

  useFrame((state, delta) => {
    const traveler = travelerRef.current
    if (!traveler) return

    curve.getPointAt(clamp01(travel.current.value), travelerPoint)
    traveler.position.copy(travelerPoint)
    const active = activation.current.value
    traveler.scale.setScalar(Math.max(0.001, active * (0.92 + Math.sin(state.clock.elapsedTime * 3) * 0.08)))
    if (travelerRingRef.current && !reducedMotion) travelerRingRef.current.rotation.z += delta * 1.08
  })

  return (
    <group position={[0, -0.12, 0]}>
      <mesh>
        <tubeGeometry args={[curve, 112, 0.035, 7, false]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.58} depthWrite={false} toneMapped={false} />
      </mesh>
      <Line points={echoPoints} color={YELLOW} lineWidth={0.8} transparent opacity={0.3} dashed dashSize={0.08} gapSize={0.08} toneMapped={false} />
      <HoloPanels
        positions={stagePositions}
        colors={[CYAN, CYAN, CYAN, CYAN, MAGENTA, YELLOW, GREEN, GREEN]}
        activation={activation}
        size={[0.48, 0.24, 0.07]}
        delaySpread={0.72}
      />
      <group ref={travelerRef}>
        <mesh>
          <icosahedronGeometry args={[0.13, 1]} />
          <meshBasicMaterial color={PALE} toneMapped={false} />
        </mesh>
        <mesh ref={travelerRingRef} rotation={[1.2, 0.4, 0]}>
          <torusGeometry args={[0.22, 0.014, 5, 42]} />
          <meshBasicMaterial color={MAGENTA} transparent opacity={0.85} toneMapped={false} />
        </mesh>
        <pointLight color={CYAN} intensity={0.75} distance={1.2} />
      </group>
    </group>
  )
}

export function SpecialScene3D({ slide, reducedMotion, replayToken }) {
  const sceneId = slide?.id
  if (!hasSpecialScene3D(sceneId)) return null

  let scene = null
  switch (sceneId) {
    case 'cover':
      scene = <CyberCore mode="opening" reducedMotion={reducedMotion} replayToken={replayToken} />
      break
    case 'l03-conditions':
      scene = <ConditionsScene reducedMotion={reducedMotion} replayToken={replayToken} />
      break
    case 'f03-environment':
      scene = <ExecutionFingerprintScene reducedMotion={reducedMotion} replayToken={replayToken} />
      break
    case 'f07-confirm-regression':
      scene = <RetestOrbitScene reducedMotion={reducedMotion} replayToken={replayToken} />
      break
    case 'closing':
      scene = <CyberCore mode="shutdown" reducedMotion={reducedMotion} replayToken={replayToken} />
      break
    default:
      return null
  }

  return (
    <InteractiveRig
      key={`${sceneId}-${replayToken}`}
      reducedMotion={reducedMotion}
      strength={sceneId === 'cover' || sceneId === 'closing' ? 0.075 : 0.04}
    >
      <ambientLight intensity={0.28} color="#9edfff" />
      <pointLight position={[-2.8, 2.2, 2.4]} color={CYAN} intensity={0.72} distance={8} />
      <pointLight position={[2.8, -1.8, 2]} color={MAGENTA} intensity={0.58} distance={8} />
      {scene}
    </InteractiveRig>
  )
}
