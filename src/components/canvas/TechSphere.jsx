import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COLORS = [
  '#00F5FF', '#9D00FF', '#00F5FF', '#9D00FF',
  '#00F5FF', '#9D00FF', '#00F5FF', '#9D00FF',
  '#00F5FF', '#9D00FF', '#00F5FF', '#9D00FF',
]

// Individual orbiting node
function TechNode({ position, color, size }) {
  const mesh = useRef()
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        toneMapped={false}
      />
    </mesh>
  )
}

// Lines from center to each node
function ConnectionLines({ positions }) {
  const geometry = useMemo(() => {
    const pts = []
    positions.forEach((p) => {
      pts.push(new THREE.Vector3(0, 0, 0))
      pts.push(new THREE.Vector3(...p))
    })
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [positions])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#00F5FF" transparent opacity={0.12} />
    </lineSegments>
  )
}

// Equatorial ring
function Ring({ radius, color, opacity = 0.15 }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 80]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

function Sphere3D() {
  const group = useRef()

  // Distribute 12 nodes evenly over a sphere (Fibonacci lattice)
  const positions = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const phi   = Math.acos(-1 + (2 * i) / 12)
      const theta = Math.sqrt(12 * Math.PI) * phi
      return [
        2.6 * Math.cos(theta) * Math.sin(phi),
        2.6 * Math.sin(theta) * Math.sin(phi),
        2.6 * Math.cos(phi),
      ]
    }),
  [])

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.28
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.25
  })

  return (
    <group ref={group}>
      {/* Core sphere – filled */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color="#00F5FF"
          transparent opacity={0.08}
          emissive="#00F5FF" emissiveIntensity={0.4}
        />
      </mesh>
      {/* Core sphere – wireframe */}
      <mesh>
        <sphereGeometry args={[0.72, 16, 16]} />
        <meshStandardMaterial color="#00F5FF" transparent opacity={0.18} wireframe />
      </mesh>

      {/* Equatorial rings */}
      <Ring radius={2.6} color="#00F5FF" opacity={0.1} />
      <group rotation={[0, 0, Math.PI / 3]}>
        <Ring radius={2.6} color="#9D00FF" opacity={0.08} />
      </group>

      {/* Orbiting nodes */}
      {positions.map((pos, i) => (
        <TechNode
          key={i}
          position={pos}
          color={NODE_COLORS[i]}
          size={i % 4 === 0 ? 0.13 : 0.08}
        />
      ))}

      {/* Connection lines */}
      <ConnectionLines positions={positions} />
    </group>
  )
}

export default function TechSphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 48 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[6, 6, 6]}   color="#00F5FF" intensity={3} />
      <pointLight position={[-6, -6, 4]} color="#9D00FF" intensity={2} />
      <Sphere3D />
    </Canvas>
  )
}
