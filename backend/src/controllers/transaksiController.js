import prisma from '../config/db.js'

export async function index(req, res) {
  const { jenis, kategori } = req.query
  const where = {
    userId: req.user.id,
    ...(jenis    && { jenis }),
    ...(kategori && { kategori }),
  }
  const transaksi = await prisma.transaksi.findMany({ where, orderBy: { tanggal: 'desc' } })
  res.json({ data: transaksi })
}

export async function store(req, res) {
  const { deskripsi, jumlah, jenis, kategori, tanggal } = req.body
  const errors = {}
  if (!deskripsi) errors.deskripsi = ['Deskripsi wajib diisi']
  if (!jumlah)    errors.jumlah    = ['Jumlah wajib diisi']
  if (!['pemasukan', 'pengeluaran'].includes(jenis)) errors.jenis = ['Jenis tidak valid']
  if (Object.keys(errors).length) return res.status(422).json({ errors })

  const transaksi = await prisma.transaksi.create({
    data: { deskripsi, jumlah: Number(jumlah), jenis, kategori, tanggal: new Date(tanggal), userId: req.user.id },
  })
  res.status(201).json({ data: transaksi })
}

// Baru: update transaksi
export async function update(req, res) {
  const { id } = req.params
  const { deskripsi, jumlah, jenis, kategori, tanggal } = req.body

  const transaksi = await prisma.transaksi.findUnique({ where: { id: Number(id) } })
  if (!transaksi || transaksi.userId !== req.user.id) {
    return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
  }

  const updated = await prisma.transaksi.update({
    where: { id: Number(id) },
    data: { deskripsi, jumlah: Number(jumlah), jenis, kategori, tanggal: new Date(tanggal) },
  })
  res.json({ data: updated })
}

export async function destroy(req, res) {
  const { id } = req.params
  const transaksi = await prisma.transaksi.findUnique({ where: { id: Number(id) } })
  if (!transaksi || transaksi.userId !== req.user.id) {
    return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
  }
  await prisma.transaksi.delete({ where: { id: Number(id) } })
  res.status(204).send()
}