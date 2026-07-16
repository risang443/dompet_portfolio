import express from 'express'
import cors from 'cors'
import authRoutes     from './routes/authRoutes.js'
import transaksiRoutes from './routes/transaksiRoutes.js'
import anggaranRoutes  from './routes/anggaranRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/transaksi', transaksiRoutes)
app.use('/api/anggaran',  anggaranRoutes)   // ← baru

app.use(errorHandler)

export default app