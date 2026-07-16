import prisma from '../config/db.js'

// GET /api/anggaran — ambil semua anggaran + hitung pemakaian bulan ini
export async function index(req, res) {
  const sekarang    = new Date()
  const awalBulan   = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1)
  const akhirBulan  = new Date(sekarang.getFullYear(), sekarang.getMonth() + 1, 0)

  const anggaran = await prisma.anggaran.findMany({
    where: { userId: req.user.id },
  })

  // Hitung total pengeluaran bulan ini per kategori
  const pengeluaran = await prisma.transaksi.groupBy({
    by: ['kategori'],
    where: {
      userId: req.user.id,
      jenis:  'pengeluaran',
      tanggal: { gte: awalBulan, lte: akhirBulan },
    },
    _sum: { jumlah: true },
  })

  // Gabungkan: tiap anggaran + berapa sudah dipakai
  const data = anggaran.map((a) => {
    const pemakaian = pengeluaran.find((p) => p.kategori === a.kategori)
    return {
      ...a,
      terpakai: pemakaian?._sum.jumlah ?? 0,
    }
  })

  res.json({ data })
}

// POST /api/anggaran
export async function store(req, res) {
  const { kategori, batas } = req.body
  if (!kategori || !batas) {
    return res.status(422).json({ errors: { kategori: ['Kategori dan batas wajib diisi'] } })
  }

  // upsert = update kalau sudah ada, insert kalau belum
  const anggaran = await prisma.anggaran.upsert({
    where:  { userId_kategori: { userId: req.user.id, kategori } },
    update: { batas: Number(batas) },
    create: { userId: req.user.id, kategori, batas: Number(batas) },
  })

  res.status(201).json({ data: anggaran })
}

// DELETE /api/anggaran/:id
export async function destroy(req, res) {
  const { id } = req.params
  const anggaran = await prisma.anggaran.findUnique({ where: { id: Number(id) } })
  if (!anggaran || anggaran.userId !== req.user.id) {
    return res.status(404).json({ message: 'Anggaran tidak ditemukan' })
  }
  await prisma.anggaran.delete({ where: { id: Number(id) } })
  res.status(204).send()
}