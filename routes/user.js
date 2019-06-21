const express = require('express')
const router = express.Router()

const ControllerUser = require('../controllers/controller-user')
const { authentication } = require('../middlewares/author-authen')
const Multer = require('multer');
const gcsMiddlewares = require('../middlewares/google-cloud-storage')
const googleObject = require('../middlewares/google-object')
const googleFace = require('../middlewares/google-face')

const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
    },
});

router.post('/login', ControllerUser.login)
router.post('/register', multer.single('image'), gcsMiddlewares.sendUploadToGCS, googleObject, googleFace, ControllerUser.register)
router.get('/myprofile', authentication, ControllerUser.profileData)

module.exports = router