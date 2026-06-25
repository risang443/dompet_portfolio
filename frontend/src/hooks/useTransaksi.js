import { useEffect } from 'react'
import { useTransaksiStore } from '../store/transaksiStore'
import { getTransaksi } from '../services/transaksiService'

export function useTransaksi(params) {
  const { setTransaksi, setLoading, setError } = useTransaksiStore()
  useEffect(() => {
    setLoading(true)
    getTransaksi(params)
      .then((res) => setTransaksi(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])
}
