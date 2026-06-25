import { useEffect, useState } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, X } from 'lucide-react'
import Card   from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge  from '../components/ui/Badge'
import Input  from '../components/ui/Input'
import { useTransaksiStore } from '../store/transaksiStore'
import { getTransaksi, createTransaksi, deleteTransaksi } from '../services/transaksiService'
import { formatRupiah, formatTanggal } from '../utils/format'

// Daftar pilihan kategori
const KATEGORI = ['Gaji', 'Freelance', 'Investasi', 'Makanan', 'Tagihan', 'Transport', 'Hiburan', 'Kesehatan', 'Lainnya']

// Form kosong untuk reset
const FORM_AWAL = {
  deskripsi: '',
  jumlah: '',
  jenis: 'pengeluaran',
  kategori: 'Makanan',
  tanggal: new Date().toISOString().split('T')[0],  // hari ini
}

export default function TransaksiPage() {
  const { transaksi, setTransaksi, addTransaksi, deleteTransaksi: hapusDariStore, loading, setLoading, error, setError } = useTransaksiStore()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(FORM_AWAL)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Ambil transaksi dari API saat halaman dibuka
  useEffect(() => {
    setLoading(true)
    getTransaksi()
      .then((res) => setTransaksi(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleTambah = async (e) => {
    e.preventDefault()
    setFormErrors({})
    setSubmitting(true)
    try {
      const res = await createTransaksi({
        ...form,
        jumlah: Number(form.jumlah),
      })
      addTransaksi(res.data.data)   // langsung masuk ke store, tanpa reload
      setForm(FORM_AWAL)
      setShowModal(false)
    } catch (err) {
      setFormErrors(err.response?.data?.errors ?? { global: 'Gagal menyimpan transaksi' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleHapus = async (id) => {
    if (!confirm('Hapus transaksi ini?')) return
    try {
      await deleteTransaksi(id)
      hapusDariStore(id)   // langsung hilang dari tampilan
    } catch {
      alert('Gagal menghapus transaksi')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-zinc-500 text-sm mt-1">Riwayat pemasukan & pengeluaranmu</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Tambah
        </Button>
      </div>

      {/* List transaksi */}
      <Card>
        {loading && (
          <div className="flex items-center justify-center py-16 text-zinc-500 text-sm">
            Memuat transaksi...
          </div>
        )}

        {!loading && transaksi.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-zinc-500 text-sm">Belum ada transaksi.</p>
            <p className="text-zinc-600 text-xs mt-1">Klik "Tambah" untuk mulai mencatat.</p>
          </div>
        )}

        {!loading && transaksi.length > 0 && (
          <div className="flex flex-col divide-y divide-white/5">
            {transaksi.map((t) => (
              <div key={t.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                {/* Icon jenis */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  t.jenis === 'pemasukan' ? 'bg-brand-500/15' : 'bg-red-500/15'
                }`}>
                  {t.jenis === 'pemasukan'
                    ? <TrendingUp size={16} className="text-brand-400" />
                    : <TrendingDown size={16} className="text-red-400" />}
                </div>

                {/* Deskripsi + tanggal */}
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.deskripsi}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatTanggal(t.tanggal)}</p>
                </div>

                <Badge color={t.jenis === 'pemasukan' ? 'blue' : 'yellow'}>{t.kategori}</Badge>

                {/* Jumlah */}
                <p className={`money text-sm font-semibold w-32 text-right ${
                  t.jenis === 'pemasukan' ? 'text-brand-400' : 'text-red-400'
                }`}>
                  {t.jenis === 'pemasukan' ? '+' : '-'}{formatRupiah(t.jumlah)}
                </p>

                <button onClick={() => handleHapus(t.id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors ml-1 flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Tambah Transaksi */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)} />

          {/* Modal card */}
          <div className="relative w-full max-w-md glass rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Tambah Transaksi</h2>
              <button onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-zinc-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            {formErrors.global && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {formErrors.global}
              </div>
            )}

            <form onSubmit={handleTambah} className="flex flex-col gap-4">

              {/* Jenis: toggle button */}
              <div>
                <label className="text-sm font-medium text-zinc-400 block mb-1.5">Jenis</label>
                <div className="grid grid-cols-2 gap-2">
                  {['pengeluaran', 'pemasukan'].map((j) => (
                    <button key={j} type="button"
                      onClick={() => setForm((p) => ({ ...p, jenis: j }))}
                      className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                        form.jenis === j
                          ? j === 'pemasukan'
                            ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'glass text-zinc-500 hover:text-zinc-300'
                      }`}>
                      {j === 'pemasukan' ? '↑ Pemasukan' : '↓ Pengeluaran'}
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Deskripsi" name="deskripsi" placeholder="Contoh: Makan siang"
                value={form.deskripsi} onChange={handleChange}
                error={formErrors.deskripsi?.[0]} required />

              <Input label="Jumlah (Rp)" name="jumlah" type="number" min="1"
                placeholder="Contoh: 50000"
                value={form.jumlah} onChange={handleChange}
                error={formErrors.jumlah?.[0]} required />

              {/* Kategori: dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-400">Kategori</label>
                <select name="kategori" value={form.kategori} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl glass text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all bg-transparent">
                  {KATEGORI.map((k) => (
                    <option key={k} value={k} className="bg-zinc-900">{k}</option>
                  ))}
                </select>
              </div>

              <Input label="Tanggal" name="tanggal" type="date"
                value={form.tanggal} onChange={handleChange}
                error={formErrors.tanggal?.[0]} required />

              <div className="flex gap-3 mt-1">
                <Button type="button" variant="secondary" className="flex-1"
                  onClick={() => setShowModal(false)}>
                  Batal
                </Button>
                <Button type="submit" loading={submitting} className="flex-1">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
