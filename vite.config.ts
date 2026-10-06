import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Real-time central storage plugin for multi-device synchronization.
 * Stores submissions in `data/shared_students.json` on the server so that
 * any phone, tablet, or PC connecting to the server shares the same class data.
 */
function sharedClassApiPlugin(): Plugin {
  const dataDir = fileURLToPath(new URL('./data', import.meta.url))
  const dataFilePath = path.join(dataDir, 'shared_students.json')

  const readStudents = (): any[] => {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
      if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, '[]', 'utf-8')
        return []
      }
      const raw = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const writeStudents = (students: any[]) => {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
      fs.writeFileSync(dataFilePath, JSON.stringify(students, null, 2), 'utf-8')
    } catch (e) {
      console.error('Failed to write shared students file:', e)
    }
  }

  return {
    name: 'shared-class-api',
    configureServer(server) {
      server.middlewares.use('/api/students', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method === 'GET') {
          const list = readStudents()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, students: list }))
          return
        }

        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              let current = readStudents()

              // Batch save
              if (Array.isArray(data.students)) {
                writeStudents(data.students)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, count: data.students.length }))
                return
              }

              // Single student
              if (data && (data.name || data.id)) {
                const idx = current.findIndex(
                  (s: any) =>
                    (data.id && s.id === data.id) ||
                    (s.name === data.name && s.className === data.className && s.submittedAt === data.submittedAt),
                )
                if (idx >= 0) {
                  current[idx] = data
                } else {
                  current = [data, ...current]
                }
                writeStudents(current)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, student: data, total: current.length }))
                return
              }

              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Dữ liệu không hợp lệ' }))
            } catch (err) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: String(err) }))
            }
          })
          return
        }

        if (req.method === 'DELETE') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { id, name } = JSON.parse(body)
              let current = readStudents()
              current = current.filter((s: any) => (id ? s.id !== id : s.name !== name))
              writeStudents(current)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, remaining: current.length }))
            } catch {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Lỗi khi xóa' }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), sharedClassApiPlugin()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})

