import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCw, ZoomIn, ZoomOut, CheckCircle2, Play, Pause, Compass, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface RIASECNodeInfo {
  code: string
  name: string
  vnName: string
  score: number
  color: string
  hex: number
  desc: string
  careers: string[]
  radius: number
  speed: number
  inclination: number
  initialAngle: number
}

const NODES_DATA: RIASECNodeInfo[] = [
  {
    code: 'R',
    name: 'REALISTIC',
    vnName: 'Kỹ thuật & Thực tế',
    score: 84,
    color: '#06b6d4',
    hex: 0x06b6d4,
    desc: 'Thiên hướng thao tác kỹ thuật, cơ điện tử, tự động hóa, xây dựng công trình và giải pháp vật lý ứng dụng.',
    careers: ['Kỹ sư Cơ điện tử / Robotics', 'Lập trình viên IoT', 'Kỹ sư Xây dựng hạ tầng'],
    radius: 2.7,
    speed: 0.42,
    inclination: 0.28,
    initialAngle: 0,
  },
  {
    code: 'I',
    name: 'INVESTIGATIVE',
    vnName: 'Nghiên cứu & Tư duy',
    score: 92,
    color: '#6366f1',
    hex: 0x6366f1,
    desc: 'Đam mê khám phá quy luật tự nhiên, phân tích dữ liệu chuyên sâu, mô hình toán học và giải quyết bài toán phức tạp.',
    careers: ['Chuyên gia Khoa học Dữ liệu / AI', 'Nghiên cứu Y sinh', 'Kỹ sư Thuật toán'],
    radius: 3.2,
    speed: 0.35,
    inclination: -0.42,
    initialAngle: 1.05,
  },
  {
    code: 'A',
    name: 'ARTISTIC',
    vnName: 'Sáng tạo & Nghệ thuật',
    score: 78,
    color: '#ec4899',
    hex: 0xec4899,
    desc: 'Giàu trí tưởng tượng, độc bản, yêu thích thiết kế đa phương tiện, thẩm mỹ thị giác và đổi mới trải nghiệm.',
    careers: ['UI/UX Product Designer', 'Đạo diễn Nghệ thuật', 'Nhà thiết kế Game 3D'],
    radius: 2.5,
    speed: 0.52,
    inclination: 0.55,
    initialAngle: 2.1,
  },
  {
    code: 'S',
    name: 'SOCIAL',
    vnName: 'Xã hội & Giáo dục',
    score: 86,
    color: '#10b981',
    hex: 0x10b981,
    desc: 'Thấu hiểu cảm xúc, giàu lòng trắc ẩn, yêu thích chia sẻ kiến thức, gắn kết cộng đồng và phát triển con người.',
    careers: ['Chuyên gia Tâm lý học', 'Cố vấn Hướng nghiệp', 'Nhà quản trị Nhân sự Quốc tế'],
    radius: 3.4,
    speed: 0.31,
    inclination: -0.22,
    initialAngle: 3.14,
  },
  {
    code: 'E',
    name: 'ENTERPRISING',
    vnName: 'Quản trị & Kinh doanh',
    score: 80,
    color: '#f59e0b',
    hex: 0xf59e0b,
    desc: 'Bản lĩnh dẫn dắt, tầm nhìn chiến lược, nghệ thuật thương thuyết, khởi nghiệp đổi mới sáng tạo và chinh phục mục tiêu.',
    careers: ['Giám đốc Phát triển Kinh doanh', 'Founder Khởi nghiệp Công nghệ', 'Chuyên gia Đầu tư Tài chính'],
    radius: 2.9,
    speed: 0.46,
    inclination: 0.38,
    initialAngle: 4.19,
  },
  {
    code: 'C',
    name: 'CONVENTIONAL',
    vnName: 'Quy trình & Tổ chức',
    score: 75,
    color: '#a855f7',
    hex: 0xa855f7,
    desc: 'Tỉ mỉ, chuẩn xác, làm chủ dữ liệu số, tối ưu hệ thống vận hành và tuân thủ các chuẩn mực chất lượng cao nhất.',
    careers: ['Chuyên gia Phân tích Tài chính', 'Kiểm toán viên Quốc tế', 'Quản trị Hệ thống ERP'],
    radius: 3.1,
    speed: 0.38,
    inclination: -0.5,
    initialAngle: 5.24,
  },
]

