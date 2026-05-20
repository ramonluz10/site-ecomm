import fs from 'fs'
import path from 'path'

const auditDirectory = path.resolve(process.cwd(), 'logs')
const auditFile = path.join(auditDirectory, 'audit.log')

export function auditLog(entry: string) {
  fs.mkdirSync(auditDirectory, { recursive: true })
  const line = `${new Date().toISOString()} ${entry}\n`
  fs.appendFileSync(auditFile, line, 'utf-8')
}
