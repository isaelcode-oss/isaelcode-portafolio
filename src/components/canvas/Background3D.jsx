import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COUNT = 110
const MAX_DIST   = 4.2
const FIELD_SIZE = 26

// ── Single pulsing node ──────────────────────────────────────────────────────
function NeuralNode({ position, color, size }) {
  const mesh   = useRef()
  const speed  = useMemo(() => 0.25 + Math.random() * 0.35, [])
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    mesh.current.position.x = position[0] + Math.sin(t * speed + offset) * 0.18
    mesh.current.position.y = position[1] + Math.cos(t * speed * 0.7 + offset) * 0.18
    mesh.current.position.z = position[2]
    const pulse = 1 + Math.sin(t * 1.8 + offset) * 0.28
    mesh.current.scale.setScalar(pulse)
  })

  return (
    <mesh position={position} ref={mesh}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        toneMapped={false}
      />
    </mesh>
  )
}

// ── Static connection lines (cheap, no per-frame update) ─────────────────────
function NeuralConnections({ nodes }) {
  const positions = useMemo(() => {
    const pts = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0]
        const dy = nodes[i][1] - nodes[j][1]
        const dz = nodes[i][2] - nodes[j][2]
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < MAX_DIST) {
          pts.push(...nodes[i], ...nodes[j])
        }
      }
    }
    return new Float32Array(pts)
  }, [nodes])

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#00E5FF" transparent opacity={0.13} />
    </lineSegments>
  )
}

// ── Data pulse travelling between two nodes ───────────────────────────────────
function DataPulse({ from, to, colorIdx }) {
  const mesh  = useRef()
  const speed = useMemo(() => 0.35 + Math.random() * 0.55, [])
  const delay = useMemo(() => Math.random(), [])
  const vA    = useMemo(() => new THREE.Vector3(...from), [from])
  const vB    = useMemo(() => new THREE.Vector3(...to),   [to])
  const colors = ['#00FF85', '#00E5FF', '#9D00FF']
  const emissive = colors[colorIdx % 3]

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = ((clock.elapsedTime * speed) + delay) % 1
    mesh.current.position.lerpVectors(vA, vB, t)
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive={emissive}
        emissiveIntensity={4}
        toneMapped={false}
      />
    </mesh>
  )
}

// ── The whole scene — reacts to mouse ────────────────────────────────────────
function NeuralScene() {
  const group    = useRef()
  const targetRY = useRef(0)
  const targetRX = useRef(0)
  const { mouse } = useThree()

  const nodes = useMemo(() =>
    Array.from({ length: NODE_COUNT }, () => [
      (Math.random() - 0.5) * FIELD_SIZE,
      (Math.random() - 0.5) * FIELD_SIZE * 0.62,
      (Math.random() - 0.5) * 10 - 5,
    ]), [])

  const pulses = useMemo(() => {
    const pairs = []
    for (let i = 0; i < nodes.length && pairs.length < 24; i++)
      for (let j = i + 1; j < nodes.length && pairs.length < 24; j++) {
        const dx = nodes[i][0] - nodes[j][0]
        const dy = nodes[i][1] - nodes[j][1]
        const dz = nodes[i][2] - nodes[j][2]
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < MAX_DIST)
          pairs.push([i, j])
      }
    return pairs
  }, [nodes])

  const colors = useMemo(() => nodes.map((_, i) =>
    i % 3 === 0 ? '#9D00FF' : i % 5 === 0 ? '#00FF85' : '#00E5FF'
  ), [nodes])

  const sizes = useMemo(() =>
    nodes.map(() => 0.045 + Math.random() * 0.09), [nodes])

  useFrame(({ clock }) => {
    if (!group.current) return

    // Mouse-driven target rotation (smooth lerp)
    targetRY.current = mouse.x * 0.55
    targetRX.current = -mouse.y * 0.32

    // Slow auto-drift layered on top
    const drift = clock.elapsedTime * 0.012

    group.current.rotation.y += (targetRY.current + drift - group.current.rotation.y) * 0.04
    group.current.rotation.x += (targetRX.current - group.current.rotation.x) * 0.04
  })

  return (
    <group ref={group}>
      <NeuralConnections nodes={nodes} />
      {nodes.map((pos, i) => (
        <NeuralNode key={i} position={pos} color={colors[i]} size={sizes[i]} />
      ))}
      {pulses.map(([a, b], i) => (
        <DataPulse key={i} from={nodes[a]} to={nodes[b]} colorIdx={i} />
      ))}
    </group>
  )
}

// ── Canvas wrapper ────────────────────────────────────────────────────────────
export default function Background3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 68 }}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.04} />
      <pointLight position={[-10,  5, 3]} color="#00E5FF" intensity={2} />
      <pointLight position={[ 10, -5, 3]} color="#9D00FF" intensity={2} />
      <pointLight position={[  0,  8,-5]} color="#00FF85" intensity={1} />
      <NeuralScene />
    </Canvas>
  )
}
