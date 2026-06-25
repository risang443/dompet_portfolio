import { create } from 'zustand'

export const useTransaksiStore = create((set) => ({
  transaksi: [],
  loading: false,
  error: null,
  setTransaksi:    (data) => set({ transaksi: data }),
  setLoading:      (v)    => set({ loading: v }),
  setError:        (v)    => set({ error: v }),
  addTransaksi:    (item) => set((s) => ({ transaksi: [item, ...s.transaksi] })),
  deleteTransaksi: (id)   => set((s) => ({ transaksi: s.transaksi.filter((t) => t.id !== id) })),
}))
