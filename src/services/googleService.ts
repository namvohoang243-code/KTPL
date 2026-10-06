import { CAREER_CLUSTERS } from '@/data/careers'
import { PERSONALITY_CODES, PERSONALITY_MAP } from '@/data/personalities'
import { formatTopType, rankCodes } from '@/engine/scoring'
import type { GoogleFormConfig, PersonalityCode, ScoreMap, Student } from '@/types'

const STORAGE_KEY_CONFIG = 'career_map_google_config'
const STORAGE_KEY_SAVED_LOCAL = 'huong-nghiep-class-v1'

export const DEFAULT_GOOGLE_CONFIG: GoogleFormConfig = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSf-fALsGvgBe8ZDXT0FEDu8MitzVzjkE4MILt2Fu9cgJXYa0g/formResponse',
  entries: {
    name: 'entry.1725089956',
    cls: 'entry.1176256046',
    group: 'entry.1527121567',
    code: 'entry.1567656317',
    R: 'entry.1520246837',
    I: 'entry.598281442',
    A: 'entry.813077145',
    S: 'entry.1677780285',
    E: 'entry.1448984700',
    C: 'entry.1299200056',
    career: 'entry.66742343',
  },
  sheetCsvUrl: 'https://docs.google.com/spreadsheets/d/1Yw0TwDjlsKrFmAoglOyPOT5iFls_b4JjaQSKcPb45xs/edit?gid=1773219797#gid=1773219797',
  classSize: 30,
  showNames: true,
}

export function getGoogleConfig(): GoogleFormConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG)
    if (!raw) return DEFAULT_GOOGLE_CONFIG
    return { ...DEFAULT_GOOGLE_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_GOOGLE_CONFIG
  }
}

export function saveGoogleConfig(config: Partial<GoogleFormConfig>): GoogleFormConfig {
  const current = getGoogleConfig()
  const updated = { ...current, ...config }
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to save google config', e)
  }
  return updated
}

/**
 * Smart converter: turns any Google Sheet link (view, edit, pubhtml, export) into a direct CSV endpoint.
 */
export function convertToCsvUrl(rawUrl: string): string {
  const url = rawUrl.trim()
  if (!url) return ''

  // Already a CSV export or pub?output=csv
  if (url.includes('output=csv') || url.endsWith('.csv') || url.includes('gviz/tq?tqx=out:csv')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}t=${Date.now()}`
  }

  // Google Sheet published web page: /pubhtml -> /pub?output=csv
  if (url.includes('/pubhtml')) {
    const base = url.replace(/\/pubhtml.*$/, '/pub?output=csv')
    return `${base}&t=${Date.now()}`
  }

  // Standard Google Sheet URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/...
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (match?.[1]) {
    const sheetId = match[1]
    // Check if there is a gid parameter for a specific sheet tab
    const gidMatch = url.match(/[?&#]gid=([0-9]+)/)
    const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : ''
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv${gidParam}&t=${Date.now()}`
  }

  return url
}

export interface SendResultPayload {
  name: string
  cls: string
  group: string
  code: string
  rawScores: ScoreMap
  career: string
}

/**
 * Send test result to Google Form endpoint
 */
export async function sendToGoogleForm(payload: SendResultPayload, formConfig = getGoogleConfig()): Promise<boolean> {
  const { formUrl, entries } = formConfig
  if (!formUrl) {
    throw new Error('Chưa cấu hình Google Form URL')
  }

  const body = new URLSearchParams()
  const put = (k: keyof typeof entries, v: string) => {
    if (entries[k]) body.append(entries[k], v)
  }

  put('name', payload.name || 'Ẩn danh')
  put('cls', payload.cls || '10A1')
  put('group', payload.group)
  put('code', payload.code)

  PERSONALITY_CODES.forEach((k) => {
    put(k, String(payload.rawScores[k] ?? 0))
  })

  put('career', payload.career)

  // Google Form requires mode 'no-cors' from browser client
  await fetch(formUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  // Save to local backup list as well
  saveLocalStudent({
    id: `local_${Date.now()}`,
    name: payload.name,
    className: payload.cls,
    personality: normalizeScores(payload.rawScores),
    rawScores: payload.rawScores,
    topType: payload.code,
    careers: [mapCareerToCluster(payload.career)],
    primaryCareerName: payload.career,
    demo: false,
    submittedAt: new Date().toISOString(),
  })

  return true
}

export function loadLocalSavedStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_LOCAL)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveLocalStudent(student: Student) {
  try {
    const list = loadLocalSavedStudents()
    // Update or append
    const existingIdx = list.findIndex((s) => s.id === student.id || (s.name === student.name && s.submittedAt === student.submittedAt))
    if (existingIdx >= 0) {
      list[existingIdx] = student
    } else {
      list.push(student)
    }
    localStorage.setItem(STORAGE_KEY_SAVED_LOCAL, JSON.stringify(list))

    // Also sync to primary students storage so class roster updates immediately
    const primaryRaw = localStorage.getItem('careermap.students.v1')
    const primaryList: Student[] = primaryRaw ? JSON.parse(primaryRaw) : []
    const pIdx = primaryList.findIndex((s) => s.id === student.id || (s.name === student.name && s.submittedAt === student.submittedAt))
    if (pIdx >= 0) {
      primaryList[pIdx] = student
    } else {
      primaryList.push(student)
    }
    localStorage.setItem('careermap.students.v1', JSON.stringify(primaryList))

    // Broadcast to central server API so all connected devices (PCs, phones) receive it
    try {
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      }).catch(() => {})
    } catch {}
  } catch (e) {
    console.error('Failed to save local student', e)
  }
}

