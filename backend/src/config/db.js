import { PrismaClient } from '@prisma/client'

// Satu koneksi Prisma dipakai di seluruh app (singleton)
const prisma = new PrismaClient()

export default prisma
