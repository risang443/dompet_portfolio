import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { login } from '../services/authService'
import Input  from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res = await login(form)
      setAuth(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setErrors({ global: err.response?.data?.message ?? 'Login gagal' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <span className="font-bold text-2xl">Dompet</span>
        </div>

        <div className="glass rounded-2xl p-7">
          <h1 className="text-xl font-bold mb-1">Masuk</h1>
          <p className="text-zinc-500 text-sm mb-6">Selamat datang kembali 👋</p>

          {errors.global && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Email" name="email" type="email" placeholder="kamu@email.com"
              value={form.email} onChange={handleChange} error={errors.email} required />
            <Input label="Password" name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} error={errors.password} required />
            <Button type="submit" loading={loading} className="mt-1 w-full">Masuk</Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-5">
            Belum punya akun?{' '}
            <Link to="/register" className="text-brand-400 hover:underline font-medium">Daftar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
