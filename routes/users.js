const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');


router.post('/sendVerificationCode', userController.sendVerificationCode)
.post('/verifyCode', userController.verifyCode)
.post('/register', userController.register)
.post('/login', userController.login)
.get('/getUserBasicInfo',userController.getUserBasicInfo)
.get('/getUserFullInfo', userController.getUserFullInfo)
.get('/getRecommendUsers', userController.getRecommendUsers)
.post('/followUser', userController.followUser)
.post('/goalSetting', userController.goalSetting)
.post('/getFollowers', userController.getFollowers)
.post('/getFollowing', userController.getFollowing)
.put('/updateProfile', userController.updateProfile)
.put('/updateAge', userController.updateAge)
.put('/updateWeight', userController.updateWeight)
.put('/updateHeight', userController.updateHeight)
.put('/updateArea', userController.updateArea)
.put('/updateExercise', userController.updateExercise)
.put('/updateWishList', userController.updateWishList)
.post('/isPasswordCorrect', userController.isPasswordCorrect)
.put('/updatePassword', userController.updatePassword)
module.exports = router;
