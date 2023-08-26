const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamControllers');


router
.post('/createTeam', teamController.createMateTeam)
.get('/getAllTeams', teamController.getAllTeams)
.post('/joinTeam', teamController.joinTeam)
.delete('/quitTeam/:teamId', teamController.quitTeam)
.delete('/deleteTeam/:teamId', teamController.deleteTeam)
.get('/getJoinedTeams', teamController.getJoinedTeams)
.get('/getTeamInfo/:teamId', teamController.getTeamInfo)
.post('/postTeamNotice/:teamId', teamController.postTeamNotice)
.get('/getTeamNotice/:teamId', teamController.getTeamNotice)
.post('/postTeamBoard/:teamId', teamController.postTeamBoard)
.get('/getTeamBoard/:teamId', teamController.getTeamBoard)
.post('/postTeamBoardComment/:teamId', teamController.postBoardComment)
.get('/getTeamMembers/:teamId', teamController.getTeamMembers)

module.exports= router;