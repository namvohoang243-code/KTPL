import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RotateCw, Compass, Layers, ZoomIn, ZoomOut, Play, Pause, Sparkles } from 'lucide-react'
import { PERSONALITY_MAP } from '@/data/personalities'
import type { PersonalityCode, ScoreMap } from '@/types'

interface ThreeResultCrystalProps {
  scores: ScoreMap
  topCodes: string[]
}

interface AxisConfigItem {
  code: PersonalityCode
  angle: number
  color: string
  hex: number
}

const AXIS_CONFIG: AxisConfigItem[] = [
  { code: 'R', angle: 0, color: '#06b6d4', hex: 0x06b6d4 },
  { code: 'I', angle: (Math.PI / 3) * 1, color: '#6366f1', hex: 0x6366f1 },
  { code: 'A', angle: (Math.PI / 3) * 2, color: '#ec4899', hex: 0xec4899 },
  { code: 'S', angle: (Math.PI / 3) * 3, color: '#10b981', hex: 0x10b981 },
  { code: 'E', angle: (Math.PI / 3) * 4, color: '#f59e0b', hex: 0xf59e0b },
  { code: 'C', angle: (Math.PI / 3) * 5, color: '#a855f7', hex: 0xa855f7 },
]

/** Generates floating 3D canvas label texture with code + score */
function createScoreBadgeTexture(code: string, score: number, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 70
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.shadowColor = color
    ctx.shadowBlur = 12

    // Rounded badge background
    ctx.fillStyle = 'rgba(6, 11, 24, 0.9)'
    ctx.beginPath()
    ctx.roundRect(8, 8, 144, 54, 16)
    ctx.fill()

    ctx.lineWidth = 3
    ctx.strokeStyle = color
    ctx.stroke()

    // Text: Code & score
    ctx.shadowBlur = 4
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${code} : ${score}%`, 80, 36)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function ThreeResultCrystal({ scores, topCodes }: ThreeResultCrystalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [wireframeOnly, setWireframeOnly] = useState(false)
  const [isAutoSpin, setIsAutoSpin] = useState(true)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const autoSpinRef = useRef(true)
  const wireframeRef = useRef(false)

  useEffect(() => {
    autoSpinRef.current = isAutoSpin
  }, [isAutoSpin])

  useEffect(() => {
    wireframeRef.current = wireframeOnly
  }, [wireframeOnly])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth || 440
    let height = container.clientHeight || 440

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.8, 7.5)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const coreLight = new THREE.PointLight(0x38bdf8, 3, 14)
    scene.add(coreLight)

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 2)
    dirLight1.position.set(6, 6, 6)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x2dd4bf, 1.5)
    dirLight2.position.set(-6, -6, -4)
    scene.add(dirLight2)

    // 3. Main Crystal Group
    const crystalGroup = new THREE.Group()
    scene.add(crystalGroup)

    // 4. Calculate 3D Vertices based on actual RIASEC scores
    const maxRadius = 2.8
    const baseHeight = 1.4

    // 6 peripheral vertices on xy plane with elevation
    const vertices: THREE.Vector3[] = []
    AXIS_CONFIG.forEach((axis, idx) => {
      const score = (scores[axis.code] ?? 50) / 100
      const r = Math.max(0.6, score * maxRadius)
      const x = r * Math.cos(axis.angle)
      const z = r * Math.sin(axis.angle)
      // Subtle alternating height to give a multi-dimensional 3D diamond prism feel
      const y = (idx % 2 === 0 ? 0.35 : -0.35) * (score * 0.9)
      vertices.push(new THREE.Vector3(x, y, z))
    })

    // Top and Bottom Apex Vertices
    const primaryCode = (topCodes[0] || 'I') as PersonalityCode
    const topScore = (scores[primaryCode] ?? 80) / 100
    const topApex = new THREE.Vector3(0, baseHeight * (0.8 + topScore * 0.6), 0)
    const bottomApex = new THREE.Vector3(0, -baseHeight * (0.8 + topScore * 0.6), 0)

    // 5. Build 3D Crystal Polyhedron Geometry (Triangular faces)
    const positions: number[] = []
    const colors: number[] = []

    // Top Pyramidal Cap Faces (topApex -> v[i] -> v[i+1])
    for (let i = 0; i < 6; i++) {
      const v1 = vertices[i]!
      const v2 = vertices[(i + 1) % 6]!

      // Push 3 vertices of triangle
      positions.push(topApex.x, topApex.y, topApex.z)
      positions.push(v1.x, v1.y, v1.z)
      positions.push(v2.x, v2.y, v2.z)

      const c1 = new THREE.Color(AXIS_CONFIG[i]!.hex)
      const c2 = new THREE.Color(AXIS_CONFIG[(i + 1) % 6]!.hex)
      const cApex = new THREE.Color(0x38bdf8)

      colors.push(cApex.r, cApex.g, cApex.b)
      colors.push(c1.r, c1.g, c1.b)
      colors.push(c2.r, c2.g, c2.b)
    }

    // Bottom Pyramidal Cap Faces (bottomApex -> v[i+1] -> v[i])
    for (let i = 0; i < 6; i++) {
      const v1 = vertices[i]!
      const v2 = vertices[(i + 1) % 6]!

      positions.push(bottomApex.x, bottomApex.y, bottomApex.z)
      positions.push(v2.x, v2.y, v2.z)
      positions.push(v1.x, v1.y, v1.z)

      const c1 = new THREE.Color(AXIS_CONFIG[i]!.hex)
      const c2 = new THREE.Color(AXIS_CONFIG[(i + 1) % 6]!.hex)
      const cApex = new THREE.Color(0x1e293b)

      colors.push(cApex.r, cApex.g, cApex.b)
      colors.push(c2.r, c2.g, c2.b)
      colors.push(c1.r, c1.g, c1.b)
    }

    const crystalGeo = new THREE.BufferGeometry()
    crystalGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    crystalGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    crystalGeo.computeVertexNormals()

    // Solid Translucent Holographic Material
    const crystalMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      roughness: 0.15,
      metalness: 0.8,
      side: THREE.DoubleSide,
    })
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat)
    crystalGroup.add(crystalMesh)

    // Crystal Wireframe Outline
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    })
    const wireMesh = new THREE.Mesh(crystalGeo, wireMat)
    crystalGroup.add(wireMesh)

    // 6. Center Glowing Energy Core Sphere
    const coreGeo = new THREE.SphereGeometry(0.35, 24, 24)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    crystalGroup.add(coreMesh)

    // 7. 6 3D Radial Coordinate Axes with Score Labels
    AXIS_CONFIG.forEach((axis, idx) => {
      const v = vertices[idx]!
      const score = scores[axis.code] ?? 50

      // Axis Line from center to vertex and slightly beyond
      const axisEnd = v.clone().multiplyScalar(1.2)
      const axisGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), axisEnd])
      const axisMat = new THREE.LineBasicMaterial({
        color: axis.hex,
        transparent: true,
        opacity: 0.5,
      })
      const axisLine = new THREE.Line(axisGeo, axisMat)
      crystalGroup.add(axisLine)

      // Vertex Glowing Bead
      const beadGeo = new THREE.SphereGeometry(0.08, 16, 16)
      const beadMat = new THREE.MeshBasicMaterial({ color: axis.hex })
      const beadMesh = new THREE.Mesh(beadGeo, beadMat)
      beadMesh.position.copy(v)
      crystalGroup.add(beadMesh)

      // Floating Score Badge Sprite
      const badgeTex = createScoreBadgeTexture(axis.code, score, axis.color)
      const badgeMat = new THREE.SpriteMaterial({
        map: badgeTex,
        transparent: true,
        depthTest: false,
      })
      const badgeSprite = new THREE.Sprite(badgeMat)
      badgeSprite.scale.set(1.2, 0.55, 1)
      badgeSprite.position.copy(v.clone().multiplyScalar(1.28))
      badgeSprite.position.y += 0.2
      crystalGroup.add(badgeSprite)
    })

    // 8. 100% Threshold Radar Reference Ring
    const thresholdRingGeo = new THREE.RingGeometry(maxRadius * 0.98, maxRadius * 1.02, 64)
    const thresholdRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    })
    const thresholdRing = new THREE.Mesh(thresholdRingGeo, thresholdRingMat)
    thresholdRing.rotation.x = Math.PI / 2
    crystalGroup.add(thresholdRing)

    // 9. Floating Particle Swarm around Crystal
    const particleCount = 400
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.2 + Math.random() * 3.5
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 4
      pPos[i] = r * Math.cos(theta)
      pPos[i + 1] = y
      pPos[i + 2] = r * Math.sin(theta)
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
    })
    const particles = new THREE.Points(pGeo, pMat)
    crystalGroup.add(particles)

    // 10. Drag & Rotate Interaction
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let velX = 0.003
    let velY = 0.001
    let rotY = 0
    let rotX = 0.15

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        velX = deltaX * 0.007
        velY = deltaY * 0.007
        rotY += velX
        rotX += velY
        prevMouseX = e.clientX
        prevMouseY = e.clientY
      }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.004, 5.0, 10.0)
    }

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevMouseX = e.touches[0]!.clientX
        prevMouseY = e.touches[0]!.clientY
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0]!.clientX - prevMouseX
        const deltaY = e.touches[0]!.clientY - prevMouseY
        velX = deltaX * 0.007
        velY = deltaY * 0.007
        rotY += velX
        rotX += velY
        prevMouseX = e.touches[0]!.clientX
        prevMouseY = e.touches[0]!.clientY
      }
    }

    const onTouchEnd = () => {
      isDragging = false
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    dom.addEventListener('wheel', onWheel, { passive: false })
    dom.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    const onResize = () => {
      if (!container) return
      width = container.clientWidth || 440
      height = container.clientHeight || 440
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    // 11. Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      if (!isDragging) {
        velX *= 0.94
        velY *= 0.94
        if (autoSpinRef.current) {
          rotY += 0.005 + velX
        } else {
          rotY += velX
        }
        rotX += velY
      }

      rotX = THREE.MathUtils.clamp(rotX, -0.7, 0.7)

      crystalGroup.rotation.y = rotY
      crystalGroup.rotation.x = rotX

      // Core pulsating breathing
      const pulse = 1 + Math.sin(time * 2.8) * 0.12
      coreMesh.scale.set(pulse, pulse, pulse)

      // Solid vs Wireframe display mode toggle
      crystalMesh.visible = !wireframeRef.current

      // Particle slow orbit
      particles.rotation.y = time * 0.03

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      dom.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      dom.removeEventListener('wheel', onWheel)
      dom.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      if (dom.parentNode) {
        dom.parentNode.removeChild(dom)
      }
      renderer.dispose()
    }
  }, [scores, topCodes])

  const zoomCamera = (delta: number) => {
    if (cameraRef.current) {
      cameraRef.current.position.z = THREE.MathUtils.clamp(
        cameraRef.current.position.z + delta,
        5.0,
        10.0
      )
    }
  }

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 1.8, 7.5)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none">
      {/* 3D Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-[300px] sm:h-[420px] cursor-grab active:cursor-grabbing flex items-center justify-center rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/30 backdrop-blur-sm touch-pan-y"
      >
        {/* Top Left Badge */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 max-w-[46%] sm:max-w-none flex items-center gap-1.5 sm:gap-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#060b18]/90 px-2.5 py-1 sm:px-3.5 sm:py-1.5 backdrop-blur-xl shadow-soft">
          <RotateCw className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-electric-400 animate-spin [animation-duration:12s] shrink-0" />
          <span className="text-[0.62rem] sm:text-[0.68rem] font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase truncate">
            <span className="inline sm:hidden">3D Gem</span>
            <span className="hidden sm:inline">3D Holland Gem</span>
          </span>
          <span className="hidden xs:flex h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
        </div>

        {/* Top Right Controls */}
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 flex items-center gap-1 sm:gap-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#060b18]/90 p-0.5 sm:p-1 backdrop-blur-xl shadow-soft">
          <button
            type="button"
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            title={isAutoSpin ? 'Tạm dừng tự xoay' : 'Bật tự động xoay'}
            aria-label="Toggle auto-spin"
          >
            {isAutoSpin ? <Pause className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setWireframeOnly(!wireframeOnly)}
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition ${
              wireframeOnly
                ? 'bg-cobalt-600 text-white'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
            title="Chuyển chế độ khung lưới (Wireframe)"
            aria-label="Toggle wireframe"
          >
            <Layers className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => zoomCamera(-0.7)}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            title="Phóng to"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => zoomCamera(0.7)}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            title="Thu nhỏ"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={resetCamera}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            title="Đặt lại góc nhìn"
            aria-label="Reset view"
          >
            <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>

        {/* Bottom Status Hint */}
        <div className="absolute bottom-2.5 inset-x-3 sm:bottom-3 sm:inset-x-4 z-20 flex items-center justify-between pointer-events-none text-[0.62rem] sm:text-[0.68rem] font-medium text-slate-400 dark:text-slate-500">
          <span>Kéo xoay 360° để xem</span>
          <span className="flex items-center gap-1 text-electric-400 font-semibold">
            <Sparkles className="h-3 w-3" /> Độc bản theo bạn
          </span>
        </div>
      </div>

      {/* 6 Trait Score Indicators */}
      <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 w-full">
        {AXIS_CONFIG.map((axis) => {
          const score = scores[axis.code] ?? 0
          const p = PERSONALITY_MAP[axis.code]
          const isTop = topCodes.includes(axis.code)
          return (
            <div
              key={axis.code}
              className={`rounded-2xl border p-2.5 text-center transition-all ${
                isTop
                  ? 'border-cobalt-500/60 bg-cobalt-500/10 shadow-soft'
                  : 'border-slate-200/60 dark:border-white/5 bg-white/60 dark:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: axis.color }} />
                <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                  {axis.code}
                </span>
              </div>
              <p className="mt-1 font-mono text-base font-extrabold text-slate-900 dark:text-white">
                {score}%
              </p>
              <p className="text-[0.62rem] text-slate-500 dark:text-slate-400 truncate">
                {p?.title || p?.name}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
