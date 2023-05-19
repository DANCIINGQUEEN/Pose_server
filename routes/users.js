const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');


router.post('/sendVerificationCode', userController.sendVerificationCode)
router.post('/verifyCode', userController.verifyCode)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/getUserBasicInfo',userController.getUserBasicInfo)
router.get('/getUserFullInfo', userController.getUserFullInfo)

module.exports = router;
