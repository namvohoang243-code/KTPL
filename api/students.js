// Central storage state for serverless deployments
let memoryState = {
  students: [],
  deletedKeys: [],
  googleConfig: null,
  updatedAt: Date.now(),
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      students: memoryState.students,
      deletedKeys: memoryState.deletedKeys,
      googleConfig: memoryState.googleConfig,
      updatedAt: memoryState.updatedAt,
    })
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

      // 1. Restore all deleted students
      if (data?.restoreAll === true) {
        memoryState.deletedKeys = []
        memoryState.updatedAt = Date.now()
        return res.status(200).json({ success: true, restored: true, deletedKeys: [] })
      }

      // 2. Sync deletedKeys
      if (Array.isArray(data?.deletedKeys)) {
        memoryState.deletedKeys = Array.from(new Set([...memoryState.deletedKeys, ...data.deletedKeys]))
      }

      // 3. Sync googleConfig
      if (data?.googleConfig) {
        memoryState.googleConfig = { ...(memoryState.googleConfig || {}), ...data.googleConfig }
      }

      // 4. Batch save students
      if (Array.isArray(data?.students)) {
        memoryState.students = data.students
        memoryState.updatedAt = Date.now()
        return res.status(200).json({
          success: true,
          count: memoryState.students.length,
          deletedKeys: memoryState.deletedKeys,
          googleConfig: memoryState.googleConfig,
        })
      }

      // 5. Single student
      if (data && (data.name || data.id)) {
        const idx = memoryState.students.findIndex(
          (s) =>
            (data.id && s.id === data.id) ||
            (s.name === data.name && s.className === data.className && s.submittedAt === data.submittedAt),
        )
        if (idx >= 0) {
          memoryState.students[idx] = data
        } else {
          memoryState.students = [data, ...memoryState.students]
        }
        memoryState.updatedAt = Date.now()
        return res.status(200).json({
          success: true,
          student: data,
          total: memoryState.students.length,
          deletedKeys: memoryState.deletedKeys,
        })
      }

      memoryState.updatedAt = Date.now()
      return res.status(200).json({ success: true, memoryState })
    } catch (err) {
      return res.status(500).json({ error: String(err) })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const { id, name, signatures } = data || {}

      const sigsToAdd = Array.isArray(signatures)
        ? signatures
        : [id, name].filter(Boolean)
      memoryState.deletedKeys = Array.from(new Set([...memoryState.deletedKeys, ...sigsToAdd]))

      memoryState.students = memoryState.students.filter((s) => {
        if (id && s.id === id) return false
        if (name && s.name === name) return false
        return true
      })
      memoryState.updatedAt = Date.now()

      return res.status(200).json({
        success: true,
        remaining: memoryState.students.length,
        deletedKeys: memoryState.deletedKeys,
      })
    } catch (err) {
      return res.status(500).json({ error: String(err) })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
