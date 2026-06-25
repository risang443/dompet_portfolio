import bcrypt from 'bcryptjs'
import prisma from '../config/db.js'
import { signToken } from '../utils/jwt.js'

// Jangan pernah kirim password (walau ter-hash) ke frontend
function sanitizeUser(user) {
  const { password, ...rest } = user
  return rest
}

export async function register(req, res) {
  const { name, email, password } = req.body

  const errors = {}
  if (!name)  errors.name  = ['Nama wajib diisi']
  if (!email) errors.email = ['Email wajib diisi']
  if (!password || password.length < 8) errors.password = ['Password minimal 8 karakter']
  if (Object.keys(errors).length) return res.status(422).json({ errors })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(422).json({ errors: { email: ['Email sudah terdaftar'] } })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, password: hashed } })

  const token = signToken({ id: user.id })
  res.status(201).json({ token, user: sanitizeUser(user) })
}

export async function login(req, res) {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Email atau password salah' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ message: 'Email atau password salah' })

  const token = signToken({ id: user.id })
  res.json({ token, user: sanitizeUser(user) })
}

export async function me(req, res) {
  res.json(sanitizeUser(req.user))
}
