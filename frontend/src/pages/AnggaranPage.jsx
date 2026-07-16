import { useEffect, useState } from 'react'
import { Plus, Trash2, X, Target } from 'lucide-react'
import Card   from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getAnggaran, createAnggaran, deleteAnggaran } from '../services/anggaranService'
import { formatRupiah } from '../utils/format'

const KATEGORI = ['Makanan', 'Tagihan', 'Transport', 'Hiburan', 'Kesehatan', 'Lainnya']

export default function AnggaranPage() {
  const [anggaran, setAnggaran] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState({ kategori: 'Makanan', batas: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError]   = useState('')

  useEffect(() => {
    muat()
  }, [])

  const muat = () => {
    setLoading(true)
    getAnggaran()
      .then((res) => setAnggaran(res.data.data))
      .finally(() => setLoading(false))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      await createAnggaran({ ...form, batas: Number(form.batas) })
      setShowModal(false)
      setForm({ kategori: 'Makanan', batas: '' })
      muat()   // reload supaya data pemakaian ikut terupdate
    } catch (err) {
      setFormError(err.response?.data?.errors?.kategori?.[0] ?? 'Gagal menyimpan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleHapus = async (id) => {
    if (!confirm('Hapus anggaran ini?')) return
    await deleteAnggaran(id)
    setAnggaran((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Anggaran</h1>
          <p className="text-zinc-500 text-sm mt-1">Batas pengeluaran per kategori bulan ini</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Tambah Anggaran
        </Button>
      </div>

      {loading && (
        <div className="text-center py-20 text-zinc-500 text-sm">Memuat anggaran...</div>
      )}

      {!loading && anggaran.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-brand-500/15 rounded-2xl flex items-center justify-center mb-4">
            <Target size={24} className="text-brand-400" />
          </div>
          <h2 className="font-semibold text-lg mb-2">Belum ada anggaran</h2>
          <p className="text-zinc-500 text-sm max-w-xs">
            Tambahkan batas pengeluaran per kategori untuk mulai memantau keuanganmu.
          </p>
        </Card>
      )}

      {!loading && anggaran.length > 0 && (
        <div className="flex flex-col gap-3">
          {anggaran.map((a) => {
            const persen    = Math.min((a.terpakai / a.batas) * 100, 100)
            const sisaRp    = a.batas - a.terpakai
            const overBudget = a.terpakai > a.batas

            return (
              <Card key={a.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{a.kategori}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {overBudget
                        ? <span className="text-red-400">Melebihi batas sebesar {formatRupiah(a.terpakai - a.batas)}</span>
                        : <span>Sisa {formatRupiah(sisaRp)}</span>
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="money text-sm font-semibold">{formatRupiah(a.terpakai)}</p>
                      <p className="text-xs text-zinc-500">dari {formatRupiah(a.batas)}</p>
                    </div>
                    <button onClick={() => handleHapus(a.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      persen >= 100 ? 'bg-red-500' : persen >= 75 ? 'bg-yellow-500' : 'bg-brand-500'
                    }`}
                    style={{ width: `${persen}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-1.5 text-right">{persen.toFixed(0)}% terpakai</p>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-sm glass rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Tambah Anggaran</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-200">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-400">Kategori</label>
                <select name="kategori" value={form.kategori}
                  onChange={(e) => setForm((p) => ({ ...p, kategori: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl glass text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 bg-transparent">
                  {KATEGORI.map((k) => (
                    <option key={k} value={k} className="bg-zinc-900">{k}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-400">Batas Pengeluaran (Rp)</label>
                <input type="number" min="1" placeholder="Contoh: 500000"
                  value={form.batas}
                  onChange={(e) => setForm((p) => ({ ...p, batas: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl glass text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  required />
              </div>

              <div className="flex gap-3 mt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
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