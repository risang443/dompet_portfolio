import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import Card from '../components/ui/Card'
import { formatRupiah } from '../utils/format'
import { getTransaksi } from '../services/transaksiService'

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <Card className="flex items-start justify-between">
    <div>
      <p className="text-zinc-500 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-bold money ${color}`}>{formatRupiah(value)}</p>
    </div>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
      <Icon size={18} className={color} />
    </div>
  </Card>
)

// Hitung tren per bulan dari array transaksi mentah
function hitungTren(transaksi) {
  const map = {}

  transaksi.forEach((t) => {
    const bulan = new Date(t.tanggal).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
    if (!map[bulan]) map[bulan] = { bulan, pemasukan: 0, pengeluaran: 0 }
    if (t.jenis === 'pemasukan')   map[bulan].pemasukan   += t.jumlah
    if (t.jenis === 'pengeluaran') map[bulan].pengeluaran += t.jumlah
  })

  // Urutkan berdasarkan waktu, ambil 6 bulan terakhir
  return Object.values(map).slice(-6)
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ saldo: 0, pemasukan: 0, pengeluaran: 0 })
  const [chart, setChart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTransaksi()
      .then((res) => {
        const data = res.data.data

        // Hitung total dari semua transaksi user
        const pemasukan   = data.filter((t) => t.jenis === 'pemasukan').reduce((s, t) => s + t.jumlah, 0)
        const pengeluaran = data.filter((t) => t.jenis === 'pengeluaran').reduce((s, t) => s + t.jumlah, 0)

        setStats({ pemasukan, pengeluaran, saldo: pemasukan - pengeluaran })
        setChart(hitungTren(data))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex justify-center py-20 text-zinc-500 text-sm">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Ringkasan keuanganmu</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Saldo"  value={stats.saldo}       icon={Wallet}       color="text-blue-400"    bg="bg-blue-500/15" />
        <StatCard label="Pemasukan"    value={stats.pemasukan}   icon={TrendingUp}   color="text-brand-400"   bg="bg-brand-500/15" />
        <StatCard label="Pengeluaran"  value={stats.pengeluaran} icon={TrendingDown} color="text-red-400"     bg="bg-red-500/15" />
      </div>

      {/* Chart */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold">Tren Keuangan</h2>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar size={13} /> 6 Bulan Terakhir
          </span>
        </div>

        {chart.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-zinc-600 text-sm">
            Belum ada data. Tambah transaksi dulu di menu Transaksi.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chart} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gPemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="bulan" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v/1e6).toFixed(1)}jt`} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}
                labelStyle={{ color: '#a1a1aa' }}
                formatter={(val) => formatRupiah(val)} />
              <Area type="monotone" dataKey="pemasukan"   stroke="#22c55e" fill="url(#gPemasukan)"   strokeWidth={2} />
              <Area type="monotone" dataKey="pengeluaran" stroke="#ef4444" fill="url(#gPengeluaran)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  )
}
