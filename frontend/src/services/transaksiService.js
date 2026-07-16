import api from './api'

export const getTransaksi    = (params) => api.get('/transaksi', { params })
export const createTransaksi = (data)   => api.post('/transaksi', data)
export const updateTransaksi = (id, data) => api.put(`/transaksi/${id}`, data)
export const deleteTransaksi = (id)     => api.delete(`/transaksi/${id}`)