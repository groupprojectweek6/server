const express = require('express')
const router = express.Router()

const ControllerUser = require('../controllers/controller-user')
const { authentication } = require('../middlewares/author-authen')

router.post('/login', ControllerUser.login)
router.post('/register', ControllerUser.register)
router.get('/myprofile', authentication, ControllerUser.profileData)

module.exports = router