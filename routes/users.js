const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');


router.post('/sendVerificationCode', userController.sendVerificationCode)
.post('/verifyCode', userController.verifyCode)
.post('/register', userController.register)
.post('/login', userController.login)
.get('/getUserFullInfo', userController.getUserFullInfo)
.get('/getRecommendUsers', userController.getRecommendUsers)
.post('/followUser', userController.followUser)
.post('/goalSetting', userController.goalSetting)
.post('/getFollowers', userController.getFollowers)
.post('/getFollowing', userController.getFollowing)
.put('/updateProfile', userController.updateProfile)
.put('/updateInformation', userController.updateInformation)
.post('/isPasswordCorrect', userController.isPasswordCorrect)
.put('/updatePassword', userController.updatePassword)
.post('/getUnfollow', userController.getUnfollow)
.delete('/deleteFollowers', userController.initialFollower)
module.exports = router;
