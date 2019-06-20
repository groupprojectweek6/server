const express = require('express')
const router = express.Router()

const routerUser = require('./user')
const routerVoting = require('./voting')

router.use('/', routerUser)
router.use('/voting', routerVoting)

module.exports = router