export function deleteLocalStudent(student: Partial<Student>) {
  try {
    const list = loadLocalSavedStudents()
    const updated = list.filter((s) => {
      if (student.id && s.id === student.id) return false
      if (student.name && s.name === student.name && s.className === student.className) return false
      return true
    })
    localStorage.setItem(STORAGE_KEY_SAVED_LOCAL, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to delete local student', e)
  }
}

export function clearLocalSavedStudents() {
  try {
    localStorage.removeItem(STORAGE_KEY_SAVED_LOCAL)
  } catch (e) {
    console.error('Failed to clear local students', e)
  }
}

/**
 * Robust CSV/TSV parser handling commas/tabs, quotes, multi-line values, and unicode.
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  // Strip BOM if present
  const cleaned = text.replace(/^\uFEFF/, '')

  // Detect tab delimiter (common when copying directly from Google Sheet table)
  const isTab = cleaned.includes('\t') && (!cleaned.includes(',') || cleaned.split('\t').length > cleaned.split(',').length)
  const delimiter = isTab ? '\t' : ','

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i]
    if (inQuotes) {
      if (ch === '"') {
        if (cleaned[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === delimiter) {
      row.push(field.trim())
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && cleaned[i + 1] === '\n') {
        i++
      }
      row.push(field.trim())
      rows.push(row)
      row = []
      field = ''
    } else {
      field += ch
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field.trim())
    rows.push(row)
  }

  return rows
}

/** Map Vietnamese career string to standard cluster id */
export function mapCareerToCluster(careerName?: string): string {
  if (!careerName) return 'technology'
  const norm = careerName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  if (norm.includes('phan mem') || norm.includes('data') || norm.includes('cong nghe') || norm.includes('an ninh mang')) return 'technology'
  if (norm.includes('co khi') || norm.includes('xay dung') || norm.includes('dien') || norm.includes('ky thuat') || norm.includes('phi cong')) return 'engineering'
  if (norm.includes('nghien cuu') || norm.includes('khoa hoc') || norm.includes('duoc') || norm.includes('sinh')) return 'science'
  if (norm.includes('thiet ke') || norm.includes('ui/ux') || norm.includes('sang tao') || norm.includes('noi that') || norm.includes('hoat hinh') || norm.includes('marketing')) return 'design'
  if (norm.includes('giao vien') || norm.includes('giang vien') || norm.includes('dao tao') || norm.includes('nhan su') || norm.includes('tam ly')) return 'education'
  if (norm.includes('bac si') || norm.includes('dieu duong') || norm.includes('y te') || norm.includes('cham soc')) return 'healthcare'
  if (norm.includes('khoi nghiep') || norm.includes('kinh doanh') || norm.includes('product') || norm.includes('ban hang') || norm.includes('leader')) return 'business'
  if (norm.includes('ke toan') || norm.includes('kiem toan') || norm.includes('tai chinh') || norm.includes('ngan hang') || norm.includes('logistics') || norm.includes('du an')) return 'finance'
  if (norm.includes('luat') || norm.includes('phap ly') || norm.includes('chinh tri')) return 'law'
  if (norm.includes('nong nghiep') || norm.includes('moi truong')) return 'environment'

  return 'technology'
}

/** Convert raw score sum to 0-100 percentage */
export function normalizeScores(raw: ScoreMap): ScoreMap {
  const result = {} as ScoreMap
  for (const c of PERSONALITY_CODES) {
    const val = raw[c] || 0
    if (val > 50) {
      // Already on 0-100% scale
      result[c] = Math.min(100, Math.round(val))
    } else if (val >= 10 && val <= 50) {
      // 10-50 scale for 10 questions rated 1-5
      result[c] = Math.min(100, Math.max(0, Math.round(((val - 10) / 40) * 100)))
    } else {
      // 0-10 or 0-20 scale
      result[c] = Math.min(100, Math.round((val / 10) * 100))
    }
  }
  return result
}

/**
 * Parses Google Form response CSV from Google Sheet into Student objects.
 * Handles standard Google Form columns:
 * [Timestamp, Name, Class, Main Group, Holland Code, R, I, A, S, E, C, Top Career]
 */
export function parseGoogleSheetCsv(csvContent: string): Student[] {
  const matrix = parseCSV(csvContent)
  if (matrix.length < 2) return []

  const header = matrix[0]!.map((h) => h.toLowerCase())

  // Dynamic column detection
  const findCol = (...keywords: string[]): number => {
    return header.findIndex((h) => keywords.some((k) => h.includes(k)))
  }

  let nameCol = findCol('tên', 'name', 'họ và tên', 'biệt danh')
  let clsCol = findCol('lớp', 'class', 'khoá', 'khóa')
  let codeCol = findCol('mã holland', 'holland', 'mã', 'code')
  let careerCol = findCol('nghề', 'career', 'ngành', 'gợi ý')

  // Find RIASEC columns
  const riasecColMap: Record<PersonalityCode, number> = {
    R: -1,
    I: -1,
    A: -1,
    S: -1,
    E: -1,
    C: -1,
  }

  for (const c of PERSONALITY_CODES) {
    // Look for exact column header 'R', 'I', 'A', 'S', 'E', 'C'
    let colIdx = header.findIndex((h) => h === c.toLowerCase() || h.startsWith(`${c.toLowerCase()} `) || h.endsWith(` ${c.toLowerCase()}`))
    if (colIdx === -1) {
      // Look for Vietnamese name: Thực tế, Phân tích, Sáng tạo, Kết nối, Lãnh đạo, Tổ chức
      const viName = PERSONALITY_MAP[c].name.toLowerCase()
      colIdx = header.findIndex((h) => h.includes(viName))
    }
    riasecColMap[c] = colIdx
  }

  // Fallback to fixed Google Form sequence if not found by name:
  // Col 0: Timestamp, Col 1: Name, Col 2: Class, Col 3: Group, Col 4: Code, Col 5-10: R,I,A,S,E,C, Col 11: Career
  if (nameCol === -1 && header.length >= 2) nameCol = 1
  if (clsCol === -1 && header.length >= 3) clsCol = 2
  if (codeCol === -1 && header.length >= 5) codeCol = 4
  if (careerCol === -1 && header.length >= 12) careerCol = 11

  PERSONALITY_CODES.forEach((k, j) => {
    if (riasecColMap[k] === -1 && header.length >= 6 + j) {
      riasecColMap[k] = 5 + j
    }
  })

  const students: Student[] = []

  for (let i = 1; i < matrix.length; i++) {
    const row = matrix[i]!
    if (row.length < 3 || row.every((c) => !c)) continue

    const name = (row[nameCol] || '').trim() || `Học sinh ${i}`
    const className = (row[clsCol] || '').trim() || '10A1'
    const careerText = careerCol >= 0 ? (row[careerCol] || '').trim() : ''

    const rawScores = {} as ScoreMap
    let totalScore = 0

    for (const c of PERSONALITY_CODES) {
      const colIdx = riasecColMap[c]
      const val = colIdx >= 0 ? parseInt(row[colIdx] ?? '', 10) || 0 : 0
      rawScores[c] = val
      totalScore += val
    }

    // Skip empty dummy rows
    if (totalScore === 0) continue

    const normalizedScores = normalizeScores(rawScores)
    const ranked = rankCodes(normalizedScores)
    const codeVal = codeCol >= 0 ? row[codeCol] : undefined
    const topType = (codeVal ? codeVal.trim().replace(/[^A-Za-z]/g, '') : '') || formatTopType(ranked).replace(/-/g, '')
    const clusterId = mapCareerToCluster(careerText)

    students.push({
      id: `gs_${i}`,
      name,
      nickname: name,
      className,
      personality: normalizedScores,
      rawScores,
      topType,
      careers: [clusterId],
      primaryCareerName: careerText || CAREER_CLUSTERS.find((c) => c.id === clusterId)?.name,
      demo: false,
      submittedAt: row[0] ?? new Date().toISOString(),
    })
  }

  return students
}

/**
 * Fetch and parse data from Google Sheet CSV endpoint
 */
export async function fetchGoogleSheetStudents(sheetUrl?: string): Promise<{ students: Student[]; error?: string }> {
  const config = getGoogleConfig()
  const targetUrl = (sheetUrl ?? config.sheetCsvUrl).trim()

  if (!targetUrl) {
    return { students: [], error: 'Chưa nhập link Google Sheet' }
  }

  const endpoint = convertToCsvUrl(targetUrl)

  try {
    const res = await fetch(endpoint)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Không thể tải dữ liệu từ Google Sheet. Vui lòng kiểm tra quyền truy cập công khai của trang tính.`)
    }
    const text = await res.text()
    const students = parseGoogleSheetCsv(text)
    if (students.length === 0) {
      return {
        students: [],
        error: 'Không tìm thấy dòng dữ liệu điểm hợp lệ trong Google Sheet. Hãy đảm bảo form đã có ít nhất 1 câu trả lời.',
      }
    }
    return { students }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return {
      students: [],
      error: msg.includes('Failed to fetch')
        ? 'Lỗi kết nối tới Google Sheet (CORS hoặc sai đường dẫn). Hãy đảm bảo trang tính đã được "Xuất bản lên web" dưới dạng CSV hoặc chọn quyền "Bất kỳ ai có đường liên kết đều có thể xem".'
        : msg,
    }
  }
}
