import prisma from '../config/db.js'

// GET /api/transaksi
export async function index(req, res) {
  const { jenis, kategori } = req.query

  const where = {
    userId: req.user.id,           // hanya transaksi milik user yang login
    ...(jenis    && { jenis }),
    ...(kategori && { kategori }),
  }

  const transaksi = await prisma.transaksi.findMany({
    where,
    orderBy: { tanggal: 'desc' },
  })

  res.json({ data: transaksi })
}

// POST /api/transaksi
export async function store(req, res) {
  const { deskripsi, jumlah, jenis, kategori, tanggal } = req.body

  const errors = {}
  if (!deskripsi) errors.deskripsi = ['Deskripsi wajib diisi']
  if (!jumlah)    errors.jumlah    = ['Jumlah wajib diisi']
  if (!['pemasukan', 'pengeluaran'].includes(jenis)) errors.jenis = ['Jenis tidak valid']
  if (Object.keys(errors).length) return res.status(422).json({ errors })

  const transaksi = await prisma.transaksi.create({
    data: {
      deskripsi,
      jumlah: Number(jumlah),
      jenis,
      kategori,
      tanggal: new Date(tanggal),
      userId: req.user.id,
    },
  })

  res.status(201).json({ data: transaksi })
}

// DELETE /api/transaksi/:id
export async function destroy(req, res) {
  const { id } = req.params

  const transaksi = await prisma.transaksi.findUnique({ where: { id: Number(id) } })

  // Pastikan transaksi ada DAN milik user yang sedang login
  if (!transaksi || transaksi.userId !== req.user.id) {
    return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
  }

  await prisma.transaksi.delete({ where: { id: Number(id) } })
  res.status(204).send()
}
