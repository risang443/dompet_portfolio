import Card from '../components/ui/Card'
import { Target } from 'lucide-react'

export default function AnggaranPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Anggaran</h1>
        <p className="text-zinc-500 text-sm mt-1">Atur batas pengeluaranmu per kategori</p>
      </div>
      <Card className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-brand-500/15 rounded-2xl flex items-center justify-center mb-4">
          <Target size={24} className="text-brand-400" />
        </div>
        <h2 className="font-semibold text-lg mb-2">Coming Soon</h2>
        <p className="text-zinc-500 text-sm max-w-xs">Fitur anggaran akan kamu bangun di Phase 3. Fokus dulu di Dashboard & Transaksi!</p>
      </Card>
    </div>
  )
}
