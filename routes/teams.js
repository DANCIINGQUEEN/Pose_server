import express from 'express'
import teamController from '../controllers/teamControllers.js'
const router = express.Router();

router
    .get('/getAllTeams', teamController.getAllTeams)
    .get('/getJoinedTeams', teamController.getJoinedTeams)
    .get('/getTeamInfo/:teamId', teamController.getTeamInfo)
    .get('/getTeamNotice/:teamId', teamController.getTeamNotice)
    .get('/getTeamBoard/:teamId', teamController.getTeamBoard)
    .get('/getTeamMembers/:teamId', teamController.getTeamMembers)
    .get('/getTeamMembersExerciseStatus/:teamId', teamController.getTeamMembersExerciseStatus)
    .get('/getJoinedTeamInfo', teamController.getJoinedTeamInfo)
    .post('/createTeam', teamController.createMateTeam)
    .post('/joinTeam', teamController.joinTeam)
    .post('/postTeamNotice/:teamId', teamController.postTeamNotice)
    .post('/postTeamBoard/:teamId', teamController.postTeamBoard)
    .post('/postTeamBoardComment/:teamId', teamController.postBoardComment)
    .delete('/quitTeam/:teamId', teamController.quitTeam)
    .delete('/deleteTeam/:teamId', teamController.deleteTeam)
    .delete('/deleteTeamNotice/:teamId/:noticeId', teamController.deleteTeamNotice)
    .delete('/deleteTeamBoard/:teamId/:boardId', teamController.deleteTeamBoard)
    .delete('/deleteTeamBoardComment/:teamId/:boardId/:commentId', teamController.deleteTeamBoardComment)
    .put('/updateTeamNotice/:teamId/:noticeId', teamController.updateTeamNotice)
    .put('/updateTeamBoard/:teamId/:boardId', teamController.updateTeamBoard)

export default router;