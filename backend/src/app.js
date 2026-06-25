import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import transaksiRoutes from './routes/transaksiRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())            // izinkan request dari frontend (beda port)
app.use(express.json())    // parse JSON body, mirip $request->json() di Laravel

app.use('/api/auth', authRoutes)
app.use('/api/transaksi', transaksiRoutes)

app.use(errorHandler)

export default app
