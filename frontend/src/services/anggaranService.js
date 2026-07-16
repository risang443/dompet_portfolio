import api from './api'

export const getAnggaran    = ()        => api.get('/anggaran')
export const createAnggaran = (data)    => api.post('/anggaran', data)
export const deleteAnggaran = (id)      => api.delete(`/anggaran/${id}`)