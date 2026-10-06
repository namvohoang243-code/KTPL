// In-memory cache for Vercel serverless deployments
let memoryStudents = []

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, students: memoryStudents })
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

      if (Array.isArray(data?.students)) {
        memoryStudents = data.students
        return res.status(200).json({ success: true, count: memoryStudents.length })
      }

      if (data && (data.name || data.id)) {
        const idx = memoryStudents.findIndex(
          (s) => (data.id && s.id === data.id) || (s.name === data.name && s.className === data.className),
        )
        if (idx >= 0) {
          memoryStudents[idx] = data
        } else {
          memoryStudents = [data, ...memoryStudents]
        }
        return res.status(200).json({ success: true, student: data, total: memoryStudents.length })
      }

      return res.status(400).json({ error: 'Invalid data' })
    } catch (err) {
      return res.status(500).json({ error: String(err) })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const { id, name } = data || {}
      memoryStudents = memoryStudents.filter((s) => (id ? s.id !== id : s.name !== name))
      return res.status(200).json({ success: true, remaining: memoryStudents.length })
    } catch (err) {
      return res.status(500).json({ error: String(err) })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
