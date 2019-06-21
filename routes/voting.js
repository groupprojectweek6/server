const express = require('express')
const router = express.Router()

const ControllerVoting = require('../controllers/controller-voting')
const { authentication, authorization } = require('../middlewares/author-authen')

router.get('/', ControllerVoting.readAll)
router.get('/newUsers', ControllerVoting.getNewUsers)
router.get('/top20', ControllerVoting.readAllTop20)
router.post('/:id', authentication, ControllerVoting.addVoting)
router.delete('/:id', authentication, authorization, ControllerVoting.deleteVoting)

module.exports = router