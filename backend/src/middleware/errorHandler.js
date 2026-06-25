// Tangkap error yang tidak ter-handle supaya server tidak crash
export function errorHandler(err, req, res, next) {
  console.error(err)
  res.status(500).json({ message: 'Terjadi kesalahan di server' })
}
