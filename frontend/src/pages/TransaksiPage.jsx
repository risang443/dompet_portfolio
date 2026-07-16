import { useEffect, useState } from 'react'
import { Plus, Trash2, TrendingUp, TrendingDown, X, Pencil } from 'lucide-react'
import Card   from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge  from '../components/ui/Badge'
import Input  from '../components/ui/Input'
import { useTransaksiStore } from '../store/transaksiStore'
import { getTransaksi, createTransaksi, updateTransaksi, deleteTransaksi } from '../services/transaksiService'
import { formatRupiah, formatTanggal } from '../utils/format'

const KATEGORI = ['Semua', 'Gaji', 'Freelance', 'Investasi', 'Makanan', 'Tagihan', 'Transport', 'Hiburan', 'Kesehatan', 'Lainnya']
const FORM_AWAL = { deskripsi: '', jumlah: '', jenis: 'pengeluaran', kategori: 'Makanan', tanggal: new Date().toISOString().split('T')[0] }

export default function TransaksiPage() {
  const { transaksi, setTransaksi, addTransaksi, updateTransaksi: updateDiStore, deleteTransaksi: hapusDariStore, loading, setLoading, setError } = useTransaksiStore()

  // State filter
  const [filterJenis,    setFilterJenis]    = useState('semua')
  const [filterKategori, setFilterKategori] = useState('Semua')

  // State modal
  const [showModal,  setShowModal]  = useState(false)
  const [editTarget, setEditTarget] = useState(null)   // null = tambah, object = edit
  const [form,       setForm]       = useState(FORM_AWAL)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    getTransaksi()
      .then((res) => setTransaksi(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Filter transaksi di sisi frontend (tidak perlu request ulang ke API)
  const transaksiFiltered = transaksi.filter((t) => {
    const cocokJenis    = filterJenis    === 'semua'  || t.jenis    === filterJenis
    const cocokKategori = filterKategori === 'Semua'  || t.kategori === filterKategori
    return cocokJenis && cocokKategori
  })

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const bukaModalTambah = () => {
    setEditTarget(null)
    setForm(FORM_AWAL)
    setFormErrors({})
    setShowModal(true)
  }

  const bukaModalEdit = (t) => {
    setEditTarget(t)
    setForm({
      deskripsi: t.deskripsi,
      jumlah:    t.jumlah,
      jenis:     t.jenis,
      kategori:  t.kategori,
      tanggal:   t.tanggal.split('T')[0],
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})
    setSubmitting(true)
    try {
      const payload = { ...form, jumlah: Number(form.jumlah) }

      if (editTarget) {
        // Mode edit
        const res = await updateTransaksi(editTarget.id, payload)
        updateDiStore(editTarget.id, res.data.data)
      } else {
        // Mode tambah
        const res = await createTransaksi(payload)
        addTransaksi(res.data.data)
      }

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
      hapusDariStore(id)
    } catch {
      alert('Gagal menghapus transaksi')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <p className="text-zinc-500 text-sm mt-1">Riwayat pemasukan & pengeluaranmu</p>
        </div>
        <Button onClick={bukaModalTambah}>
          <Plus size={16} /> Tambah
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {/* Filter jenis */}
        <div className="flex gap-1.5">
          {['semua', 'pemasukan', 'pengeluaran'].map((j) => (
            <button key={j} onClick={() => setFilterJenis(j)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filterJenis === j
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'glass text-zinc-500 hover:text-zinc-300'
              }`}>
              {j === 'semua' ? 'Semua Jenis' : j}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px bg-white/10" />

        {/* Filter kategori */}
        <div className="flex gap-1.5 flex-wrap">
          {KATEGORI.map((k) => (
            <button key={k} onClick={() => setFilterKategori(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterKategori === k
                  ? 'bg-zinc-700 text-zinc-100 border border-zinc-500'
                  : 'glass text-zinc-500 hover:text-zinc-300'
              }`}>
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <Card>
        {loading && (
          <div className="flex items-center justify-center py-16 text-zinc-500 text-sm">
            Memuat transaksi...
          </div>
        )}

        {!loading && transaksiFiltered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-zinc-500 text-sm">Tidak ada transaksi ditemukan.</p>
            <p className="text-zinc-600 text-xs mt-1">Coba ganti filter atau tambah transaksi baru.</p>
          </div>
        )}

        {!loading && transaksiFiltered.length > 0 && (
          <div className="flex flex-col divide-y divide-white/5">
            {transaksiFiltered.map((t) => (
              <div key={t.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  t.jenis === 'pemasukan' ? 'bg-brand-500/15' : 'bg-red-500/15'
                }`}>
                  {t.jenis === 'pemasukan'
                    ? <TrendingUp size={16} className="text-brand-400" />
                    : <TrendingDown size={16} className="text-red-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.deskripsi}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatTanggal(t.tanggal)}</p>
                </div>

                <Badge color={t.jenis === 'pemasukan' ? 'blue' : 'yellow'}>{t.kategori}</Badge>

                <p className={`money text-sm font-semibold w-32 text-right flex-shrink-0 ${
                  t.jenis === 'pemasukan' ? 'text-brand-400' : 'text-red-400'
                }`}>
                  {t.jenis === 'pemasukan' ? '+' : '-'}{formatRupiah(t.jumlah)}
                </p>

                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => bukaModalEdit(t)}
                    className="text-zinc-600 hover:text-brand-400 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleHapus(t.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md glass rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">{editTarget ? 'Edit Transaksi' : 'Tambah Transaksi'}</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            {formErrors.global && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {formErrors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                value={form.deskripsi} onChange={handleChange} error={formErrors.deskripsi?.[0]} required />

              <Input label="Jumlah (Rp)" name="jumlah" type="number" min="1" placeholder="Contoh: 50000"
                value={form.jumlah} onChange={handleChange} error={formErrors.jumlah?.[0]} required />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-400">Kategori</label>
                <select name="kategori" value={form.kategori} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl glass text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all bg-transparent">
                  {KATEGORI.filter((k) => k !== 'Semua').map((k) => (
                    <option key={k} value={k} className="bg-zinc-900">{k}</option>
                  ))}
                </select>
              </div>

              <Input label="Tanggal" name="tanggal" type="date"
                value={form.tanggal} onChange={handleChange} error={formErrors.tanggal?.[0]} required />

              <div className="flex gap-3 mt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Batal
                </Button>
                <Button type="submit" loading={submitting} className="flex-1">
                  {editTarget ? 'Simpan Perubahan' : 'Simpan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}