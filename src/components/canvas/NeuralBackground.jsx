import { useEffect, useRef } from 'react'
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color,
  Group, LineBasicMaterial, LineSegments, PerspectiveCamera, Points,
  PointsMaterial, Scene, WebGLRenderer,
} from 'three'

const PALETTE = ['#00e5ff', '#00ff85', '#9d00ff']
const FIELD_W = 30
const FIELD_H = 18
const FIELD_D = 12
const MAX_DIST = 4.6
const PULSE_COUNT = 40

// Sprite circular con degradado radial: hace que cada punto brille sin shaders.
function makeGlowTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.55)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return new CanvasTexture(canvas)
}

function buildNetwork(nodeCount) {
  const positions = new Float32Array(nodeCount * 3)
  const colors = new Float32Array(nodeCount * 3)
  const phases = new Float32Array(nodeCount)
  const color = new Color()

  for (let i = 0; i < nodeCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * FIELD_W
    positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_H
    positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_D - 4
    color.set(PALETTE[i % 7 === 0 ? 2 : i % 5 === 0 ? 1 : 0])
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
    phases[i] = Math.random() * Math.PI * 2
  }

  const edges = []
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = positions[i * 3] - positions[j * 3]
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < MAX_DIST) edges.push([i, j])
    }
  }

  return { positions, colors, phases, edges }
}

export default function NeuralBackground() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const isMobile = window.innerWidth < 768
    const nodeCount = isMobile ? 70 : 130
    const { positions, colors, phases, edges } = buildNetwork(nodeCount)
    const basePositions = positions.slice()

    const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75))
    renderer.setSize(window.innerWidth, window.innerHeight)
    host.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 11)

    const group = new Group()
    scene.add(group)

    const glow = makeGlowTexture()

    // Nodos
    const nodeGeometry = new BufferGeometry()
    nodeGeometry.setAttribute('position', new BufferAttribute(positions, 3))
    nodeGeometry.setAttribute('color', new BufferAttribute(colors, 3))
    const nodeMaterial = new PointsMaterial({
      size: isMobile ? 0.34 : 0.42, map: glow, vertexColors: true, transparent: true,
      opacity: 0.95, depthWrite: false, blending: AdditiveBlending, sizeAttenuation: true,
    })
    group.add(new Points(nodeGeometry, nodeMaterial))

    // Conexiones
    const linePositions = new Float32Array(edges.length * 6)
    const lineGeometry = new BufferGeometry()
    lineGeometry.setAttribute('position', new BufferAttribute(linePositions, 3))
    const lineMaterial = new LineBasicMaterial({
      color: '#00e5ff', transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false,
    })
    group.add(new LineSegments(lineGeometry, lineMaterial))

    // Pulsos de datos que viajan por las conexiones
    const pulseCount = Math.min(PULSE_COUNT, edges.length)
    const pulsePositions = new Float32Array(pulseCount * 3)
    const pulseColors = new Float32Array(pulseCount * 3)
    const pulseMeta = []
    const pulseColor = new Color()
    for (let i = 0; i < pulseCount; i++) {
      const edge = edges[Math.floor(Math.random() * edges.length)]
      pulseMeta.push({ edge, speed: 0.25 + Math.random() * 0.5, offset: Math.random() })
      pulseColor.set(PALETTE[i % 3])
      pulseColors[i * 3] = pulseColor.r
      pulseColors[i * 3 + 1] = pulseColor.g
      pulseColors[i * 3 + 2] = pulseColor.b
    }
    const pulseGeometry = new BufferGeometry()
    pulseGeometry.setAttribute('position', new BufferAttribute(pulsePositions, 3))
    pulseGeometry.setAttribute('color', new BufferAttribute(pulseColors, 3))
    const pulseMaterial = new PointsMaterial({
      size: 0.22, map: glow, vertexColors: true, transparent: true,
      depthWrite: false, blending: AdditiveBlending,
    })
    group.add(new Points(pulseGeometry, pulseMaterial))

    // Entrada: mouse y scroll
    const pointer = { x: 0, y: 0 }
    let scrollRatio = 0
    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
    }
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollRatio = Math.min(1, window.scrollY / max)
    }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll()

    let frame = 0
    let hidden = document.hidden
    const onVisibility = () => { hidden = document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    const start = performance.now()
    const tick = (now) => {
      frame = requestAnimationFrame(tick)
      if (hidden) return
      const t = (now - start) / 1000

      // Nodos flotan alrededor de su posición base
      for (let i = 0; i < nodeCount; i++) {
        const p = phases[i]
        positions[i * 3] = basePositions[i * 3] + Math.sin(t * 0.35 + p) * 0.25
        positions[i * 3 + 1] = basePositions[i * 3 + 1] + Math.cos(t * 0.28 + p) * 0.25
      }
      nodeGeometry.attributes.position.needsUpdate = true

      // Las líneas siguen a los nodos
      for (let e = 0; e < edges.length; e++) {
        const [a, b] = edges[e]
        linePositions[e * 6] = positions[a * 3]
        linePositions[e * 6 + 1] = positions[a * 3 + 1]
        linePositions[e * 6 + 2] = positions[a * 3 + 2]
        linePositions[e * 6 + 3] = positions[b * 3]
        linePositions[e * 6 + 4] = positions[b * 3 + 1]
        linePositions[e * 6 + 5] = positions[b * 3 + 2]
      }
      lineGeometry.attributes.position.needsUpdate = true

      // Pulsos viajan de un nodo al otro
      for (let i = 0; i < pulseCount; i++) {
        const { edge: [a, b], speed, offset } = pulseMeta[i]
        const k = (t * speed + offset) % 1
        pulsePositions[i * 3] = positions[a * 3] + (positions[b * 3] - positions[a * 3]) * k
        pulsePositions[i * 3 + 1] = positions[a * 3 + 1] + (positions[b * 3 + 1] - positions[a * 3 + 1]) * k
        pulsePositions[i * 3 + 2] = positions[a * 3 + 2] + (positions[b * 3 + 2] - positions[a * 3 + 2]) * k
      }
      pulseGeometry.attributes.position.needsUpdate = true

      // Rotación: deriva lenta + mouse + scroll (la red gira al bajar por la página)
      const targetY = pointer.x * 0.45 + t * 0.015 + scrollRatio * 1.4
      const targetX = -pointer.y * 0.25 + scrollRatio * 0.35
      group.rotation.y += (targetY - group.rotation.y) * 0.045
      group.rotation.x += (targetX - group.rotation.x) * 0.045
      camera.position.z = 11 - scrollRatio * 2.5

      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      nodeGeometry.dispose(); lineGeometry.dispose(); pulseGeometry.dispose()
      nodeMaterial.dispose(); lineMaterial.dispose(); pulseMaterial.dispose()
      glow.dispose()
      renderer.dispose()
      host.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={hostRef} className="neural-bg" aria-hidden="true" />
}
