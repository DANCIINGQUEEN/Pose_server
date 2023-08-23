const mongoose = require('mongoose')
const User = mongoose.model('user')
const Team = mongoose.model('team')
const jwt = require('jsonwebtoken')
// const {checkUserExists, getUserFromToken} = require('./userControllers')
const getUserFromToken = async (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
    const userId = decodedToken._id;
    const user = await User.findById(userId);
    return user;
};
const checkUserExists = (user, res) => {
    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }
};

const teamControl = {
    createMateTeam: async (req, res) => {
        try {
            const {teamName, hashtag, description} = req.body;
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const newTeam = new Team({
                name: teamName,
                description: description,
                hashtag: hashtag,
                host: {
                    hostId: user._id,
                    hostName: user.name,
                },
                members: [user._id]

            });
            await newTeam.save();
            res.status(200).json({mgs: 'success'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getAllTeams: async (req, res) => {
        try {
            const teams = await Team.find({});
            const teamInfo = teams.map(team => ({
                _id: team._id,
                name: team.name,
                hashtag: team.hashtag,
                description: team.description,
                likes: team.likes.length,
                members: team.members.length
            }));

            res.json(teamInfo)
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    joinTeam: async (req, res) => {
        const {teamId} = req.body;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const team = await Team.findById(teamId);
            user.team.push(teamId);
            await user.save();
            team.members.push(user._id)
            await team.save();
            res.status(200).json({mgs: 'success'})
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    quitTeam: async (req, res) => {
        const {teamId} = req.params;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            await User.findOneAndUpdate(
                {_id: user._id},
                {$pull: {team: teamId}},
                {new: true}
            );
            const team = await Team.findById(teamId);
            const indexOfUserId=team.members.indexOf(user._id);
            team.members.splice(indexOfUserId,1);
            await team.save();
            console.log()
            res.status(200).json({message: 'Success'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: error});
        }
    },
    deleteTeam: async (req, res) => {
        const {teamId} = req.params;
        try {
            await Team.deleteOne({_id: teamId});
            res.status(200).json({msg:'success'})
        }catch(error){
            console.error(error);
            res.status(500).json({error: error});
        }

    },
    getJoinedTeams: async (req, res) => {
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const myTeams = user.team.map(team => team.toString())
            const myTeamsSimple = await Team.find({_id: {$in: myTeams}});
            const myTeam = myTeamsSimple.map(team => ({
                _id: team._id,
                name: team.name,
                hashtag: team.hashtag,
                description: team.description,
                likes: team.likes.length,
                members: team.members.length
            }));
            res.status(200).json(myTeam);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getTeamInfo: async (req, res) => {
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const {teamId} = req.params;
            // const team=await Team.find({_id:teamId});
            const team = await Team.findById(teamId)
                .populate({
                    path:'name'
                })
                .populate({
                    path: 'description',
                })
                .populate({
                    path: 'host',
                })
                .populate({
                    path: 'notice',
                    options: {sort: {_id: -1}, limit: 3} // 최근 3개의 공지 추출
                })
                .populate({
                    path: 'freeBoard',
                    options: {sort: {_id: -1}, limit: 1} // 최근 1개의 자유게시물 추출
                })
                .populate({
                    path: 'anonymousBoard',
                    options: {sort: {_id: -1}, limit: 1} // 최근 1개의 익명게시물 추출
                })
                .populate({
                    path: 'goal',
                    options: {sort: {_id: -1}, limit: 3} // 상위 3개의 목표 추출
                })
                .populate('members', '_id') // 팀 멤버의 수를 계산하기 위해 ID만 추출
                .populate({
                    path: 'chat',
                    match: {date: {$gte: new Date(new Date() - 12 * 60 * 60 * 1000)}} // 12시간 내의 채팅 리스트 추출
                })
                .exec();
            const teamNotice = await Team.findById(teamId)
                .populate({
                    path:'notice',
                    options: {sort: {_id: -1}, limit: 3} // 최근 3개의 공지 추출
                }).exec()
            const teamInfo = {
                name: team.name,
                description: team.description,
                host:team.host.hostName,
                notice: team.notice,
                freeBoard: team.freeBoard, // 최근 1개의 자유게시물
                anonymousBoard: team.anonymousBoard, // 최근 1개의 익명게시물
                goal: team.goal,
                chatCount: team.chat.length, // 12시간 내의 채팅 리스트 길이
                memberCount: team.members.length // 팀 멤버 수
            };
            res.status(200).json(teamInfo);
            console.log(teamNotice)
        } catch (e) {
            console.error(e);
            res.status(500).json({error: 'Internal server error'});
        }
    },
    getTeamNotice: async (req, res) => {
        const {teamId} = req.params;
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const notice=await Team.find({_id:teamId},{notice:1})
            res.status(200).json(notice[0].notice)
        }catch (e) {
            console.error(e);
            res.status(500).json(e);
        }

    },
    postTeamNotice: async (req, res) => {
        const {teamId} = req.params;
        const {title, content} = req.body;
        try{
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const team=await Team.findById(teamId);
            const newNotice={
                noticeTitle:title,
                noticeContent:content,
                author:user.name,
                authorId:user._id
            }
            team.notice.push(newNotice);
            await team.save();
            res.status(200).json({msg:'success'})
        }catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    }

}

module.exports = teamControl;