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

  interface SharedStore {
    students: any[]
    deletedKeys: string[]
    googleConfig: any | null
    updatedAt: number
  }

  const readStore = (): SharedStore => {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
      if (!fs.existsSync(dataFilePath)) {
        const initial: SharedStore = {
          students: [],
          deletedKeys: [],
          googleConfig: null,
          updatedAt: Date.now(),
        }
        fs.writeFileSync(dataFilePath, JSON.stringify(initial, null, 2), 'utf-8')
        return initial
      }
      const raw = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return {
          students: parsed,
          deletedKeys: [],
          googleConfig: null,
          updatedAt: Date.now(),
        }
      }
      return {
        students: Array.isArray(parsed.students) ? parsed.students : [],
        deletedKeys: Array.isArray(parsed.deletedKeys) ? parsed.deletedKeys : [],
        googleConfig: parsed.googleConfig || null,
        updatedAt: parsed.updatedAt || Date.now(),
      }
    } catch {
      return { students: [], deletedKeys: [], googleConfig: null, updatedAt: Date.now() }
    }
  }

  const writeStore = (store: SharedStore) => {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
      fs.writeFileSync(dataFilePath, JSON.stringify(store, null, 2), 'utf-8')
    } catch (e) {
      console.error('Failed to write shared store file:', e)
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
          const store = readStore()
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              success: true,
              students: store.students,
              deletedKeys: store.deletedKeys,
              googleConfig: store.googleConfig,
              updatedAt: store.updatedAt,
            }),
          )
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
              const store = readStore()

              // 1. Restore all deleted students request
              if (data.restoreAll === true) {
                store.deletedKeys = []
                store.updatedAt = Date.now()
                writeStore(store)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, restored: true, deletedKeys: [] }))
                return
              }

              // 2. Sync deletedKeys
              if (Array.isArray(data.deletedKeys)) {
                store.deletedKeys = Array.from(new Set([...store.deletedKeys, ...data.deletedKeys]))
              }

              // 3. Sync googleConfig
              if (data.googleConfig) {
                store.googleConfig = { ...(store.googleConfig || {}), ...data.googleConfig }
              }

              // 4. Batch save students
              if (Array.isArray(data.students)) {
                store.students = data.students
                store.updatedAt = Date.now()
                writeStore(store)
                res.setHeader('Content-Type', 'application/json')
                res.end(
                  JSON.stringify({
                    success: true,
                    count: store.students.length,
                    deletedKeys: store.deletedKeys,
                    googleConfig: store.googleConfig,
                  }),
                )
                return
              }

              // 5. Single student submission from quiz
              if (data && (data.name || data.id)) {
                const idx = store.students.findIndex(
                  (s: any) =>
                    (data.id && s.id === data.id) ||
                    (s.name === data.name && s.className === data.className && s.submittedAt === data.submittedAt),
                )
                if (idx >= 0) {
                  store.students[idx] = data
                } else {
                  store.students = [data, ...store.students]
                }
                store.updatedAt = Date.now()
                writeStore(store)
                res.setHeader('Content-Type', 'application/json')
                res.end(
                  JSON.stringify({
                    success: true,
                    student: data,
                    total: store.students.length,
                    deletedKeys: store.deletedKeys,
                  }),
                )
                return
              }

              store.updatedAt = Date.now()
              writeStore(store)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, store }))
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
              const { id, name, signatures } = JSON.parse(body)
              const store = readStore()

              // Append signatures to shared deletedKeys
              const sigsToAdd = Array.isArray(signatures)
                ? signatures
                : [id, name].filter(Boolean)
              store.deletedKeys = Array.from(new Set([...store.deletedKeys, ...sigsToAdd]))

              // Remove matching students
              store.students = store.students.filter((s: any) => {
                if (id && s.id === id) return false
                if (name && s.name === name) return false
                return true
              })

              store.updatedAt = Date.now()
              writeStore(store)
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: true,
                  remaining: store.students.length,
                  deletedKeys: store.deletedKeys,
                }),
              )
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
  server: {
    host: true,
    port: 5173,
  },
  plugins: [react(), tailwindcss(), sharedClassApiPlugin()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})