/** Generate procedural glowing radial texture for high-fidelity glowing bloom sprites */
function createGlowTexture(colorStr: string, size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const center = size / 2
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center)
    gradient.addColorStop(0, colorStr)
    gradient.addColorStop(0.2, colorStr)
    gradient.addColorStop(0.55, 'rgba(56, 189, 248, 0.25)')
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/** Generate crisp circular 3D floating sprite badge for each RIASEC node */
function createBadgeTexture(letter: string, colorStr: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const center = 64
    const radius = 54

    // Outer glow
    ctx.shadowColor = colorStr
    ctx.shadowBlur = 18

    // Background circle
    ctx.beginPath()
    ctx.arc(center, center, radius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(6, 11, 24, 0.88)'
    ctx.fill()

    // Border
    ctx.lineWidth = 6
    ctx.strokeStyle = colorStr
    ctx.stroke()

    // Letter
    ctx.shadowBlur = 8
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 58px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, center, center + 4)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function ThreeCareerSphere() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeNode, setActiveNode] = useState<RIASECNodeInfo | null>(NODES_DATA[1] ?? null)
  const [isAutoSpin, setIsAutoSpin] = useState(true)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const autoSpinRef = useRef(true)

  useEffect(() => {
    autoSpinRef.current = isAutoSpin
  }, [isAutoSpin])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth || 480
    let height = container.clientHeight || 480

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.8, 8.4)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    container.appendChild(renderer.domElement)

    // 2. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const coreLight = new THREE.PointLight(0x38bdf8, 3.5, 16)
    coreLight.position.set(0, 0, 0)
    scene.add(coreLight)

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 2.2)
    dirLight1.position.set(6, 8, 8)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x2dd4bf, 1.6)
    dirLight2.position.set(-6, -6, -4)
    scene.add(dirLight2)

    // 3. Central Universe Group
    const universeGroup = new THREE.Group()
    scene.add(universeGroup)

    // ==========================================
    // A. CENTRAL QUANTUM CORE (Bản lĩnh Holland)
    // ==========================================
    const coreGroup = new THREE.Group()
    universeGroup.add(coreGroup)

    // A1. Core glowing plasma sprite
    const coreGlowTex = createGlowTexture('rgba(56, 189, 248, 1)', 256)
    const coreGlowMat = new THREE.SpriteMaterial({
      map: coreGlowTex,
      color: 0x38bdf8,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
    })
    const coreGlowSprite = new THREE.Sprite(coreGlowMat)
    coreGlowSprite.scale.set(3.4, 3.4, 1)
    coreGroup.add(coreGlowSprite)

    // A2. Faceted crystal sphere
    const crystalGeo = new THREE.IcosahedronGeometry(0.82, 2)
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x2563eb,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.85,
      flatShading: true,
    })
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat)
    coreGroup.add(crystalMesh)

    // A3. Geodesic wireframe overlay
    const wireGeo = new THREE.IcosahedronGeometry(0.85, 2)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    })
    const wireMesh = new THREE.Mesh(wireGeo, wireMat)
    coreGroup.add(wireMesh)

    // A4. Holographic Gyroscope Orbit Rings around Core
    const gyroRingGeo1 = new THREE.TorusGeometry(1.35, 0.015, 16, 100)
    const gyroRingMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
    })
    const gyroRing1 = new THREE.Mesh(gyroRingGeo1, gyroRingMat1)
    gyroRing1.rotation.x = Math.PI / 3.5
    coreGroup.add(gyroRing1)

    const gyroRingGeo2 = new THREE.TorusGeometry(1.5, 0.015, 16, 100)
    const gyroRingMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.45,
    })
    const gyroRing2 = new THREE.Mesh(gyroRingGeo2, gyroRingMat2)
    gyroRing2.rotation.y = Math.PI / 2.8
    gyroRing2.rotation.z = Math.PI / 5
    coreGroup.add(gyroRing2)

    // ==========================================
    // B. 6 RIASEC PLANETARY SATELLITES & ORBITS
    // ==========================================
    interface PlanetMeshItem {
      group: THREE.Group
      sphere: THREE.Mesh
      auraSprite: THREE.Sprite
      badgeSprite: THREE.Sprite
      haloRing: THREE.Mesh
      pulseParticles?: THREE.Points
      data: RIASECNodeInfo
      currentAngle: number
      targetScale: number
    }

    const planetItems: PlanetMeshItem[] = []

    NODES_DATA.forEach((node) => {
      // 1. Orbit Track Ellipse
      const trackPoints: THREE.Vector3[] = []
      const segments = 80
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        const x = node.radius * Math.cos(theta)
        const z = node.radius * Math.sin(theta)
        const y = Math.sin(theta) * Math.tan(node.inclination) * 0.85
        trackPoints.push(new THREE.Vector3(x, y, z))
      }
      const trackGeo = new THREE.BufferGeometry().setFromPoints(trackPoints)
      const trackMat = new THREE.LineBasicMaterial({
        color: node.hex,
        transparent: true,
        opacity: 0.22,
      })
      const trackLine = new THREE.Line(trackGeo, trackMat)
      universeGroup.add(trackLine)

      // 2. Planet Group
      const pGroup = new THREE.Group()
      universeGroup.add(pGroup)

      // 3. Planet Sphere
      const sphereGeo = new THREE.SphereGeometry(0.3, 32, 32)
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.hex,
        emissive: node.hex,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.75,
      })
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
      sphereMesh.userData = { nodeData: node }
      pGroup.add(sphereMesh)

      // 4. Glow Aura Sprite
      const auraTex = createGlowTexture(node.color, 128)
      const auraMat = new THREE.SpriteMaterial({
        map: auraTex,
        color: node.hex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.7,
      })
      const auraSprite = new THREE.Sprite(auraMat)
      auraSprite.scale.set(1.5, 1.5, 1)
      pGroup.add(auraSprite)

      // 5. Floating Badge Sprite with Letter (R, I, A, S, E, C)
      const badgeTex = createBadgeTexture(node.code, node.color)
      const badgeMat = new THREE.SpriteMaterial({
        map: badgeTex,
        transparent: true,
        depthTest: false,
      })
      const badgeSprite = new THREE.Sprite(badgeMat)
      badgeSprite.scale.set(0.65, 0.65, 1)
      badgeSprite.position.set(0, 0.52, 0)
      pGroup.add(badgeSprite)

      // 6. Mini Accent Halo Ring
      const haloGeo = new THREE.TorusGeometry(0.44, 0.02, 16, 48)
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.hex,
        transparent: true,
        opacity: 0.6,
      })
      const haloRing = new THREE.Mesh(haloGeo, haloMat)
      haloRing.rotation.x = Math.PI / 2.3
      pGroup.add(haloRing)

      planetItems.push({
        group: pGroup,
        sphere: sphereMesh,
        auraSprite,
        badgeSprite,
        haloRing,
        data: node,
        currentAngle: node.initialAngle,
        targetScale: 1,
      })
    })

    // ==========================================
    // C. DYNAMIC CONNECTORS & TRAVELING LIGHT PHOTONS
    // ==========================================
    const beamCount = NODES_DATA.length
    const beamGeometries: THREE.BufferGeometry[] = []
    const beamLines: THREE.Line[] = []

    for (let i = 0; i < beamCount; i++) {
      const bGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 1, 1),
      ])
      const bMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
      })
      const bLine = new THREE.Line(bGeo, bMat)
      universeGroup.add(bLine)
      beamGeometries.push(bGeo)
      beamLines.push(bLine)
    }

    // Traveling Photons along beams
    const photonCount = 6
    const photonGeo = new THREE.SphereGeometry(0.06, 16, 16)
    const photonMeshes: THREE.Mesh[] = []
    for (let i = 0; i < photonCount; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
      })
      const pMesh = new THREE.Mesh(photonGeo, pMat)
      universeGroup.add(pMesh)
      photonMeshes.push(pMesh)
    }

    // Perimeter Constellation Polygon Line
    const polyGeo = new THREE.BufferGeometry()
    const polyPositions = new Float32Array(beamCount * 3)
    polyGeo.setAttribute('position', new THREE.BufferAttribute(polyPositions, 3))
    const polyMat = new THREE.LineLoop(
      polyGeo,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25,
      }),
    )
    universeGroup.add(polyMat)

    // ==========================================
    // D. 1,200 COSMIC STARS & GALACTIC DUST
    // ==========================================
    const starCount = 1200
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)

    const palette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0x2dd4bf),
      new THREE.Color(0xfbbf24),
      new THREE.Color(0xffffff),
    ]

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3
      const dist = 5 + Math.random() * 14
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI

      starPos[idx] = dist * Math.cos(theta) * Math.cos(phi)
      starPos[idx + 1] = dist * Math.sin(phi)
      starPos[idx + 2] = dist * Math.sin(theta) * Math.cos(phi)

      const col = palette[Math.floor(Math.random() * palette.length)]!
      starColors[idx] = col.r
      starColors[idx + 1] = col.g
      starColors[idx + 2] = col.b
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    const starMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    })
    const starField = new THREE.Points(starGeo, starMat)
    scene.add(starField)

    // ==========================================
    // E. INTERACTIVE CONTROLS & EVENT LISTENERS
    // ==========================================
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let velX = 0.003
    let velY = 0.001
    let rotY = 0
    let rotX = 0.2
    let mouseParallaxX = 0
    let mouseParallaxY = 0

    const raycaster = new THREE.Raycaster()
    const mouseCoord = new THREE.Vector2()

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      mouseParallaxX = (e.clientX - window.innerWidth / 2) * 0.0002
      mouseParallaxY = (e.clientY - window.innerHeight / 2) * 0.0002

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        velX = deltaX * 0.007
        velY = deltaY * 0.007
        rotY += velX
        rotX += velY
        prevMouseX = e.clientX
        prevMouseY = e.clientY
      } else {
        // Raycasting on hover
        raycaster.setFromCamera(mouseCoord, camera)
        const hit = raycaster.intersectObjects(planetItems.map((p) => p.sphere))
        if (hit.length > 0) {
          container.style.cursor = 'pointer'
        } else {
          container.style.cursor = 'grab'
        }
      }
    }

    const onMouseUp = () => {
      isDragging = false
      container.style.cursor = 'grab'
    }

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouseCoord, camera)
      const hits = raycaster.intersectObjects(planetItems.map((p) => p.sphere))

      if (hits.length > 0) {
        const hitData = hits[0]!.object.userData.nodeData as RIASECNodeInfo
        setActiveNode(hitData)
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.004, 5.2, 10.5)
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
    dom.addEventListener('click', onClick)
    dom.addEventListener('wheel', onWheel, { passive: false })
    dom.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    // Resize Handler
    const onResize = () => {
      if (!container) return
      width = container.clientWidth || 480
      height = container.clientHeight || 480
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    // ==========================================
    // F. MAIN RENDER & ANIMATION LOOP
    // ==========================================
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Smooth Inertia Rotation
      if (!isDragging) {
        velX *= 0.94
        velY *= 0.94
        if (autoSpinRef.current) {
          rotY += 0.004 + velX
        } else {
          rotY += velX
        }
        rotX += velY
      }

      rotX = THREE.MathUtils.clamp(rotX, -0.85, 0.85)

      universeGroup.rotation.y += (rotY + mouseParallaxX - universeGroup.rotation.y) * 0.1
      universeGroup.rotation.x += (rotX + mouseParallaxY - universeGroup.rotation.x) * 0.1

      // Core Breathing Pulse
      const corePulse = 1 + Math.sin(time * 2.4) * 0.08
      coreGlowSprite.scale.set(3.4 * corePulse, 3.4 * corePulse, 1)
      wireMesh.rotation.y = time * 0.35
      wireMesh.rotation.x = time * 0.2
      crystalMesh.rotation.y = -time * 0.25

      gyroRing1.rotation.z += 0.003
      gyroRing2.rotation.z -= 0.004

      // Orbit Planet Calculations
      const currentPlanetPositions: THREE.Vector3[] = []

      planetItems.forEach((p, idx) => {
        // Orbit advance
        if (autoSpinRef.current) {
          p.currentAngle += p.data.speed * delta * 0.8
        }

        const x = p.data.radius * Math.cos(p.currentAngle)
        const z = p.data.radius * Math.sin(p.currentAngle)
        const y = Math.sin(p.currentAngle) * Math.tan(p.data.inclination) * 0.85
        const pos = new THREE.Vector3(x, y, z)
        p.group.position.copy(pos)
        currentPlanetPositions.push(pos)

        // Planet self spin
        p.sphere.rotation.y += 0.02
        p.haloRing.rotation.z += 0.015

        // Smooth Hover & Active Scale
        const isActive = activeNode?.code === p.data.code
        const targetScale = isActive ? 1.35 : 1
        p.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

        // Update Beam Line from core to planet
        const beamGeo = beamGeometries[idx]
        if (beamGeo) {
          beamGeo.setFromPoints([new THREE.Vector3(0, 0, 0), pos])
        }

        // Traveling photon along beam
        const photon = photonMeshes[idx]
        if (photon) {
          const progress = (time * 0.7 + idx * 0.35) % 1
          photon.position.copy(pos.clone().multiplyScalar(progress))
        }
      })

      // Update Polygon line
      const polyAttr = polyGeo.attributes.position as THREE.BufferAttribute
      if (polyAttr && currentPlanetPositions.length === NODES_DATA.length) {
        for (let i = 0; i < currentPlanetPositions.length; i++) {
          const p = currentPlanetPositions[i]!
          polyAttr.setXYZ(i, p.x, p.y, p.z)
        }
        polyAttr.needsUpdate = true
      }

      // Starfield slow cosmic rotation
      starField.rotation.y = time * 0.015

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      dom.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      dom.removeEventListener('click', onClick)
      dom.removeEventListener('wheel', onWheel)
      dom.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      if (dom.parentNode) {
        dom.parentNode.removeChild(dom)
      }
      renderer.dispose()
    }
  }, [])

  const zoomCamera = (delta: number) => {
    if (cameraRef.current) {
      cameraRef.current.position.z = THREE.MathUtils.clamp(
        cameraRef.current.position.z + delta,
        5.2,
        10.5
      )
    }
  }

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 1.8, 8.4)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[540px] mx-auto select-none">
      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-[320px] sm:h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/40 backdrop-blur-sm touch-pan-y"
      >
        {/* Floating 3D Control Header Badge */}
        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 max-w-[46%] sm:max-w-none flex items-center gap-1.5 sm:gap-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#060b18]/90 px-2.5 py-1 sm:px-3.5 sm:py-1.5 backdrop-blur-xl shadow-soft">
          <RotateCw className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-electric-400 animate-spin [animation-duration:14s] shrink-0" />
          <span className="text-[0.62rem] sm:text-[0.68rem] font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase truncate">
            <span className="inline sm:hidden">3D Orbit</span>
            <span className="hidden sm:inline">3D Constellation</span>
          </span>
          <span className="hidden xs:flex h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
        </div>

        {/* Floating Interactive Controls Bar */}
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
            onClick={() => zoomCamera(-0.8)}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            title="Phóng to"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => zoomCamera(0.8)}
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

        {/* Bottom Interactive Hint */}
        <div className="absolute bottom-2.5 inset-x-3 sm:bottom-3 sm:inset-x-4 z-20 flex items-center justify-between pointer-events-none text-[0.62rem] sm:text-[0.68rem] font-medium text-slate-400 dark:text-slate-500">
          <span>Kéo 360° để tương tác</span>
          <span>Chạm vào hành tinh để xem</span>
        </div>
      </div>

      {/* Quick-Select RIASEC Filter Pills */}
      <div className="mt-3 flex w-full items-center justify-between gap-1 sm:gap-1.5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#060b18]/70 p-1 sm:p-1.5 backdrop-blur-xl">
        {NODES_DATA.map((node) => {
          const isActive = activeNode?.code === node.code
          return (
            <button
              key={node.code}
              type="button"
              onClick={() => setActiveNode(node)}
              className={`flex-1 flex flex-col items-center justify-center py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cobalt-600 to-electric-500 text-white shadow-glow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="font-mono">{node.code}</span>
              <span className="text-[0.62rem] font-medium opacity-85 hidden sm:inline">{node.score}%</span>
            </button>
          )
        })}
      </div>

      {/* Interactive Active 3D Node Details Card */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            key={activeNode.code}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="relative z-30 mt-3 w-full rounded-3xl border border-slate-200 dark:border-white/15 bg-white/95 dark:bg-[#0a1128]/95 p-5 shadow-lift backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl font-mono text-lg font-black text-white shadow-lift"
                  style={{
                    backgroundColor: activeNode.color,
                    boxShadow: `0 0 20px ${activeNode.color}66`,
                  }}
                >
                  {activeNode.code}
                </span>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeNode.name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {activeNode.vnName}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-2xl font-black text-electric-400">
                  {activeNode.score}%
                </span>
                <p className="text-[0.62rem] font-bold text-slate-400 dark:text-slate-500 uppercase">
                  Tương thích
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {activeNode.desc}
            </p>

            <div className="mt-3.5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.03] p-3">
              <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold-400" /> Ngành nghề tiêu biểu tương thích:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeNode.careers.map((career) => (
                  <span
                    key={career}
                    className="inline-flex items-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-0.5 text-[0.7rem] font-medium text-slate-700 dark:text-slate-200"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-3 text-[0.72rem]">
              <span className="flex items-center gap-1.5 text-teal-500 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Chuẩn hóa quốc tế Holland RIASEC
              </span>
              <Link
                to="/intro"
                className="inline-flex items-center gap-1 font-bold text-cobalt-600 dark:text-electric-400 hover:underline"
              >
                Làm bài test 60 câu
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
