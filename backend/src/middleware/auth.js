import { verifyToken } from '../utils/jwt.js'
import prisma from '../config/db.js'

// Mirip middleware 'auth:sanctum' di Laravel
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) return res.status(401).json({ message: 'User tidak ditemukan' })

    req.user = user   // bisa diakses di controller manapun setelah ini
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' })
  }
}
