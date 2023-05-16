const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');


router.post('/sendVerificationCode', userController.sendVerificationCode)
router.post('/verifyCode', userController.verifyCode)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getUser',userController.getUser)

module.exports = router;
