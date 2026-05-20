import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import dotenv from 'dotenv'
import authRouter from './routes/auth'
import publicRouter from './routes/public'
import adminRouter from './routes/admin'
import { loginRateLimiter } from './middleware/rate-limit'
import { auditLog } from './lib/logger'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)
const allowedOrigins = process.env.API_ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000', 'http://localhost:3001']

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => auditLog(message.trim()),
    },
  }),
)

app.use('/api/public', publicRouter)
app.use('/api/auth', loginRateLimiter, authRouter)
app.use('/api/admin', adminRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Backend API rodando em http://localhost:${port}`)
  })
}

export default app
