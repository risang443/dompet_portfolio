import { Router } from 'express'
import { index, store, destroy } from '../controllers/anggaranController.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()
router.use(authenticate)

router.get('/',       index)
router.post('/',      store)
router.delete('/:id', destroy)

export default router